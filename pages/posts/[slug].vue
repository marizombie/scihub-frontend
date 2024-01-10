<i18n lang="json">
{
  "en": {
    "upvoteTitle": "Create an account to like this story",
    "responseTitle": "Create an account to comment this story.",
    "followTitle": "Create an account to follow the author."
  }
}
</i18n>

<template>
  <v-row v-if="article">
    <v-col md="8">
      <v-card class="pa-3">
        <v-row>
          <v-col>
            <span class="ma-2">{{ article.created_at }}</span>
            <div class="pl-2 pr-2 author-block" @click="goToAuthorProfile(article.author_name)">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <v-img v-if="article.author_image" :src="$config.public.baseURL.slice(0, -1) + article.author_image"
                  :alt="article.author_name" />
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-avatar>
              <span>{{ article.author_name ? article.author_name : 'Anonymous' }}</span>
            </div>
          </v-col>
          <v-col cols="2" class="d-flex justify-end align-center">
            <v-btn variant="plain" :ripple="false" class="plain-custom-style" v-if="userStore.userInfo?.access"
              @click="addBookmark()">
              <v-icon v-if="!bookmarked"> mdi-bookmark </v-icon>
              <v-icon v-else color="primary"> mdi-bookmark-check </v-icon>
            </v-btn>
            <SocialShare :share-object="(sharing as Share)" :networks="networks" />
          </v-col>
        </v-row>

        <v-card-title class="text-wrap">{{ article.title }}</v-card-title>

        <v-img :src="$config.public.baseURL.slice(0, -1) + article.preview_image" />

        <v-card-text>
          <span>{{ article.content }}</span>
        </v-card-text>
        <div class="pl-4 pr-4 pb-4 tags d-flex flex-wrap">
          <v-card outlined v-for="(tag, index) in article.tags" :key="index" class="tag ma-1" @click="searchByTag(tag)">
            <span>{{ tag }}</span>
          </v-card>
        </div>
        <div class="pa-4 pt-0 d-flex align-center">
          <LikeButton @click="sendUpvote(article)" :toggable="!!userStore.userInfo?.access"
            :isClicked="article?.is_upvoted_by_current_user" />
          <span> {{ article.upvotes_count }} like(s)</span>
          <v-btn class="ml-3" icon dark variant="text" @click="showCommentsDialog = true">
            <v-icon>mdi-comment-multiple</v-icon>
            {{ article.comments_count }}
          </v-btn>
        </div>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="recomendation-block ml-md-8 pa-4 d-md-block">
        <div class="d-flex align-center mb-3 author-block" @click="goToAuthorProfile(article.author_name)">
          <v-avatar size="48" class="mr-1">
            <v-img v-if="article.author_image" :src="$config.public.baseURL.slice(0, -1) + article.author_image"
              :alt="article.author_name" />
            <v-icon size="48" v-else> mdi-account-circle </v-icon>
          </v-avatar>
          <div class="d-flex flex-column">
            <span class="title">{{
              article.author_name ? article.author_name : 'Anonymous'
            }}</span>
            <span class="subtitle">{{ article.author_followers_count }} follower(s)</span>
          </div>
        </div>
        <span class="subtitle mt-3">
        </span>
        <div class="mt-4">
          <v-btn v-if="!article.is_author_followed_by_current_user" :loading="followLoading"
            @click="followAuthor(article.author_name)" color="primary">
            Follow </v-btn>
          <v-btn variant="outlined" @click="followAuthor(article.author_name)" rounded color="success" v-else
            prepend-icon="mdi-check-circle">
            <template v-slot:prepend>
              <v-icon color="success"></v-icon>
            </template>
            Following
          </v-btn>
        </div>

        <div class="d-flex flex-column mt-16">
          <h3>What else to read:</h3>
          <NuxtLink v-for="(item, index) in recentlyWrittenPosts" :key="index" class="text-subtitle"
            :to="`/posts/${item.slug}`">
            <span class="title">{{ item.title }}</span>
            <div class="author-info">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <v-img v-if="item.author_image" :src="$config.public.baseURL.slice(0, -1) + item.author_image"
                  :alt="item.author_name" />
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-avatar>
              <span>{{ article.author_name ? article.author_name : 'Anonymous' }}</span>
            </div>
          </NuxtLink>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="showCommentsDialog" :fullscreen="!display.mdAndUp"
    :transition="!display.mdAndUp ? 'dialog-bottom-transition' : 'slide-x-reverse-transition'" class="comments-dialog"
    scrollable>
    <v-card :loading="commentsDialog.loading">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="showCommentsDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Comments</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div class="create-comment ma-4" v-if="userStore.userInfo">
        <v-textarea v-model="newCommentText" rows="3" variant="outlined" class="opacity"
          label="What are you thinking about this?" autofocus auto-grow></v-textarea>
        <div class="d-flex justify-end mr-4">
          <v-btn color="primary" @click="sendComment()">Send</v-btn>
        </div>
      </div>
      <div class="ma-4" v-for="(item, index) in commentsDialog.comments" :key="index">
        <div class="author-info d-flex">
          <v-avatar size="48" class="mr-1">
            <v-img v-if="item.author_image" :src="$config.public.baseURL.slice(0, -1) + item.author_image"
              :alt="item.author_name" />
            <v-icon v-else class="font-size-48"> mdi-account-circle </v-icon>
          </v-avatar>
          <div class="d-flex flex-column">
            <span>{{ item.author_name || "Anonymous" }}</span>
            <span>{{ formatTimeDifference(item.created_date) }}</span>
          </div>
        </div>
        <div class="ml-2 mt-2">
          {{ item.text }}
        </div>

        <div class="ml-2 mt-3 d-flex align-center">
          <LikeButton @click="sendUpvote(item)" :toggable="!!userStore.userInfo?.access"
            :is-clicked="item.is_upvoted_by_current_user" />
          <span> {{ item.upvotes_count }} like(s)</span>
          <v-btn @click="showReplies(item.id)" variant="plain" class="plain-custom-style ml-2 pt-1"
            prepend-icon="mdi-message-reply-outline" :ripple="false">
            <span>{{ item.replies_count + " reply" }}</span>
          </v-btn>
          <v-btn v-if="userStore.userInfo" class="ml-auto" variant="text" @click="showReply(item.id)">Reply</v-btn>
        </div>
        <div v-if="openReplies?.id === item.id && userStore.userInfo" class="mt-3">
          <v-textarea v-model="openReplies.value" rows="3" variant="outlined" class="opacity"
            :label="`Replying to ${item.author_name}`" autofocus auto-grow></v-textarea>
          <div class="d-flex justify-end mr-4">
            <v-btn color="primary" @click="sendComment(openReplies)">Send</v-btn>
          </div>
        </div>

        <div class="ml-4 mt-3 reply-comment" v-if="item.replies?.length">
          <div class="ml-3" v-for="(childItem, childIndex) in item.replies" :key="childIndex">
            <div class="author-info d-flex">
              <v-avatar size="48" class="mr-1">
                <v-img v-if="childItem.author_image" :src="$config.public.baseURL.slice(0, -1) + childItem.author_image"
                  :alt="childItem.author_name" />
                <v-icon v-else class="font-size-48"> mdi-account-circle </v-icon>
              </v-avatar>
              <div class="d-flex flex-column">
                <span>{{ childItem.author_name || "Anonymous" }}</span>
                <span>{{ formatTimeDifference(childItem.created_date) }}</span>
              </div>
            </div>
            <div class="ml-2 mt-2">
              {{ childItem.text }}
            </div>
            <div class="ml-2 mt-3 d-flex align-center">
              <LikeButton @click="sendUpvote(childItem)" :toggable="!!userStore.userInfo?.access"
                :is-clicked="childItem.is_upvoted_by_current_user" />
              <span> {{ childItem.upvotes_count }} like(s)</span>
            </div>
          </div>
        </div>
        <v-divider class="my-4" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import SocialShare from '@/components/SocialShare.vue'
