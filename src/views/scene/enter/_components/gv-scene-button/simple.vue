<template>
  <div class="gv-scene-button-simple cursor-pointer" :style="buttonStyle" :class="buttonClass" @click="handleClick">
    <div class="text flex-row align-center justify-center">
      <slot />
    </div>
    <template v-if="type === 'primary'">
      <svg class="arrow-1" viewBox="0 0 100 100" width="60" height="60" fill="none">
        <path d="M5 0 L30 50 L5 100" :stroke="arrowStyle.fill" stroke-width="15" />
      </svg>
      <svg class="arrow-2" viewBox="0 0 100 100" width="60" height="60" fill="none">
        <path d="M5 0 L30 50 L5 100" :stroke="arrowStyle.fill" stroke-width="15" />
      </svg>
      <svg class="arrow-3" viewBox="0 0 100 100" width="60" height="60" fill="none">
        <path d="M95 0 L70 50 L95 100" :stroke="arrowStyle.fill" stroke-width="15" />
      </svg>
      <svg class="arrow-4" viewBox="0 0 100 100" width="60" height="60" fill="none">
        <path d="M95 0 L70 50 L95 100" :stroke="arrowStyle.fill" stroke-width="15" />
      </svg>
      <div class="light-top" />
      <div class="light-bottom" />
    </template>
  </div>
</template>
<script>
export default { name: 'gv-scene-button-simple' };
</script>
<script setup>
import { computed } from 'vue';
import { getColorWithOpacity } from '@/tools/color';

const emit = defineEmits(['click']);

const props = defineProps({
  color: String,
  type: { type: String, default: 'primary' },
  round: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});

const buttonClass = computed(() => {
  const result = { round: props.round, active: props.active };
  result[props.type] = props.type;
  if (props.disabled) result.disabled = 'disabled';
  return result;
});

const buttonStyle = computed(() => {
  if (props.type === 'simple') {
    const opacityColor1 = getColorWithOpacity(props.color, props.active ? 0.6 : 0.1);
    const opacityColor2 = getColorWithOpacity(props.color, props.active ? 1 : 0.3);
    return { backgroundImage: `linear-gradient(to right, ${opacityColor1}, ${opacityColor2}, ${opacityColor1})`, color: '#ffffff' };
  } else if (props.type === 'primary') {
    const opacityColor = getColorWithOpacity(props.color, props.active ? 0.8 : 0.1);
    return { backgroundColor: opacityColor, color: props.active ? '#ffffff' : props.color };
  }
});

const arrowStyle = computed(() => {
  const opacityColor = getColorWithOpacity(props.color, props.active ? 1 : 0.05);
  if (props.type === 'primary') {
    return { fill: opacityColor };
  }
});

const handleClick = (e) => {
  if (!!props.disabled) return;
  emit('click', e);
};
</script>
<style scoped lang="scss">
.gv-scene-button-simple {
  position: relative;
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
    z-index: 20;
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .arrow-1 {
    position: absolute;
    top: -7px;
    left: 0;
    z-index: 10;
    transition: left linear 0.3s;
  }

  .arrow-2 {
    position: absolute;
    top: -7px;
    left: 15px;
    z-index: 10;
    transition: left linear 0.3s;
  }

  .arrow-3 {
    position: absolute;
    top: -7px;
    right: 0;
    z-index: 10;
    transition: right linear 0.3s;
  }

  .arrow-4 {
    position: absolute;
    top: -7px;
    right: 15px;
    z-index: 10;
    transition: right linear 0.3s;
  }

  .light-top {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 2px;
    background-image: radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.71), transparent, transparent);
    background-size: 100% 100%;
    z-index: 12;
  }

  .light-bottom {
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 2px;
    background-image: radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.71), transparent, transparent);
    background-size: 100% 100%;
    z-index: 12;
  }

  &.simple {
    font-size: 18px;
    font-weight: bold;
  }

  &.primary {
    font-size: 18px;
    font-weight: bold;
  }

  &.round {
    border-radius: 20px;
  }

  &.active {
    .arrow-1 {
      left: 10px;
    }

    .arrow-2 {
      left: 25px;
    }

    .arrow-3 {
      right: 10px;
    }

    .arrow-4 {
      right: 25px;
    }
  }
}
</style>
