<template>
  <NuxtLayout>
    <div class="prose">
      <template v-if="error.statusCode === 404">
        <h1>404!</h1>
        <p>
          Sorry, that page doesn't exist. One of our Development Team must be
          punished for this unacceptable failure!
        </p>
      </template>
      <template v-else>
        <h1>Dang</h1>
        <p>
          <strong>{{ error.message }}</strong>
        </p>
        <p>It looks like something broke.</p>
        <p>Sorry about that.</p>
      </template>
      <p>
        Click
        <a class="link" @click="handleError"> here </a>
        <span v-if="error.statusCode === 404">
          to return to main page only if you want him to keep his job
        </span>
        <span v-else> to return to main page </span>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
const error = useError();

const handleError = () => {
  clearError({
    redirect: '/'
  });
};
</script>

<style lang="less">
.link {
  cursor: pointer;
  color: purple;
}
</style>