import { useModalsStore, useNotificationStore, useUserStore } from "~/store";
import { Article, CommentData, Network, Share, SuccessResponse } from "~/types";


interface IdWithValue {
  id: number;
  value: string;
}
const route = useRoute();
const display = ref(useDisplay() || null);
const showCommentsDialog = ref(false);
const commentsDialog = ref({
  loading: false,
  comments: [] as CommentData[]
});
const followLoading = ref(false);
const networks: Ref<Network[]> = ref([
  { type: "copy", name: "Copy link", icon: "content-copy" },
  { type: "email", name: "Email", icon: "email" },
  { type: "facebook", name: "Facebook", icon: "facebook" },
  { type: "linkedin", name: "LinkedIn", icon: "linkedin" },
  {
    type: "telegram",
    name: "Telegram",
    icon: "fab fah fa-lg fa-telegram-plane",
  },
  { type: "twitter", name: "X (Twitter)", icon: "twitter" },
]);
const article: Ref<Article | null> = ref(null);
const recentlyWrittenPosts: Ref<Article[] | null> = ref(null);
const { data: articleData } = await useAPIFetch<Article>(
  `/api/posts/${route.params.slug}`,
);
article.value = articleData.value;
const { data: recentlyWrittenData } =
  await useAPIFetch<Article[]>("/api/last-posts/");
