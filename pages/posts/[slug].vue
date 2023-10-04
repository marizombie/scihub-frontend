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
                <img
                  v-if="authorInfo.img"
                  :src="authorInfo.img"
                  :alt="authorInfo.firstName + ' ' + authorInfo.lastName"
                />
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-avatar>
              <span>{{ article.author }}</span>
            </div>
          </v-col>
          <v-col cols="2" class="d-flex justify-end align-center">
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-icon large v-bind="props" icon="mdi-share" />
              </template>
              <v-list>
                <v-list-item v-for="(network, index) in networks" :key="index">
                  <ShareNetwork
                    :network="network.network"
                    :url="sharing.url"
                    :title="sharing.title"
                    :description="sharing.description"
                    :quote="sharing.quote"
                    :hashtags="sharing.hashtags"
                    :twitterUser="sharing.twitterUser"
                    class="linkWOStyles d-flex align-center"
                  >
                    <v-icon v-if="network.network !== 'telegram'">
                      {{ `mdi-${network.icon}` }}
                    </v-icon>
                    <i
                      class="v-icon notranslate theme--light v-icon--size-default"
                      style="margin-left: -1.5px"
                      v-else
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="24"
                        height="24"
                        viewBox="0 0 54 54"
                      >
                        <path
                          fill="rgba(0, 0, 0, 0.54)"
                          d="M32,10c12.15,0,22,9.85,22,22s-9.85,22-22,22s-22-9.85-22-22S19.85,10,32,10z M39.589,40.968	c0.404-1.241,2.301-13.615,2.534-16.054c0.071-0.738-0.163-1.229-0.619-1.449c-0.553-0.265-1.371-0.133-2.322,0.21	c-1.303,0.47-17.958,7.541-18.92,7.951c-0.912,0.388-1.775,0.81-1.775,1.423c0,0.431,0.256,0.673,0.96,0.924	c0.732,0.261,2.577,0.82,3.668,1.121c1.05,0.29,2.243,0.038,2.913-0.378c0.709-0.441,8.901-5.921,9.488-6.402	c0.587-0.48,1.056,0.135,0.576,0.616c-0.48,0.48-6.102,5.937-6.844,6.693c-0.901,0.917-0.262,1.868,0.343,2.249	c0.689,0.435,5.649,3.761,6.396,4.295c0.747,0.534,1.504,0.776,2.198,0.776C38.879,42.942,39.244,42.028,39.589,40.968z"
                        ></path>
                      </svg>
                    </i>
                    <span>{{ network.name }}</span>
                  </ShareNetwork>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

        <v-card-title>{{ article.title }}</v-card-title>

        <v-img :src="article.image" />

        <v-card-text>
          <span>{{ article.content }}</span>
        </v-card-text>
        <div class="pl-4 pr-4 pb-4 tags d-flex flex-wrap">
          <v-card
            outlined
            v-for="(tag, index) in article.tags"
            :key="index"
            class="tag ma-1"
          >
            <span>{{ tag }}</span>
          </v-card>
        </div>
        <div class="pa-4 pt-0">
          <v-icon @click="handleClick" :color="liked ? '#F05654' : 'inherit'">
            {{ "mdi-heart" }}
          </v-icon>
          <span> 190 like(s)</span>
        </div>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="recomendation-block ml-md-8 pa-4 d-md-block">
        <div class="d-flex align-center mb-3">
          <v-avatar size="48" class="mr-1">
            <img
              v-if="authorInfo.img"
              :src="authorInfo.img"
              :alt="authorInfo.firstName + ' ' + authorInfo.lastName"
            />
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
          <v-btn class="primary"> Follow </v-btn>
        </div>

        <div class="d-flex flex-column mt-16">
          <h3>What else to read:</h3>
          <a
            v-for="(item, index) in recentlyWritten"
            :key="index"
            class="text-subtitle-1"
          >
            <span class="title">{{ item.title }}</span>
            <div class="author-info">
              <span class="mr-1">by</span>
              <v-avatar size="20" class="mr-1">
                <img v-if="item.authorImg" :src="item.authorImg" alt="John" />
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-avatar>
              <span>{{ item.author }}</span>
            </div>
          </a>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

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

const route = useRoute();
const display = ref(useDisplay() || null);
const liked = ref(false);
const authorInfo: Ref<Author> = ref({
  firstName: "Maryna",
  lastName: "Klokova",
  img: "https://i.pinimg.com/736x/f3/6f/a9/f36fa99538b13d768802e697074f5873.jpg",
  description: "I am writing to be popular",
});
const sharing = ref({
  url: "http://localhost:3000/posts/introduction-ml-basics",
  title:
    "Say hi to Vite! A brand new, extremely fast development setup for Vue.",
  description:
    'This week, I’d like to introduce you to "Vite", which means "Fast". It’s a brand new development setup created by Evan You.',
  quote: "The hot reload is so fast it's near instant. - Evan You",
  hashtags: "vuejs,vite,javascript",
  twitterUser: "youyuxi",
});
const networks = ref([
  { network: "email", name: "Email", icon: "email" },
  { network: "facebook", name: "Facebook", icon: "facebook" },
  { network: "linkedin", name: "LinkedIn", icon: "linkedin" },
  { network: "reddit", name: "Reddit", icon: "reddit" },
  {
    network: "telegram",
    name: "Telegram",
    icon: "fab fah fa-lg fa-telegram-plane",
  },
  { network: "twitter", name: "Twitter", icon: "twitter" },
  { network: "whatsapp", name: "Whatsapp", icon: "whatsapp" },
]);
const article: Ref<Article | null> = ref(null);
const recentlyWritten: Ref<Article[] | null> = ref(null);
const { data: articleData } = await useAPIFetch<Article>(
  `/api/posts/${route.params.slug}`,
);
article.value = articleData.value;
const { data: recentlyWrittenData } =
  await useAPIFetch<Article[]>("/api/last-posts/");
recentlyWritten.value = recentlyWrittenData.value!.slice(0, 3);

async function redirectToHomePage() {
  await navigateTo("/");
}
function handleClick() {
  liked.value = !liked.value;
}
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
