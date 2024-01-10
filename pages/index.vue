<template>
  <v-row justify-md="center">
    <v-col :class="[filterByTags.length ? 'mt-6' : '']" md="7">
      <div>
        <v-tabs v-model="tab" color="deep-purple-accent-4" v-if="userStore.userData?.access && !filterByTags.length">
          <v-tab :value="1">For you</v-tab>
          <v-tab :value="2">Bookmarks</v-tab>
          <v-tab :value="3">My articles</v-tab>
          <v-tab :value="4">Upvoted posts</v-tab>
          <v-tab :value="5">Upvoted comments</v-tab>
        </v-tabs>
        <div v-if="filterByTags.length" class="ml-4 mr-4 tags d-flex flex-wrap align-center">
          <v-chip-group>
            <v-chip v-for="tag in filterByTags" :key="tag" closable @click:close="removeTag(tag)">
              {{ tag.replaceAll("-", " ") }}
            </v-chip>
          </v-chip-group>
          <div>
            <v-btn @click="followTag(filterByTags)" :loading="followLoading"
              :variant="isFollowedCurrentTag ? 'outlined' : 'flat'"
              :prepend-icon="isFollowedCurrentTag ? 'mdi-check-circle' : ''"
              :color="isFollowedCurrentTag ? 'success' : 'primary'">
              {{ isFollowedCurrentTag ? 'Following' : 'Follow chosen tag(s)'
              }}</v-btn>
          </div>
        </div>
        <div v-if="currentShowList?.length">
          <div v-if="currentRequest === `api/upvoted-comments/`">
            <v-card v-for="(commentData, index) in (currentShowList as CommentData[])" :key="index" class="article mb-4"
              @click="goToComment(commentData)">
              <div class="text-wrap pa-2 pl-4 d-flex">
                {{ commentData.author_name }}
                <span class="ml-auto">{{ commentData.created_date }}</span>
              </div>
              <v-divider />
              <v-card-text>
                {{ commentData.text }}
              </v-card-text>
            </v-card>
          </div>
          <div v-else>
            <v-card v-for="(article, index) in (currentShowList as Article[])" :key="index" class="article mb-4"
              @click="navigateTo(`/posts/${article.slug}`)" :ripple="false">
              <v-card-title class="text-wrap">{{ article.title }}</v-card-title>
              <div class="pa-4 d-flex flex-column flex-md-row">
                <!-- TODO: rewrite src generation to util function -->
                <img :src="$config.public.baseURL.slice(0, -1) + article.preview_image" alt="demo picture" />
                <div>
                  <v-card-text>
                    {{ article.description }}
                  </v-card-text>
                  <div class="pl-4 pr-4 pb-4 tags d-flex flex-wrap">
                    <v-card variant="elevated" v-for="(tag, index) in article.tags" :key="index"
                      @click.native="searchByTag(tag)" class="tag ma-1">
                      <span>{{ tag }}</span>
                    </v-card>
                  </div>
                  <span class="ma-4">Published on {{ article.created_at }}</span>
                  <div class="pl-4 pr-4 pt-2" @click.prevent="goToAuthorProfile(article.author_name)">
                    <span class="mr-1">by</span>
                    <v-avatar size="20" class="mr-1">
                      <v-img v-if="article.author_image" :src="$config.public.baseURL.slice(0, -1) + article.author_image"
                        :alt="article.author_name" />
                      <v-icon v-else> mdi-account-circle </v-icon>
                    </v-avatar>
                    <span>{{ article.author_name ? article.author_name :
                      'Anonymous' }}</span>
                  </div>
                </div>
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </v-col>
    <v-card class="recomendation-block ml-8 d-sm-none d-none d-md-block">
      <div class="d-flex flex-column">
        <h3>Recommendations:</h3>
        <NuxtLink v-for="(item, index) in recommendedPosts" :key="index" class="text-subtitle"
          :to="`/posts/${item.slug}`">
          <span class="title">{{ item.title }}</span>
          <div class="author-info">
            <span class="mr-1">by</span>
            <v-avatar size="20" class="mr-1">
              <v-img v-if="item.author_image" :src="$config.public.baseURL.slice(0, -1) + item.author_image" alt="John" />
              <v-icon v-else> mdi-account-circle </v-icon>
            </v-avatar>
            <span>{{ item.author_name ? item.author_name : 'Anonymous' }}</span>
          </div>
        </NuxtLink>
      </div>
      <div class="d-flex flex-column mt-6">
        <h3>Recently written:</h3>
        <NuxtLink v-for="(item, index) in recentlyWrittenPosts" :key="index" class="text-subtitle"
          :to="`/posts/${item.slug}`">
          <span class="title">{{ item.title }}</span>
          <div class="author-info">
            <span class="mr-1">by</span>
            <v-avatar size="20" class="mr-1">
              <v-img v-if="item.author_image" :src="$config.public.baseURL.slice(0, -1) + item.author_image" alt="John" />
              <v-icon v-else> mdi-account-circle </v-icon>
            </v-avatar>
            <span>{{ item.author_name ? item.author_name : 'Anonymous' }}</span>
          </div>
        </NuxtLink>
      </div>
    </v-card>
  </v-row>
</template>

<script setup lang="ts">
import { useNotificationStore, useUserStore } from '~/store';
import { Article, CommentData, SuccessResponse } from '~/types';