recentlyWrittenPosts.value = recentlyWrittenData.value!.slice(0, 3);
const bookmarked = ref(false);
if (article.value) {
  bookmarked.value = article.value.is_bookmarked_by_current_user;
}
const newCommentText = ref('');
const openReplies: Ref<IdWithValue | null> = ref(null);

const sharing = computed(() => {
  return {
    url: window.location.href,
    title: article.value ? article.value.title : '',
    description: article.value ? article.value.description : '',
    quote: article.value ? article.value.title : '',
    hashtags: article.value ? article.value.tags.join(',') : ['']
  };
});

async function goToAuthorProfile(username: string) {
  if (username) {
    await navigateTo(`/profile/${username}`);
  }
}

const userStore = useUserStore();
const { t } = useI18n({
  useScope: 'local'
})

function isComment(object: Article | CommentData): object is CommentData {
  return 'post' in object;
}

async function sendUpvote(item: Article | CommentData) {
  if (!userStore.userInfo?.access) {
    const modalStore = useModalsStore();
    await modalStore.setModal("SignUp", t('upvoteTitle'),);
  }
  if (userStore.userInfo?.access) {
    const { data, error } = await useAPIFetch("/api/toggle-upvote/", {
      method: "post",
      body: {
        "content_type": isComment(item) ? "comment" : "post",
        "object_id": item.id
      },
    });
    if (item.upvotes_count !== undefined) {
      if (item.is_upvoted_by_current_user) {
        item.upvotes_count -= 1;
        item.is_upvoted_by_current_user = false;
      } else {
        item.upvotes_count += 1;
        item.is_upvoted_by_current_user = true;
      }
    }
    if (error.value?.data) {
      if (error.value?.data.error === 'Already upvoted') {
        return;
      }
      if (error.value) {
        const notifyStore = useNotificationStore();
        await notifyStore.setNotification({
          type: "error",
          message: error.value.data.detail,
        });
      }
    }
  }
}

async function searchByTag(tag: string) {
  await navigateTo(`/?tag=${tag.replaceAll(' ', '-')}`);
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
  article.value!.is_author_followed_by_current_user = !article.value!.is_author_followed_by_current_user;
}

