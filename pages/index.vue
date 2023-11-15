<template>
  <v-row justify-md="center" align-md="center">
    <v-col md="7" v-if="articles?.length">
      <v-card v-for="(article, index) in articles" :key="index" class="article mb-4" :to="`/posts/${article.slug}`">
        <v-card-title class="text-wrap">{{ article.title }}</v-card-title>
        <div class="pa-4 d-flex flex-column flex-md-row">
          <img :src="article.image" alt="demo picture" />
          <div>
            <v-card-text>
              {{ article.description }}
            </v-card-text>
            <div class="pl-4 pr-4 pb-4 tags d-flex flex-wrap">
              <v-card variant="elevated" v-for="(tag, index) in article.tags" :key="index" class="tag ma-1">
                <span>{{ tag }}</span>
              </v-card>
            </div>
            <span class="ma-4">Published on {{ article.created_at }}</span>
            <div class="pl-4 pr-4 pt-2">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <img v-if="article.author_image" :src="article.author_image" :alt="article.author_name" />
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-avatar>
              <span>{{ article.author_name ? article.author_name : 'Anonymous' }}</span>
            </div>
          </div>
        </div>
      </v-card>
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
              <img v-if="item.author_image" :src="item.author_image" alt="John" />
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
              <img v-if="item.author_image" :src="item.author_image" alt="John" />
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
}

interface CRUDResponse {
  results: Article[];
}

const { data: posts } = await useAPIFetch<CRUDResponse>("/api/posts/");
const { data: recentlyWritten } =
  await useAPIFetch<Article[]>("/api/last-posts/");
const { data: recomendations } =
  await useAPIFetch<Article[]>("api/popular-posts/");
let articles: Ref<Article[] | null> = ref(null);
watch(
  () => posts.value,
  (val) => {
    articles.value = val!.results;
  },
  {
    deep: true,
    immediate: true,
  },
);

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
</style>
