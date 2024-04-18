<i18n lang="json">
  {
    "en": {
      "followTitle": "Create an account to follow the tag."
  }
}
</i18n>

<template>
  <v-row justify="center" v-if="showDeleteDialog">
    <v-dialog v-model="showDeleteDialog" max-width="600px">
      <v-card>
        <v-card-title class="mt-4">
          <span class="text-h5 pl-6">Are you sure want to delete?</span>
        </v-card-title>
        <v-card-text class="pb-0">
          Deletion is not reversible. After you delete your story, we can't help you to restore it.
        </v-card-text>
        <v-card-actions class="mb-4">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" variant="text" @click="showDeleteDialog = false">
            Cancel
          </v-btn>
          <v-btn variant="text" class="mr-6 removeClass" @click="onDeletePost()">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  <v-row justify-md="center">
    <v-col :class="[filterByTags.length ? 'mt-6' : '']" md="7">
      <div>
        <v-tabs mobile-breakpoint="xxl" class="mb-8" v-model="tab" color="deep-purple-accent-4"
          v-if="userStore.userData?.access && !filterByTags.length">
          <v-tab class="pa-0 ma-0" style="min-width:0px" />
          <v-tab :value="1">For you</v-tab>
          <v-tab :value="2">Bookmarks</v-tab>
          <v-tab :value="3">My posts</v-tab>
          <v-tab :value="4">Drafts</v-tab>
          <v-tab :value="5">Upvoted posts</v-tab>
          <v-tab :value="6">Upvoted comments</v-tab>
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
            <v-card v-for="(article, index) in (currentShowList as Article[])" :key="index" class="article mb-8"
              @click="navigateTo(currentRequest === `api/drafts/` ? `/posts/create?draftSlug=${article.slug}` : `/posts/${article.slug}`)" :ripple="false">
              <div class="d-flex align-baseline">
                <h3 class="test text-wrap">{{ article.title }}</h3>
                <v-menu offset-y
                  v-if="currentRequest === `api/users/${userStore.userInfo?.username}` || currentRequest === `api/drafts/`">
                  <template v-slot:activator="{ props }">
                    <v-btn class="plain-custom-style" variant="plain" size="large" v-bind="props" :ripple="false">
                      <v-icon size="30">
                        mdi-dots-vertical
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list density="compact">
                    <v-list-item v-for="(item, index) in postActions" :key="index" link @click="item.action(article)">
                      <v-list-item-title :class="item.class ? item.class : ''">{{ item.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
              <div class="pa-4 d-flex flex-column flex-md-row">
                <!-- TODO: rewrite src generation to util function -->
                <img :src="article.preview_image" alt="demo picture" />
                <div>
                  <v-card-text class="article-description">
                    {{ article.description }}
                  </v-card-text>
                  <div class="pl-4 pr-4 pb-4 tags d-flex flex-wrap">
                    <v-card variant="elevated" v-for="(tag, index) in article.tags" :key="index"
                      @click.native="searchByTag(tag)" class="tag ma-1">
                      <span>{{ tag }}</span>
                    </v-card>
                  </div>
                  <span class="ma-4">Published on {{ article.created_at }}</span>
                  <div class="pl-4 pr-4 pt-2" @click.prevent="goToAuthorPosts(article.author_name)">
                    <span class="mr-1">by</span>
                    <v-avatar size="20" class="mr-1">
                      <v-img v-if="article.author_image" :src="article.author_image" :alt="article.author_name" />
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
        <div class="full-height" v-else></div>
      </div>
    </v-col>
    <v-card class="recomendation-block ml-8 d-sm-none d-none d-md-block">
      <div class="d-flex flex-column">
        <div v-if="userProfile" class="mb-12">
          <div class="d-flex align-center mb-3 author-block" @click="goToAuthorPosts(userProfile.username)">
            <v-avatar size="48" class="mr-1">
              <v-img v-if="userProfile.avatar_url" :src="userProfile.avatar_url" :alt="userProfile.avatar_url" />
              <v-icon size="48" v-else> mdi-account-circle </v-icon>
            </v-avatar>
            <div class="d-flex flex-column">
              <span class="title">{{
                route.query.userName ? route.query.userName : 'Anonymous'
              }}</span>
              <span class="subtitle">{{ userProfile.followers_count }} follower(s)</span>
            </div>
          </div>
          <span class="subtitle mt-3">
            {{ userProfile.about }}
          </span>
          <div class="mt-4" v-if="userProfile.username !== userStore.userInfo?.username">
            <v-btn v-if="!userProfile.is_followed_by_current_user" :loading="followLoading"
              @click="followAuthor(userProfile.username)" color="primary">
              Follow </v-btn>
            <v-btn variant="outlined" @click="followAuthor(userProfile.username)" rounded color="success" v-else
              prepend-icon="mdi-check-circle">
              <template v-slot:prepend>
                <v-icon color="success"></v-icon>
              </template>
              Following
            </v-btn>
          </div>
        </div>

        <h3 class="mb-5">Recommendations:</h3>
        <NuxtLink v-for="(item, index) in recommendedPosts" :key="index" class="text-subtitle mb-5"
          :to="`/posts/${item.slug}`">
          <span class="title">{{ item.title }}</span>
          <div class="author-info" @click.prevent="goToAuthorPosts(item.author_name)">
            <span class="mr-1">by</span>
            <v-avatar size="20" class="mr-1">
              <v-img v-if="item.author_image" :src="item.author_image" alt="John" />
              <v-icon v-else> mdi-account-circle </v-icon>
            </v-avatar>
            <span>{{ item.author_name ? item.author_name : 'Anonymous' }}</span>
          </div>
        </NuxtLink>
      </div>
      <div class="d-flex flex-column mt-12" v-if="!filterByUser">
        <h3 class="mb-5">Recently written:</h3>
        <NuxtLink v-for="(item, index) in recentlyWrittenPosts" :key="index" class="text-subtitle mb-5"
          :to="`/posts/${item.slug}`">
          <span class="title">{{ item.title }}</span>
          <div class="author-info" @click.prevent="goToAuthorPosts(item.author_name)">
            <span class="mr-1">by</span>
            <v-avatar size="20" class="mr-1">
              <v-img v-if="item.author_image" :src="item.author_image" alt="John" />
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
import { useModalsStore, useNotificationStore, useUserStore } from '~/store';
import type { Article, CommentData, ProfileInfo, SuccessResponse } from '~/types';

interface CRUDResponse {
  results: (Article | CommentData)[];
}

const route = useRoute();
const userStore = useUserStore();
const filterByTags: Ref<string[]> = ref([]);
const filterByUser: Ref<string> = ref('');
const { data: recentlyWritten } =
  await useAPIFetch<Article[]>("/api/last-posts/");
const { data: recomendations } =
  await useAPIFetch<Article[]>("api/popular-posts/");
const followLoading = ref(false);
const isFollowedCurrentTag = ref(false);
const tab: Ref<number | null> = ref(null);
const currentShowList: Ref<(Article | CommentData)[]> = ref([]);
const currentRequest = ref('');
const userProfile: Ref<null | ProfileInfo> = ref(null)
const showDeleteDialog = ref(false);
const deletePostSlug = ref('');
const deleteDraftSlug = ref('');
const postActions = ref([
  {
    name: "Edit",
    action: (post: Article) => currentRequest.value === `api/users/${userStore.userInfo?.username}` ? navigateTo(`/posts/create?postSlug=${post.slug}`) : navigateTo(`/posts/create?draftSlug=${post.slug}`)
  },
  {
    name: "Remove",
    class: 'removeClass',
    action: (post: Article) => {
      showDeleteDialog.value = true;
      if (currentRequest.value === `api/users/${userStore.userInfo?.username}`) {
        deletePostSlug.value = post.slug;
      } else {
        deleteDraftSlug.value = post.slug;
      }
    }
  },
]);

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
  tab.value = 1;
  const { data: posts } = await useAPIFetch<CRUDResponse>("/api/posts/");
  currentRequest.value = '/api/posts/';
  currentShowList.value = posts.value!.results;
}

watch(tab, async (val, oldVal) => {
  if (filterByTags.value.length) {
    return;
  }
  if (route.query.userName && oldVal === 0) {
    const router = useRouter()
    router.replace('/')
    filterByUser.value = '';
    userProfile.value = null;
  }

  switch (val) {
    case 0:
      break;
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
      const { data: drafts } = await useAPIFetch<CRUDResponse>(`api/drafts/?limit=5&offset=0`, {
        method: "get"
      });
      currentRequest.value = `api/drafts/`;
      currentShowList.value = drafts.value!.results;
      break;
    case 5:
      const { data: upvotedPosts } = await useAPIFetch<CRUDResponse>(`api/upvoted-posts/`);
      currentRequest.value = `api/upvoted-posts/`;
      currentShowList.value = upvotedPosts.value!.results;
      break;
    case 6:
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

watch(() => route.query.showDraft, (val) => {
  if (val) {
    const router = useRouter()
    tab.value = 4;
    router.replace('/');
  }
}, { immediate: true })

showTagList();

watch(() => route.query.tag, (val) => {
  if (val) {
    showTagList();
  }
})

watch(() => route.query.userName, async (val, oldVal) => {
  if (route.query.userName) {
    tab.value = 0;
    filterByUser.value = route.query.userName.toString();
    const { data: userPosts } = await useAPIFetch<CRUDResponse>(`/api/users/${route.query.userName}/`);
    currentRequest.value = `/api/users/${route.query.userName}/`;
    currentShowList.value = userPosts.value!.results;

    const { data: profileInfo } = await useAPIFetch<ProfileInfo>(`/api/profile/${route.query.userName}`);
    if (profileInfo.value) {
      userProfile.value = profileInfo.value;
    }
  }
}, { immediate: true })

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

async function goToAuthorPosts(username: string) {
  if (username) {
    await navigateTo(`/?userName=${username}`);
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

async function onDeletePost() {
  const { error } = await useAPIFetch<CommentData[]>(deletePostSlug.value ? `api/posts/${deletePostSlug.value}/` : `api/drafts/${deleteDraftSlug.value}/`, {
    method: "delete"
  });
  if (error.value) {
    const notifyStore = useNotificationStore();
    await notifyStore.setNotification({
      type: "error",
      message: error.value.data.detail,
    });
  } else {
    currentShowList.value = (currentShowList.value as Article[]).filter((item: Article) => deletePostSlug.value ? item.slug !== deletePostSlug.value : item.slug !== deleteDraftSlug.value);
    deletePostSlug.value = '';
    deleteDraftSlug.value = '';
  }
  showDeleteDialog.value = false;
}

const { t } = useI18n({
  useScope: 'local'
})

async function followTag(tags: string[]) {
  followLoading.value = true;
  for (const tag of tags) {
    if (userStore.userInfo?.access) {
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
      } else {
        isFollowedCurrentTag.value = !isFollowedCurrentTag.value;
      }
    } else {
      const modalStore = useModalsStore();
      await modalStore.setModal("SignUp", t('followTitle'),);
    }
  }
  followLoading.value = false;
}

async function followAuthor(name: string) {
  if (!userStore.userInfo?.access) {
    const modalStore = useModalsStore();
    await modalStore.setModal("SignUp", t('followTitle'),);
    return;
  }
  followLoading.value = true;
  const { data, error } = await useAPIFetch<CommentData[]>(`api/toggle-follow/user/${name}/`, {
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
  followLoading.value = false;
  userProfile.value!.is_followed_by_current_user = !userProfile.value!.is_followed_by_current_user;
}

let recentlyWrittenPosts = recentlyWritten.value;
let recommendedPosts = recomendations.value;
</script>

<style lang="less" scoped>
@import "../assets/breakpoints.less";

.text-subtitle {
  text-decoration: none;
}

.article {
  img {
    min-width: 300px;

    @media (min-width: @md-min) {
      max-width: 300px;
    }
  }

  .v-card-title {
    font-size: 32px;
    word-break: break-word;
    line-height: 38px;
    font-weight: 700;
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
    font-size: 1rem;
    font-weight: 400;
  }

  span {
    font-size: 14px;
  }

  .subtitle {
      color: #857f7f;
      font-size: 18px;
    }

  a {
    color: inherit !important;
  }
}

:deep(.v-img__img) {
  object-fit: cover;
}

.article-description {
  font-size: 1.125rem;
}

.test {
  display: block;
  flex: none;
  font-size: 1.25rem;
  font-weight: 500;
  hyphens: auto;
  letter-spacing: 0.0125em;
  min-width: 0;
  overflow-wrap: normal;
  overflow: hidden;
  padding: 0.5rem 1rem;
  text-overflow: ellipsis;
  text-transform: none;
  white-space: nowrap;
  word-break: normal;
  word-wrap: break-word;
  font-size: 32px;
  word-break: break-word;
  line-height: 38px;
  font-weight: 700;
  width: 92%;
}

.removeClass {
  color: rgb(var(--v-theme-error));
}

.full-height {
  min-height: 100vh;
}
</style>
