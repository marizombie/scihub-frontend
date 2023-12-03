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
                <img v-if="article.author_image" :src="article.author_image" :alt="article.author_name" />
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-avatar>
              <span>{{ article.author_name ? article.author_name : 'Anonymous' }}</span>
            </div>
          </v-col>
          <v-col cols="2" class="d-flex justify-end align-center">
            <SocialShare :share-object="(sharing as Share)" :networks="networks" />
          </v-col>
        </v-row>

        <v-card-title class="text-wrap">{{ article.title }}</v-card-title>

        <v-img :src="article.image" />

        <v-card-text>
          <span>{{ article.content }}</span>
        </v-card-text>
        <div class="pl-4 pr-4 pb-4 tags d-flex flex-wrap">
          <v-card outlined v-for="(tag, index) in article.tags" :key="index" class="tag ma-1">
            <span>{{ tag }}</span>
          </v-card>
        </div>
        <div class="pa-4 pt-0 d-flex align-center">
          <LikeButton @click="sendUpvote()" :toggable="!!userStore.userInfo?.access" />
          <span> {{ article.upvotes_count }} like(s)</span>
          <v-btn class="ml-3" icon dark variant="text" @click="showCommentsDialog = true">
            <v-icon>mdi-comment-multiple</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="recomendation-block ml-md-8 pa-4 d-md-block">
        <div class="d-flex align-center mb-3 author-block" @click="goToAuthorProfile(article.author_name)">
          <v-avatar size="48" class="mr-1">
            <img v-if="article.author_image" :src="article.author_image" :alt="article.author_name" />
            <v-icon size="48" v-else> mdi-account-circle </v-icon>
          </v-avatar>
          <div class="d-flex flex-column">
            <span class="title">{{
              article.author_name ? article.author_name : 'Anonymous'
            }}</span>
            <span class="subtitle">500 followers</span>
          </div>
        </div>
        <span class="subtitle mt-3">
          <!-- {{ article.author_description }} -->
        </span>
        <div class="mt-4">
          <v-btn @click="followAuthor(article.author_name)" color="primary"> Follow </v-btn>
        </div>

        <div class="d-flex flex-column mt-16">
          <h3>What else to read:</h3>
          <NuxtLink v-for="(item, index) in recentlyWrittenPosts" :key="index" class="text-subtitle"
            :to="`/posts/${item.slug}`">
            <span class="title">{{ item.title }}</span>
            <div class="author-info">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <img v-if="item.author_image" :src="item.author_image" :alt="item.author_name" />
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
      <div class="ma-4" v-for="(item, index) in commentsDialog.comments" :key="index">
        <div class="author-info d-flex">
          <v-avatar size="48" class="mr-1">
            <img v-if="item.author_image" :src="item.author_image" :alt="item.author_name" />
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
          <LikeButton @click="sendUpvote()" :toggable="!!userStore.userInfo?.access" />
          <span> {{ item.upvotes_count }} like(s)</span>
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

interface Article {
  content: string;
  created_at: string;
  description: string;
  id: number;
  image: string;
  slug: string;
  tags: string[];
  title: string;
  author_name: string;
  author_image: string;
  upvotes_count: number;
}

interface Author {
  firstName: string;
  lastName: string;
  img: string;
  description: string;
}

interface Share {
  url: string;
  title: string;
  description: string;
  quote: string;
  hashtags: string[];
  twitterUser: string;
  imageURL: string;
}

interface Network {
  type: string;
  name: string;
  icon: string;
}

interface Comment {
  author_image: string;
  author_name: string;
  created_date: string;
  id: number;
  parent_comment: number;
  post: string;
  text: string;
  upvotes_count: number;
}

const route = useRoute();
const display = ref(useDisplay() || null);
const showCommentsDialog = ref(false);
const commentsDialog = ref({
  loading: false,
  comments: [] as Comment[]
});
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

const sharing = computed(() => {
  return {
    url: window.location.href,
    title: article.value ? article.value.title : '',
    description: article.value ? article.value.description : '',
    quote: article.value ? article.value.title : '',
    hashtags: article.value ? article.value.tags.join(',') : ['']
  };
});

async function redirectToHomePage() {
  await navigateTo("/");
}

async function goToAuthorProfile(username: string) {
  if (username) {
    await navigateTo(`/profile/${username}`);
  }
}

const userStore = useUserStore();
const { t } = useI18n({
  useScope: 'local'
})

async function sendUpvote() {
  if (!userStore.userInfo?.access) {
    const modalStore = useModalsStore();
    await modalStore.setModal("SignUp", t('upvoteTitle'),);
  }
  if (userStore.userInfo?.access) {
    const { data, error } = await useAPIFetch("/api/upvote/", {
      method: "post",
      body: {
        "content_type": "post",
        "object_id": article.value!.id
      },
    });
    if (article.value?.upvotes_count !== undefined) {
      article.value.upvotes_count += 1;
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

async function followAuthor(name: string) {
  if (!userStore.userInfo?.access) {
    const modalStore = useModalsStore();
    await modalStore.setModal("SignUp", t('followTitle'),);
  }
}

watch(showCommentsDialog, async (val) => {
  if (val) {
    commentsDialog.value.loading = true;
    const { data, error } = await useAPIFetch<Comment[]>(`/api/comments/${article.value!.slug}`, {
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

function formatTimeDifference(dateString: string): string {
  const currentDate = new Date();
  const targetDate = new Date(dateString);

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
    // More than 1 month, return the formatted date
    const formattedDate = targetDate.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return formattedDate;
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
  ogImage: article.value ? article.value.image : '',
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
    width: 550px;
    left: auto;

    :deep(.v-overlay__content) {
      max-height: 100%;
      width: 100%;
      max-width: 100%;
    }
  }
}
</style>
