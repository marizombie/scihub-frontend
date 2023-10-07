<template>
  <v-row>
    <v-col cols="8">
      <v-card class="comments">
        <v-card-title>Comments</v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import "../assets/breakpoints.less";

.comments {
  @media (min-width: @md-min) {
  }
}
</style>
