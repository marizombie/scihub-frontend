<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
      crossorigin: ''
    }
  ]
});
// Rewrite some useFetch to useLazyFetch(to not freeze app)
</script>

<style lang="less" scoped>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
