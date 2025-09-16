<template>
  <div class="gv-scene-button cursor-pointer" :class="buttonClass" v-hover="'hover-current'" @click="handleClick">
    <div class="text scene-text-main-color fz-18 fw-bold flex-row align-center justify-center">
      <slot />
    </div>
    <div class="bg-1" />
    <div class="bg-2" />
    <div class="bg-3" />
    <div class="bg-4" />
  </div>
</template>
<script>
export default { name: 'gv-scene-button' };
</script>
<script setup>
import { computed } from 'vue';

const emit = defineEmits(['click']);

const props = defineProps({
  type: String,
  small: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  round: { type: Boolean, default: false }
});

const buttonClass = computed(() => {
  const result = { round: props.round };
  result[props.type] = props.type;
  if (props.disabled) result.disabled = 'disabled';
  if (props.small) result.small = 'small';
  return result;
});

const handleClick = (e) => {
  if (!!props.disabled) return;
  emit('click', e);
};
</script>
<style scoped lang="scss">
.gv-scene-button {
  position: relative;
  border-radius: 8px;
  user-select: none;
  overflow: hidden;
  min-width: 120px;
  z-index: 0;

  &.inline-block {
    display: inline-block;
    vertical-align: middle;
  }

  .text {
    position: relative;
    padding: 0 10px;
    height: 46px;
    user-select: none;
    letter-spacing: 2px;
    font-style: italic;
    -webkit-text-fill-color: transparent;
    background-image: var(--scene-enter-button-text-image);
    background-clip: text;
    z-index: 20;
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.small {
    .text {
      padding: 0 15px;
      height: 32px;
    }
  }

  .bg-1,
  .bg-2,
  .bg-4 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  .bg-1 {
    background-image: url('@/assets/images/scene/beehive-bg.png');
    background-size: 13.3px 15px;
    background-repeat: repeat;
    background-color: var(--scene-enter-button-bg-1);
    z-index: 10;
  }

  .bg-2 {
    background-image: linear-gradient(to bottom, var(--scene-enter-button-bg-1), transparent);
    z-index: 12;
  }

  .bg-3 {
    position: absolute;
    top: 0;
    left: 2px;
    width: 100%;
    height: 8px;
    z-index: 13;
    border-radius: 10px;
    background-image: var(--scene-enter-button-bg-2);
    background-size: 100% 100%;
  }

  .bg-4 {
    box-shadow: var(--scene-enter-button-bg-3);
    background-image: var(--scene-enter-button-bg-4);
    background-size: 100px 50px;
    background-repeat: no-repeat;
    background-position: left bottom;
    z-index: 14;
  }

  &.round {
    border-radius: 20px;
    .text {
      font-style: normal;
    }
    .bg-1,
    .bg-2,
    .bg-4 {
      border-radius: 20px;
    }
  }

  &.light {
    .bg-2,
    .bg-3 {
      display: none;
    }
    .bg-4 {
      box-shadow: var(--scene-enter-button-bg-light-1);
      background-image: none;
      background-color: var(--scene-enter-button-bg-light-2);
    }
  }

  &.dark {
    .bg-1,
    .bg-3,
    .bg-4 {
      display: none;
    }
    .bg-2 {
      box-shadow: var(--scene-enter-button-bg-dark-1);
      background-image: var(--scene-enter-button-bg-dark-2);
    }
  }

  &.hover-current {
    .bg-2 {
      display: block;
      background-image: none;
      background-color: var(--scene-enter-button-bg-hover-1);
    }
  }
}
</style>
