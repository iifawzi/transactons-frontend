<template>
  <div class="category" :style="'background-color:#' + color">
    <p class="category__value">{{ value }}</p>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
  },
};
</script>

<style src="./style.scss" lang="scss" scoped />