<template>
  <div class="gv-scene-button-science cursor-pointer" :class="buttonClass" :style="buttonStyle" @click="handleClick">
    <div class="text scene-text-main-color fz-16 fw-bold flex-row align-center justify-center">
      <slot />
    </div>
  </div>
</template>
<script>
export default { name: 'gv-scene-button-science' };
</script>
<script setup>
import { computed } from 'vue';
import { getColorWithOpacity } from '@/tools/color';

const emit = defineEmits(['click']);

const props = defineProps({
  color: String,
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});

const buttonClass = computed(() => {
  const result = { round: props.round };
  result[props.type] = props.type;
  if (props.disabled) result.disabled = 'disabled';
  return result;
});

const buttonStyle = computed(() => {
  if (props.active) {
    const opacityColor1 = getColorWithOpacity(props.color, 0.5);
    const opacityColor2 = getColorWithOpacity(props.color, 1);
    return { backgroundImage: `linear-gradient(to right, ${opacityColor1}, ${opacityColor2})` };
  } else {
    const opacityColor = getColorWithOpacity(props.color, 0.2);
    return { backgroundColor: opacityColor };
  }
});

const handleClick = (e) => {
  if (!!props.disabled) return;
  emit('click', e);
};
</script>
<style scoped lang="scss">
.gv-scene-button-science {
  position: relative;
  user-select: none;
  overflow: hidden;
  border-radius: var(--gv-border-radius-mid);
  min-width: 120px;
  z-index: 0;

  &.inline-block {
    display: inline-block;
    vertical-align: middle;
  }

  .text {
    position: relative;
    padding: 0 10px;
    height: 40px;
    user-select: none;
    letter-spacing: 2px;
    font-style: italic;
    -webkit-text-fill-color: transparent;
    background-image: var(--scene-enter-science-text-image);
    background-clip: text;
    z-index: 20;
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
