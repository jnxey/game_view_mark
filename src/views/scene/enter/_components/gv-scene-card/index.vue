<template>
  <div class="gv-scene-card" ref="cardRef" :class="{ 'has-title': !!title }">
    <div class="card-title fz-16 scene-text-main-color" v-if="!!title">{{ title }}</div>
    <slot />
  </div>
</template>
<script>
export default { name: 'gv-scene-card' };
</script>
<script setup>
import { nextTick, shallowRef } from 'vue';

defineProps({ title: String });

const cardRef = shallowRef();

const getCardHeight = async () => {
  await nextTick();
  return cardRef.value?.offsetHeight;
};

defineExpose({ getCardHeight });
</script>
<style lang="scss" scoped>
.gv-scene-card {
  position: relative;
  padding: 15px;
  border-radius: 16px;
  border: 1px solid var(--scene-enter-card-boder-color);
  background-color: var(--scene-enter-card-bg-color);
  box-shadow: var(--scene-enter-card-box-shadow);

  &.has-title {
    padding-top: 40px;
  }

  .card-title {
    position: absolute;
    top: 0;
    left: 50%;
    height: 32px;
    line-height: 30px;
    padding: 0 20px;
    transform: translateX(-50%);
    border-radius: 0 0 16px 16px;
    background-image: var(--scene-enter-card-title-bg);
  }
}
</style>
