<template>
  <button class="btn btn-primary">
    <i class="fa fa-2x" :class="icon"></i>
    <!-- se pueden colocar dos class, pero uno con : y otro sin-->
  </button>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    icon: {
      type: String,
      default: "fa-plus",
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  border-radius: 100%;
  bottom: 20px;
  height: 80px;
  position: fixed;
  right: 20px;
  width: 80px;
}
</style>
