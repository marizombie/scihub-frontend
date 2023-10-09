<i18n lang="json">
{
  "en": {
    "comments_title": "Comments"
  }
}
</i18n>

<template>
  <v-row>
    <v-col cols="8">
      <v-card class="comments">
        <v-card-title>{{ t("comments_title") }}</v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { t } = useI18n({
  useScope: "local",
});
</script>

<style lang="less" scoped>
@import "../assets/breakpoints.less";

.comments {
  @media (min-width: @md-min) {
  }
}
</style>
