<template>
  <v-row justify-md="center" align-md="center">
    <v-col md="7">
      <v-card v-for="(article, index) in articles" :key="index" class="article mb-4" :to="`/posts/${article.slug}`">
        <v-card-title>{{ article.title }}</v-card-title>
        <div class="pa-4 d-flex flex-column flex-md-row">
          <img :src="article.image" alt="demo picture">
          <div>
            <v-card-text>
              {{ article.description }}
            </v-card-text>
            <div class="pl-4 pr-4 pb-4 tags d-flex flex-wrap">
              <v-card outlined v-for="(tag, index) in article.tags" :key="index" class="tag ma-1">
                <span>{{ tag }}</span>
              </v-card>
            </div>
            <span class="ma-4">Published on {{article.created_at}}</span>
            <div class="pl-4 pr-4 pt-2">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <img
                  v-if="article.authorImg"
                  :src="article.authorImg"
                  alt="John"
                >
                <v-icon v-else>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              <span>{{ article.author }}</span>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>
    <v-card class="recomendation-block ml-8 d-sm-none d-none d-md-block">
      <div class="d-flex flex-column">
        <h3>Recommendations:</h3>
        <a v-for="(item, index) in recomendations"
          :key="index"
          class="text-subtitle-1">
            <span class="title">{{ item.title }}</span>
            <div class="author-info">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <img
                  v-if="item.authorImg"
                  :src="item.authorImg"
                  alt="John"
                >
                <v-icon v-else>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              <span>{{ item.author }}</span>
            </div>
        </a>
      </div>
      <div class="d-flex flex-column mt-6">
        <h3>Recently written:</h3>
        <a v-for="(item, index) in recentlyWritten"
          :key="index"
          class="text-subtitle-1">
            <span class="title">{{ item.title }}</span>
            <div class="author-info">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <img
                  v-if="item.authorImg"
                  :src="item.authorImg"
                  alt="John"
                >
                <v-icon v-else>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              <span>{{ item.author }}</span>
            </div>
        </a>
      </div>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  data () {
    return {
      articles: [],
      recomendations: [
        { title: "Terrifying truth about garden gnomes", author: "Emilia Boston", authorImg: "" },
        { title: "Dwarves -- are they all so loyal to the Crown?", author: "Jeremy Hokey", authorImg: "" },
        { title: "Should we just look or act? Kids wrestling with crocodiles", author: "Samantha Ames", authorImg: "" }
      ],
      recentlyWritten: [],
    }
  },
  async beforeMount() {
    const data = await this.$axios.$get("/api/posts/");
    this.articles = data.results;
    const recentlyWritten = await this.$axios.$get("/api/last-posts/");
    // TODO: Remove slice aftr API start return only 3 items
    this.recentlyWritten = recentlyWritten.slice(0, 3);
  },
  computed: {

  },
}
</script>

<style lang="less" scoped>
.article {
  img {
    max-width: 300px;
  }
  .v-card__title {
    font-size: 32px;
    word-break: break-word;
  }
  .tags .tag{
    padding: 4px;
    width: fit-content;
  }
  span {
    color: #C2BBBB;
  }
}
.recomendation-block {
  position: sticky;
  top: 100px;
  align-self: flex-start;
  background: inherit;
  box-shadow: none!important;
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
    color: inherit!important;
  }
}
</style>
