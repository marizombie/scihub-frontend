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
  <v-dialog v-model="showDeleteDialog" max-width="600px" class="delete-modal">
    <v-card>
      <v-card-title class="mt-4 pa-0 pl-4 pb-4">
        <span class="text-h5">Are you sure want to delete?</span>
      </v-card-title>
      <v-card-text class="pa-0 pl-4">
        Deletion is not reversible. After you delete your story, we can't help
        you to restore it.
      </v-card-text>
      <v-card-actions class="mb-4">
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          variant="text"
          @click="showDeleteDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn variant="text" class="mr-6 removeClass" @click="onDeletePost()">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-row v-if="article" justify-md="center" class="main-container">
    <v-col md="9" class="main-content">
      <v-card class="pa-3">
        <v-row>
          <v-col>
            <span class="ma-2">{{ article.created_at }}</span>
            <div
              class="pl-2 pr-2 author-block"
              @click="goToAuthorPosts(article.author_name)"
            >
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <v-img
                  v-if="article.author_image"
                  :src="article.author_image"
                  :alt="article.author_name"
                />
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-avatar>
              <span>{{
                article.author_name ? article.author_name : 'Anonymous'
              }}</span>
            </div>
          </v-col>
          <v-col
            :cols="!display.mdAndUp ? 3 : 2"
            class="d-flex justify-end align-center post-top-buttons"
          >
            <v-btn
              variant="plain"
              :ripple="false"
              class="plain-custom-style"
              v-if="userStore.userInfo?.access"
              @click="addBookmark()"
            >
              <v-tooltip activator="parent" location="bottom"
                >Add to bookmarks</v-tooltip
              >
              <v-icon size="26" v-if="!bookmarked"> mdi-bookmark </v-icon>
              <v-icon size="26" v-else color="primary">
                mdi-bookmark-check
              </v-icon>
            </v-btn>
            <ClientOnly>
              <SocialShare :share-object="sharing" :networks="networks">
                <v-tooltip activator="parent" location="bottom"
                  >Share</v-tooltip
                >
              </SocialShare>
            </ClientOnly>
            <v-menu
              offset-y
              v-if="article.author_name === userStore.userInfo?.username"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  class="plain-custom-style"
                  variant="plain"
                  size="large"
                  v-bind="props"
                  :ripple="false"
                >
                  <v-icon size="30"> mdi-dots-vertical </v-icon>
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item
                  v-for="(item, index) in postActions"
                  :key="index"
                  link
                  @click="item.action(article)"
                >
                  <v-list-item-title :class="item.class ? item.class : ''">{{
                    item.name
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

        <v-card-title class="text-wrap pb-0">{{ article.title }}</v-card-title>

        <v-card-text>
          <div class="article-content">
            <ContentBlock :blockData="article.content" />
          </div>
        </v-card-text>

        <div class="pl-4 pr-4 pb-4 tags d-flex flex-wrap">
          <v-card
            outlined
            v-for="(tag, index) in article.tags"
            :key="index"
            class="tag ma-1"
            @click="searchByTag(tag)"
          >
            <span>{{ tag }}</span>
          </v-card>
        </div>
        <div class="pa-4 pt-0 d-flex align-center">
          <LikeButton
            @click="sendUpvote(article)"
            :toggable="!!userStore.userInfo?.access"
            :is-clicked="
              !!userStore.userInfo && article?.is_upvoted_by_current_user
            "
          />
          <span> {{ article.upvotes_count }} </span>
          <v-btn
            class="ml-3"
            icon
            dark
            variant="text"
            @click="showCommentsDialog = true"
            :ripple="false"
          >
            <v-tooltip activator="parent" location="bottom"
              >Open comments</v-tooltip
            >
            <v-icon size="24">mdi-comment-multiple</v-icon>
            {{ article.comments_count }}
          </v-btn>
        </div>
      </v-card>
    </v-col>
    <v-col :md="display.lgAndUp ? 2 : display.mdAndDown ? '' : 3">
      <v-card class="recomendation-block pa-4 d-md-block">
        <div
          class="d-flex align-center mb-3 author-block"
          @click="goToAuthorPosts(article.author_name)"
        >
          <v-avatar size="48" class="mr-1">
            <v-img
              v-if="article.author_image"
              :src="article.author_image"
              :alt="article.author_name"
            />
            <v-icon size="48" v-else> mdi-account-circle </v-icon>
          </v-avatar>
          <div class="d-flex flex-column">
            <span class="title">{{
              article.author_name ? article.author_name : 'Anonymous'
            }}</span>
            <span class="subtitle"
              >{{ article.author_followers_count }} follower(s)</span
            >
          </div>
        </div>
        <span class="subtitle mt-3">
          {{ article.author_about }}
        </span>
        <div
          class="mt-4"
          v-if="article.author_name !== userStore.userInfo?.username"
        >
          <v-btn
            v-if="
              !article.is_author_followed_by_current_user || !userStore.userInfo
            "
            :loading="followLoading"
            @click="followAuthor(article.author_name)"
            color="primary"
          >
            Follow
          </v-btn>
          <v-btn
            variant="outlined"
            @click="followAuthor(article.author_name)"
            rounded
            color="success"
            v-else
            prepend-icon="mdi-check-circle"
          >
            <template v-slot:prepend>
              <v-icon color="success"></v-icon>
            </template>
            Following
          </v-btn>
        </div>

        <div class="d-flex flex-column mt-16">
          <h3>What else to read:</h3>
          <NuxtLink
            v-for="(item, index) in recentlyWrittenPosts"
            :key="index"
            class="text-subtitle"
            :to="`/posts/${item.slug}`"
          >
            <span class="title">{{ item.title }}</span>
            <div class="author-info">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <v-img
                  v-if="item.author_image"
                  :src="item.author_image"
                  :alt="item.author_name"
                />
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-avatar>
              <span>{{
                article.author_name ? article.author_name : 'Anonymous'
              }}</span>
            </div>
          </NuxtLink>
        </div>
        <div class="about-us pt-3">
          <a href="/cookies-info" target="_blank">Cookies info</a>
          <a href="/privacy-policy" target="_blank">Privacy Policy</a>
          <a href="/terms-of-service" target="_blank">Terms of Service</a>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog
    v-model="showCommentsDialog"
    :fullscreen="!display.mdAndUp"
    :transition="
      !display.mdAndUp
        ? 'dialog-bottom-transition'
        : 'slide-x-reverse-transition'
    "
    class="comments-dialog"
    scrollable
  >
    <v-card :loading="commentsDialog.loading">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="showCommentsDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Comments</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div class="create-comment ma-4" v-if="userStore.userInfo">
        <v-textarea
          v-model="newCommentText"
          rows="3"
          variant="outlined"
          class="opacity"
          label="What are you thinking about this?"
          autofocus
          auto-grow
        ></v-textarea>
        <div class="d-flex justify-end mr-4">
          <v-btn
            :disabled="!newCommentText.length"
            color="primary"
            @click="sendComment()"
            >Send</v-btn
          >
        </div>
      </div>
      <div v-else>
        <v-alert type="info" variant="tonal">
          Please, <a @click="showSignUpModal()">sign up</a> if you want to leave
          a comment
        </v-alert>
      </div>
      <div
        v-for="(item, index) in commentsDialog.comments"
        :key="index"
        class="ma-4"
        v-if="commentsDialog.comments.length"
      >
        <div :class="[createdCommentId === item.id ? 'created-comment' : '']">
          <div
            class="author-info author-block d-flex ml-2"
            @click="goToAuthorPosts(item.author_name)"
          >
            <v-avatar size="48" class="mr-1">
              <v-img
                v-if="item.author_image"
                :src="item.author_image"
                :alt="item.author_name"
              />
              <v-icon v-else class="font-size-48"> mdi-account-circle </v-icon>
            </v-avatar>
            <div class="d-flex flex-column">
              <span>{{ item.author_name || 'Anonymous' }}</span>
              <span>{{ item.created_date }}</span>
            </div>
          </div>
          <div class="ml-2 mt-2">
            {{ item.text }}
          </div>
          <div class="ml-2 mt-2 d-flex align-center">
            <LikeButton
              @click="sendUpvote(item)"
              :toggable="!!userStore.userInfo?.access"
              :is-clicked="
                !!userStore.userInfo && item.is_upvoted_by_current_user
              "
            />
            <span> {{ item.upvotes_count }} </span>
            <v-btn
              @click="showReplies(item.id)"
              variant="plain"
              class="plain-custom-style"
              :ripple="false"
            >
              <v-icon size="24"> mdi-message-reply-outline </v-icon>
              {{ item.replies_count }}
              <v-tooltip activator="parent" location="bottom"
                >Open discussion</v-tooltip
              >
            </v-btn>
            <v-btn
              v-if="userStore.userInfo"
              class="ml-auto"
              variant="text"
              @click="showReply(item.id)"
              >Reply</v-btn
            >
          </div>
        </div>

        <div
          v-if="openReplies?.id === item.id && userStore.userInfo"
          class="mt-3"
        >
          <v-textarea
            v-model="openReplies.value"
            rows="3"
            variant="outlined"
            class="opacity"
            :label="`Replying to ${item.author_name}`"
            autofocus
            auto-grow
          ></v-textarea>
          <div class="d-flex justify-end mr-4">
            <v-btn
              :disabled="!openReplies.value.length"
              color="primary"
              @click="sendComment(openReplies)"
              >Send</v-btn
            >
          </div>
        </div>

        <div class="ml-4 mt-3 reply-comment" v-if="item.replies?.length">
          <div
            class="ml-3"
            v-for="(childItem, childIndex) in item.replies"
            :key="childIndex"
            :class="[
              'ma-4',
              createdCommentId === childItem.id ? 'created-comment' : ''
            ]"
          >
            <div
              class="author-info author-block d-flex"
              @click="goToAuthorPosts(item.author_name)"
            >
              <v-avatar size="48" class="mr-1">
                <v-img
                  v-if="childItem.author_image"
                  :src="childItem.author_image"
                  :alt="childItem.author_name"
                />
                <v-icon v-else class="font-size-48">
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              <div class="d-flex flex-column">
                <span>{{ childItem.author_name || 'Anonymous' }}</span>
                <span>{{ childItem.created_date }}</span>
              </div>
            </div>
            <div class="ml-2 mt-2">
              {{ childItem.text }}
            </div>
            <div class="ml-2 mt-3 d-flex align-center">
              <LikeButton
                @click="sendUpvote(childItem)"
                :toggable="!!userStore.userInfo?.access"
                :is-clicked="
                  !!userStore.userInfo && childItem.is_upvoted_by_current_user
                "
              />
              <span> {{ childItem.upvotes_count }} </span>
            </div>
          </div>
        </div>
        <v-divider class="my-4" />
      </div>
      <div v-else class="no-comments">
        <span>
          Be the trailblazer! Take the lead and share your thoughts. There are
          currently no responses for this story. Be the first to respond and
          ignite the conversation.
        </span>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import SocialShare from '@/components/SocialShare.vue';
import { useModalsStore, useNotificationStore, useUserStore } from '~/store';
import type {
  Article,
  CommentData,
  Network,
  Share,
  SuccessResponse
} from '~/types';

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
  { type: 'copy', name: 'Copy link', icon: 'content-copy' },
  { type: 'email', name: 'Email', icon: 'email' },
  { type: 'facebook', name: 'Facebook', icon: 'facebook' },
  { type: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
  {
    type: 'telegram',
    name: 'Telegram',
    icon: 'fab fah fa-lg fa-telegram-plane'
  },
  { type: 'twitter', name: 'X (Twitter)', icon: 'twitter' }
]);
const article: Ref<Article | null> = ref(null);
const recentlyWrittenPosts: Ref<Article[] | null> = ref(null);
const { data: articleData, error } = await useAPIFetch<Article>(
  `/api/posts/${route.params.slug}`
);
if (error.value) {
  if (error.value.statusCode === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found',
      fatal: true
    });
  }
}
article.value = articleData.value;
const { data: recentlyWrittenData } =
  await useAPIFetch<Article[]>('/api/last-posts/');
