<template>
  <div>
    <v-tooltip activator="parent" location="bottom">React</v-tooltip>
    <svg class="button" @click="clickHeart()" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="Heart"
        d="M17.5 27L15.9775 25.6332C10.57 20.7978 7 17.6087 7 13.6948C7 10.5057 9.541 8 12.775 8C14.602 8 16.3555 8.83869 17.5 10.164C18.6445 8.83869 20.398 8 22.225 8C25.459 8 28 10.5057 28 13.6948C28 17.6087 24.43 20.7978 19.0225 25.6436L17.5 27Z"
        :class="{
          unfilledHeart: !clicked,
          heartAnimation: startAnimation,
          filledHeart: clicked,
          heartUnfillAnimation: startUnfillAnimation,
        }" />
      <path
        d="M34.5 17.5C34.5 26.8888 26.8888 34.5 17.5 34.5C8.11116 34.5 0.5 26.8888 0.5 17.5C0.5 8.11116 8.11116 0.5 17.5 0.5C26.8888 0.5 34.5 8.11116 34.5 17.5Z"
        v-show="startRippleAnimation" :class="{ ripple: true, rippleAnimation: startRippleAnimation }" />
    </svg>
  </div>
</template>

<script setup lang="ts">
const startAnimation = ref(false);
const startUnfillAnimation = ref(false);
const startRippleAnimation = ref(false);
const clicked = ref(false);
const props = defineProps({
  toggable: {
    type: Boolean,
  },
  isClicked: {
    type: Boolean
  }
});

if (props.isClicked) {
  clicked.value = true;
}

function clickHeart() {
  if (props.toggable) {
    if (!clicked.value) {
      startAnimation.value = true;
      setTimeout(() => {
        startRippleAnimation.value = true;
      }, 300);
      setTimeout(() => {
        startAnimation.value = false;
        startRippleAnimation.value = false;
        clicked.value = !clicked.value;
      }, 600);
    } else {
      startUnfillAnimation.value = true;
      setTimeout(() => {
        startUnfillAnimation.value = false;
        clicked.value = !clicked.value;
      }, 600);
    }
  }
}
</script>

<style scoped lang="less">
.button {
  width: 36px;
  height: 36px;
}

.unfilledHeart {
  stroke: grey;
  stroke-width: 3;
  fill: grey;
  fill-opacity: 1;
  stroke-opacity: 1;
  cursor: pointer;
}

.filledHeart {
  stroke: red;
  stroke-width: 3;
  fill: red;
  fill-opacity: 1;
  stroke-opacity: 1;
  cursor: pointer;
}

.ripple {
  stroke: red;
  stroke-width: 5;
}

.heartAnimation {
  transform-origin: center;
  animation: heartAnimation 600ms;
}

.heartUnfillAnimation {
  transform-origin: center;
  animation: heartUnfillAnimation 600ms;
}

.rippleAnimation {
  transform-origin: center;
  animation: rippleAnimation 300ms;
}

@keyframes heartAnimation {
  0% {
    stroke: red;
    fill: red;
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke-width: 3;
  }

  50% {
    transform: scale(0.1176063646);
    stroke: #9960c7;
    fill: #9960c7;
    fill-opacity: 1;
    stroke-opacity: 0;
    stroke-width: 0;
  }

  100% {
    stroke: red;
    stroke-width: 3;
    fill: red;
    fill-opacity: 1;
    stroke-opacity: 1;
  }
}

@keyframes heartUnfillAnimation {
  0% {
    stroke: red;
    stroke-width: 3;
    fill: red;
    fill-opacity: 1;
    stroke-opacity: 1;
  }

  50% {
    transform: scale(0.1176063646);
    stroke: #9960c7;
    fill: #9960c7;
    fill-opacity: 1;
    stroke-opacity: 0;
    stroke-width: 0;
  }

  100% {
    stroke: grey;
    fill: grey;
    fill-opacity: 1;
    stroke-opacity: 1;
    stroke-width: 3;
  }
}

@keyframes rippleAnimation {
  0% {
    transform: scale(0.3428571429);
    stroke: red;
    stroke-width: 15;
    stroke-opacity: 1;
  }

  100% {
    transform: scale(1);
    stroke: red;
    stroke-width: 0.1;
    stroke-opacity: 0.2;
  }
}
</style>
