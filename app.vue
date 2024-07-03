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
      rel: 'preload',
      href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
      as: 'style',
      onload: "this.onload=null;this.rel='stylesheet'",
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