recentlyWrittenPosts.value = recentlyWrittenData.value!.slice(0, 3);
const bookmarked = ref(false);
if (article.value) {
  bookmarked.value = article.value.is_bookmarked_by_current_user;
}
const newCommentText = ref('');
const openReplies: Ref<IdWithValue | null> = ref(null);
const createdCommentId: Ref<null | number> = ref(null);
const showDeleteDialog = ref(false);
const deletePostSlug = ref('');

const sharing = computed(() => {
  return {
    url: window.location.href,
    title: article.value ? article.value.title : '',
    description: article.value ? article.value.description : '',
    quote: article.value ? article.value.title : '',
    hashtags: article.value ? article.value.tags.join(',') : ['']
  } as Share;
});

async function goToAuthorPosts(username: string) {
  if (username) {
    await navigateTo(`/?userName=${username}`);
  }
}

const userStore = useUserStore();
const { t } = useI18n({
  useScope: 'local'
});

function isComment(object: Article | CommentData): object is CommentData {
  return 'post' in object;
}

async function sendUpvote(item: Article | CommentData) {
  if (!userStore.userInfo?.access) {
    const modalStore = useModalsStore();
    await modalStore.setModal('SignUp', t('upvoteTitle'));
  }
  if (userStore.userInfo?.access) {
    const { data, error } = await useAPIFetch('/api/toggle-upvote/', {
      method: 'post',
      body: {
        content_type: isComment(item) ? 'comment' : 'post',
        object_id: item.id
      }
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
          type: 'error',
          message: error.value.data.detail
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
    await modalStore.setModal('SignUp', t('followTitle'));
    return;
  }
  followLoading.value = true;
  const { data, error } = await useAPIFetch<CommentData[]>(
    `api/toggle-follow/user/${name}/`,
    {
      method: 'post'
    }
  );
  if (error.value?.data) {
    if (error.value) {
      const notifyStore = useNotificationStore();
      await notifyStore.setNotification({
        type: 'error',
        message: error.value.data.detail
      });
    }
  }
  followLoading.value = false;
  article.value!.is_author_followed_by_current_user =
    !article.value!.is_author_followed_by_current_user;
}

watch(
  showCommentsDialog,
  async (val) => {
    if (val) {
      commentsDialog.value.loading = true;
      const { data, error } = await useAPIFetch<CommentData[]>(
        `/api/comments/${article.value!.slug}`,
        {
          method: 'get'
        }
      );
      if (error.value?.data) {
        if (error.value) {
          const notifyStore = useNotificationStore();
          await notifyStore.setNotification({
            type: 'error',
            message: error.value.data.detail
          });
        }
      }
      if (data.value) {
        commentsDialog.value.comments = data.value
          .filter((item) => !item.parent_comment)
          .reverse();
      }
      commentsDialog.value.loading = false;
    }
  },
  { deep: true }
);

const wasLoaded = ref(false);

watch(
  () => userStore.userInfo,
  async (val) => {
    if (val && !wasLoaded.value) {
      const { data: articleData } = await useAPIFetch<Article>(
        `/api/posts/${route.params.slug}`
      );
      article.value = articleData.value;
      wasLoaded.value = true;
      bookmarked.value = article.value!.is_bookmarked_by_current_user;
    }
  }
);

if (route.query.comment_id) {
  showCommentsDialog.value = true;
}

const config = useRuntimeConfig();
async function addBookmark() {
  if (article.value) {
    const { data, error } = await useAPIFetch<SuccessResponse>(
      `${config.public.baseURL}api/posts/${article.value.slug}/toggle-bookmark/`,
      {
        method: 'post'
      }
    );
    if (error.value?.data) {
      if (error.value) {
        const notifyStore = useNotificationStore();
        await notifyStore.setNotification({
          type: 'error',
          message: error.value.data.detail
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
  openReplies.value = { id, value: '' };
}

async function showReplies(id: number) {
  const { data, error } = await useAPIFetch<CommentData[]>(
    `${config.public.baseURL}api/child-comments/${id}/`,
    {
      method: 'get'
    }
  );
  if (data.value) {
    commentsDialog.value.comments.find((item) => item.id === id)!.replies =
      data.value;
  }
  if (error.value?.data) {
    if (error.value) {
      const notifyStore = useNotificationStore();
      await notifyStore.setNotification({
        type: 'error',
        message: error.value.data.detail
      });
    }
  }
}

async function sendComment(replyData?: IdWithValue) {
  const textValue = replyData ? replyData.value : newCommentText.value;
  const { data, error } = await useAPIFetch<CommentData>(
    `${config.public.baseURL}api/comments/`,
    {
      method: 'post',
      body: {
        post: article.value!.slug,
        text: textValue,
        parent_comment: replyData ? replyData.id : null
      }
    }
  );
  if (replyData) {
    openReplies.value = null;
    replyData.value = '';
  } else {
    newCommentText.value = '';
  }
  if (error.value?.data) {
    if (error.value) {
      const notifyStore = useNotificationStore();
      await notifyStore.setNotification({
        type: 'error',
        message: error.value.data.detail
      });
      return;
    }
  }
  const notifyStore = useNotificationStore();
  await notifyStore.setNotification({
    type: 'success',
    message: 'Your comment was sent!'
  });
  if (data.value) {
    const parentComment = replyData
      ? commentsDialog.value.comments.find((item) => item.id === replyData.id)
      : null;
    if (parentComment) {
      parentComment.replies = parentComment.replies || [];
      parentComment.replies.push(data.value);
    } else {
      commentsDialog.value.comments.unshift(data.value);
    }
    createdCommentId.value = data.value.id;
    setTimeout(() => {
      createdCommentId.value = null;
    }, 5000);
  }
}

const postActions = ref([
  {
    name: 'Edit',
    action: (post: Article) => navigateTo(`/posts/create?postSlug=${post.slug}`)
  },
  {
    name: 'Remove',
    class: 'removeClass',
    action: (post: Article) => {
      showDeleteDialog.value = true;
      deletePostSlug.value = post.slug;
    }
  }
]);

async function onDeletePost() {
  const { error } = await useAPIFetch<CommentData[]>(
    `api/posts/${deletePostSlug.value}/`,
    {
      method: 'delete'
    }
  );
  if (error.value) {
    const notifyStore = useNotificationStore();
    await notifyStore.setNotification({
      type: 'error',
      message: error.value.data.detail
    });
  } else {
    deletePostSlug.value = '';
  }
  showDeleteDialog.value = false;
  navigateTo('/');
}

async function showSignUpModal() {
  const modalStore = useModalsStore();
  await modalStore.setModal('SignUp', t('responseTitle'));
  return;
}

// TODO: Check meta data after deployment. https://nuxt.com/docs/getting-started/seo-meta
useSeoMeta({
  title: () => (article.value ? article.value.title : ''),
  ogTitle: () => (article.value ? article.value.title : ''),
  description: () => (article.value ? article.value.description : ''),
  ogDescription: () => (article.value ? article.value.description : ''),
  ogImage: () => (article.value ? article.value.preview_image : ''),
  twitterCard: () => 'summary_large_image',
  // ogUrl: () => process.env.URL,
  ogType: 'article'
});
</script>

<style lang="less" scoped>
@import '../../assets/breakpoints.less';

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
    font-size: 36px;
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
  .v-alert a {
    color: rgb(var(--v-theme-primary));
    cursor: pointer;
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

.created-comment {
  background-color: rgba(128, 128, 128, 0.15);
  border-radius: 8px;
}

.removeClass {
  color: rgb(var(--v-theme-error));
}

.no-comments {
  padding: 16px;
  display: flex;
  height: 100vh;
  align-items: center;

  span {
    font-size: large;
    font-style: italic;
  }
}

.post-top-buttons {
  button {
    @media (max-width: @md-min) {
      padding: 0px;
      min-width: 36px;
    }
  }
}

.delete-modal {
  line-height: 24px;
  font-size: 16px;
  font-family: Roboto, sans-serif;
}

.about-us {
  display: flex;
  flex-direction: row;
  width: max-content;
  a {
    padding-right: 10px;
    font-size: 14px;
    opacity: 0.6;
    text-decoration: none;
  }
}
.main-container {
  max-width: inherit;
}

.main-content {
  @media (max-width: @md-max) {
    width: 100%;
    min-width: 100%;
  }
}
</style>
