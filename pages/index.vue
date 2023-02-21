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
        <a v-for="item in recomendations"
          :key="item.title"
          class="text-subtitle-1">
            {{ item.title }}
        </a>
      </div>
      <div class="d-flex flex-column">
        <h3>Recently added:</h3>
        <a v-for="item in recentlyWritten"
          :key="item.title"
          class="text-subtitle-1">
            {{ item.title }}
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
        { title: "Title 1" },
        { title: "Title 2" },
        { title: "Title 3" }
      ],
      recentlyWritten: [
        { title: "Recently title 1" },
        { title: "Recently title 2" },
        { title: "Recently title 3" }
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
}
</style>
