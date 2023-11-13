<template>
  <v-row>
    <v-col md="8">
      <v-card class="pa-3" v-if="article">
        <v-row>
          <v-col>
            <span class="ma-2">{{ article.created_at }}</span>
            <div class="pl-2 pr-2">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <img v-if="authorInfo.img" :src="authorInfo.img"
                  :alt="authorInfo.firstName + ' ' + authorInfo.lastName" />
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-avatar>
              <span>{{ article.author }}</span>
            </div>
          </v-col>
          <v-col cols="2" class="d-flex justify-end align-center">
            <SocialShare :share-object="(sharing as Share)" :networks="networks" />
          </v-col>
        </v-row>

        <v-card-title>{{ article.title }}</v-card-title>

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
          <LikeButton />
          <span> 190 like(s)</span>
        </div>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="recomendation-block ml-md-8 pa-4 d-md-block">
        <div class="d-flex align-center mb-3">
          <v-avatar size="48" class="mr-1">
            <img v-if="authorInfo.img" :src="authorInfo.img" :alt="authorInfo.firstName + ' ' + authorInfo.lastName" />
            <v-icon v-else> mdi-account-circle </v-icon>
          </v-avatar>
          <div class="d-flex flex-column">
            <span class="title">{{
              authorInfo.firstName + " " + authorInfo.lastName
            }}</span>
            <span class="subtitle">500 followers</span>
          </div>
        </div>
        <span class="subtitle mt-3">
          {{ authorInfo.description }}
        </span>
        <div class="mt-4">
          <v-btn color="primary"> Follow </v-btn>
        </div>

        <div class="d-flex flex-column mt-16">
          <h3>What else to read:</h3>
          <NuxtLink v-for="(item, index) in recentlyWrittenPosts" :key="index" class="text-subtitle"
            :to="`/posts/${item.slug}`">
            <span class="title">{{ item.title }}</span>
            <div class="author-info">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <img v-if="item.authorImg" :src="item.authorImg" alt="John" />
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-avatar>
              <span>{{ item.author }}</span>
            </div>
          </NuxtLink>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <Comments />
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import SocialShare from '@/components/SocialShare.vue'

interface Article {
  author: string;
  content: string;
  created_at: string;
  description: string;
  id: number;
  image: string;
  slug: string;
  tags: string[];
  title: string;
  authorImg: string;
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

const route = useRoute();
const display = ref(useDisplay() || null);
const liked = ref(false);
const authorInfo: Ref<Author> = ref({
  firstName: "Maryna",
  lastName: "Klokova",
  img: "https://i.pinimg.com/736x/f3/6f/a9/f36fa99538b13d768802e697074f5873.jpg",
  description: "I am writing to be popular",
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

.v-card__title {
  @media (min-width: @md-min) {
    font-size: 32px;
    word-break: break-word;
    padding: 24px;
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
</style>
