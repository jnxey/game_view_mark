<template>
  <div class="gv-scene-button-parallel" v-hover="'hover-current'">
    <div class="text scene-text-main-color fz-18 fw-bold flex-row align-center justify-center cursor-pointer">
      <slot />
    </div>
    <div class="bg-1" />
    <div class="bg-2" />
  </div>
</template>
<script>
export default { name: 'gv-scene-button-parallel' };
</script>
<script setup></script>
<style scoped lang="scss">
.gv-scene-button-parallel {
  position: relative;
  user-select: none;
  min-width: 120px;
  z-index: 0;

  .text {
    position: relative;
    padding: 0 10px;
    height: 46px;
    user-select: none;
    letter-spacing: 2px;
    font-style: italic;
    -webkit-text-fill-color: transparent;
    background-image: var(--scene-enter-parallel-text-image);
    background-clip: text;
    z-index: 20;
  }
  .bg-1,
  .bg-2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    transform: skewX(-20deg);
  }

  .bg-1 {
    background-color: var(--scene-enter-parallel-bg-1);
    background-image: url('@/assets/images/scene/line-bg.png');
    background-size: 30px 30px;
    background-repeat: repeat;
    z-index: 10;
  }

  .bg-2 {
    box-shadow: var(--scene-enter-parallel-bg-2);
    background-image: var(--scene-enter-parallel-bg-3);
    z-index: 12;
  }

  &.hover-current {
    .bg-1 {
      background-image: none;
    }
  }
}
</style>