interface CRUDResponse {
  results: (Article | CommentData)[];
}

const route = useRoute();
const userStore = useUserStore();
const filterByTags: Ref<string[]> = ref([]);
const { data: recentlyWritten } =
  await useAPIFetch<Article[]>("/api/last-posts/");
const { data: recomendations } =
  await useAPIFetch<Article[]>("api/popular-posts/");
const followLoading = ref(false);
const isFollowedCurrentTag = ref(false);
const tab = ref(1);
const currentShowList: Ref<(Article | CommentData)[]> = ref([]);
const currentRequest = ref('');

useInfiniteScroll(
  document,
  loadData,
  { distance: 200 }
)

async function loadData() {
  const { data: posts } = await useAPIFetch<CRUDResponse>(currentRequest.value + `?limit=5&offset=${currentShowList.value.length}`);
  currentShowList.value = currentShowList.value.concat(posts.value!.results)
}

async function fetchDefaultPosts() {
  const { data: posts } = await useAPIFetch<CRUDResponse>("/api/posts/");
  currentRequest.value = '/api/posts/';
  currentShowList.value = posts.value!.results;
}

watch(tab, async (val) => {
  if (filterByTags.value.length) {
    return;
  }
  switch (val) {
    case 2:
      const { data: bookmarkPosts } = await useAPIFetch<CRUDResponse>(`/api/bookmarks/?limit=5&offset=0`);
      currentRequest.value = '/api/bookmarks/';
      currentShowList.value = bookmarkPosts.value!.results;
      break;
    case 3:
      const { data: myArticles } = await useAPIFetch<CRUDResponse>(`api/users/${userStore.userInfo?.username}`);
      currentRequest.value = `api/users/${userStore.userInfo?.username}`;
      currentShowList.value = myArticles.value!.results;
      break;
    case 4:
      const { data: upvotedPosts } = await useAPIFetch<CRUDResponse>(`api/upvoted-posts/`);
      currentRequest.value = `api/upvoted-posts/`;
      currentShowList.value = upvotedPosts.value!.results;
      break;
    case 5:
      const { data: upvotedComments } = await useAPIFetch<CRUDResponse>(`api/upvoted-comments/`);
      currentRequest.value = `api/upvoted-comments/`;
      currentShowList.value = upvotedComments.value!.results;
      break;
    case 1:
    default:
      fetchDefaultPosts()
      break;
  }
}, { immediate: true })

showTagList();

watch(() => route.query.tag, () => {
  showTagList();
})

async function showTagList() {
  if (route.query.tag) {
    filterByTags.value = Array.isArray(route.query.tag) ? route.query.tag as string[] : [route.query.tag];
    const { data: followed } = await useAPIFetch<SuccessResponse>(`api/is-tag-followed/${filterByTags.value}/`);
    if (typeof followed.value?.success === 'boolean') {
      isFollowedCurrentTag.value = followed.value.success;
    }
    const { data: tagPosts } = await useAPIFetch<CRUDResponse>(`/api/tags/${filterByTags.value}/?limit=5&offset=0`);
    currentRequest.value = `/api/tags/${filterByTags.value}/`;
    if (tagPosts.value?.results.length) {
      currentShowList.value = tagPosts.value?.results;
    }
  }
}

async function goToAuthorProfile(username: string) {
  if (username) {
    await navigateTo(`/profile/${username}`);
  }
}

async function goToComment(commentData: CommentData) {
  if (commentData) {
    await navigateTo(`/posts/${commentData.post_slug}?comment_id=${commentData.id}`)
  }
}

function removeTag(tag: string) {
  filterByTags.value = filterByTags.value.filter((item) => item !== tag);
  navigateTo('/')
}

async function searchByTag(tag: string) {
  await navigateTo(`/?tag=${tag.replaceAll(' ', '-')}`);
}

async function followTag(tags: string[]) {
  followLoading.value = true;
  for (const tag of tags) {
    const { data, error } = await useAPIFetch<CommentData[]>(`api/toggle-follow/tag/${tag}/`, {
      method: "post"
    });
    if (error.value?.data) {
      if (error.value) {
        const notifyStore = useNotificationStore();
        await notifyStore.setNotification({
          type: "error",
          message: error.value.data.detail,
        });
      }
    }
    isFollowedCurrentTag.value = !isFollowedCurrentTag.value;
  }
  followLoading.value = false;
}

let recentlyWrittenPosts = recentlyWritten.value;
let recommendedPosts = recomendations.value;
</script>

<style lang="less" scoped>
.text-subtitle {
  text-decoration: none;
}

.article {
  img {
    min-width: 300px;
    max-width: 300px;
  }

  .v-card-title {
    font-size: 32px;
    word-break: break-word;
    line-height: 38px;
  }

  .tags .tag {
    padding: 4px;
    width: fit-content;
  }

  span {
    color: #c2bbbb;
  }
}

.recomendation-block {
  position: sticky;
  top: 100px;
  align-self: flex-start;
  background: inherit;
  box-shadow: none !important;
  max-width: 330px;

  h3 {
    font-size: 24px;
  }

  .title {
    font-size: 20px;
    font-weight: 400;
  }

  span {
    font-size: 14px;
  }

  a {
    color: inherit !important;
  }
}

:deep(.v-img__img) {
  object-fit: cover;
}
</style>
