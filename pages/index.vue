<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card v-for="(article, index) in articles" :key="index" class="article mb-4">
        <v-card-title>{{ article.title }}</v-card-title>
        <img :src="article.img" alt="demo picture">
        <v-card-text>
          {{ article.description }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-card class="recomendation-block ml-8">
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
      articles: [
        {
          title: "Test 1",
          img: "https://as2.ftcdn.net/v2/jpg/04/81/45/81/1000_F_481458155_G8Mi9Jx9RkfUmVVsETjkn5mk64xAgSyP.jpg",
          description: "Description of article goes here. Muggles are going towards Hogwarts, we have to do something! And other news"
        },
        {
          title: "Test 2",
          img: "https://as2.ftcdn.net/v2/jpg/03/31/47/89/1000_F_331478918_qDrW2hYXZ8KGDNEVaS2xiueWhagYLag1.jpg",
          description: "Description of article goes here. Muggles are going towards Hogwarts, we have to do something! And other news"

        },
        {
          title: "Test 3",
          img: "https://as2.ftcdn.net/v2/jpg/01/45/56/11/1000_F_145561140_bxEF0CxFEwQOGi5eBy72Nxzv639Di0E9.jpg",
          description: "Description of article goes here. Muggles are going towards Hogwarts, we have to do something! And other news"
        }
      ],
      recomendations: [
        { title: "Terrifying truth about garden gnomes", author: "Emilia Boston", authorImg: "" },
        { title: "Dwarves -- are they all so loyal to the Crown?", author: "Jeremy Hokey", authorImg: "" },
        { title: "Should we just look or act? Kids wrestling with crocodiles", author: "Samantha Ames", authorImg: "" }
      ],
      recentlyWritten: [
        { title: "Should we really eat dinosaurs? Health advice", author: "Adam Spanker", authorImg: "" },
        { title: "Common language for all, even for tiny people   ", author: "Didi Nocks", authorImg: "" },
        { title: "Why clown is a good career choice -- interview with Joshua", author: "Uma Illya", authorImg: "" }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  img {
    max-width: 100%;
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