watch(showCommentsDialog, async (val) => {
  if (val) {
    commentsDialog.value.loading = true;
    const { data, error } = await useAPIFetch<CommentData[]>(`/api/comments/${article.value!.slug}`, {
      method: "get",
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
    if (data.value) {
      commentsDialog.value.comments = data.value.filter((item) => !item.parent_comment);
    }
    commentsDialog.value.loading = false;
  }
}, { deep: true })

if (route.query.comment_id) {
  showCommentsDialog.value = true;
}

function formatTimeDifference(dateString: string): string {
  const currentDate = new Date();
  const targetDate = new Date(dateString);

  const userTimeZoneOffset = currentDate.getTimezoneOffset();
  currentDate.setMinutes(currentDate.getMinutes() - userTimeZoneOffset);

  const timeDifference = currentDate.getTime() - targetDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 30) {
    return `${days} days ago`;
  } else {
    const formattedDate = targetDate.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    return formattedDate;
  }
}

async function addBookmark() {
  if (article.value) {
    const { data, error } = await useAPIFetch<SuccessResponse>(`http://localhost:8000/api/posts/${article.value.slug}/toggle-bookmark/`, {
      method: "post",
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
    if (!data.value?.success) {
      bookmarked.value = false;
    } else {
      bookmarked.value = true;
    }
  }
}

function showReply(id: number) {
  openReplies.value = { id, value: '' }
}

async function showReplies(id: number) {
  const { data, error } = await useAPIFetch<CommentData[]>(`http://localhost:8000/api/child-comments/${id}/`, {
    method: "get"
  });
  if (data.value) {
    commentsDialog.value.comments.find((item) => item.id === id)!.replies = data.value;
  }
  if (error.value?.data) {
    if (error.value) {
      const notifyStore = useNotificationStore();
      await notifyStore.setNotification({
        type: "error",
        message: error.value.data.detail,
      });
    }
  }
}

async function sendComment(replyData?: IdWithValue) {
  const { data, error } = await useAPIFetch<SuccessResponse>(`http://localhost:8000/api/comments/`, {
    method: "post",
    body: {
      "post": article.value!.slug,
      "text": replyData ? replyData.value : newCommentText.value,
      "parent_comment": replyData ? replyData.id : null
    },
  });
  if (replyData) {
    openReplies.value = null;
  }
  if (error.value?.data) {
    if (error.value) {
      const notifyStore = useNotificationStore();
      await notifyStore.setNotification({
        type: "error",
        message: error.value.data.detail,
      });
    }
  }
}

// TODO: Check upvoted data and show active if user already voted
// const { data, error } = await useAPIFetch(`/api/upvotes/post/${article.value!.id}`, {
//   method: "get",
// });

// TODO: Check meta data after deployment. https://nuxt.com/docs/getting-started/seo-meta
useSeoMeta({
  title: article.value ? article.value.title : '',
  ogTitle: article.value ? article.value.title : '',
  description: article.value ? article.value.description : '',
  ogDescription: article.value ? article.value.description : '',
  ogImage: article.value ? article.value.preview_image : '',
  twitterCard: 'summary_large_image',
})
</script>

<style lang="less" scoped>
@import "../../assets/breakpoints.less";

.linkWOStyles {
  text-decoration-line: unset;
  color: inherit;

  span {
    margin-left: 4px;
  }
}

.tags .tag {
  padding: 4px;
  width: fit-content;
  color: #c2bbbb;
}

.v-card-title {
  @media (min-width: @md-min) {
    font-size: 32px;
    word-break: break-word;
    padding: 24px;
    line-height: 38px;
  }
}

.author-block {
  cursor: pointer;
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

  .subtitle {
    color: #857f7f;
    font-size: 18px;
  }

  span {
    font-size: 14px;
  }

  a {
    color: inherit !important;
  }
}

.font-size-48 {
  font-size: 48px;
}

.comments-dialog {
  @media (min-width: @md-min) {
    width: 450px;
    left: auto;

    :deep(.v-overlay__content) {
      max-height: 100%;
      width: 100%;
      max-width: 100%;
      height: 100%;
    }
  }
}

.plain-custom-style {
  opacity: 1;
  text-transform: unset;
}

.reply-comment {
  border-left: 5px solid rgba(239, 239, 240, 1);
}

:deep(.v-img__img) {
  object-fit: cover;
}
</style>
