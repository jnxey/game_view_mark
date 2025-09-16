<template>
  <glc-hit-box class="widgets-text" :style="[wrapStyle, otherStyle]" resize :uid="uid">
    {{ config.text }}
  </glc-hit-box>
</template>
<script>
export default { name: 'glc-widget-text' };
</script>
<script setup>
import { computed } from 'vue';
import { getPX } from '@/tools/index.js';
import GlcHitBox from './_hit-box.vue';

const props = defineProps({ config: Object, uid: String, index: Number });

const wrapStyle = computed(() => {
  const bold = props.config.fontBold ? { fontWeight: 'bold' } : {};
  const italic = props.config.fontItalic ? { fontStyle: 'italic' } : {};
  return {
    top: getPX(props.config.position?.y),
    left: getPX(props.config.position?.x),
    width: getPX(props.config.size?.width),
    height: getPX(props.config.size?.height),
    color: props.config.color,
    textAlign: props.config.textAlign,
    fontSize: getPX(props.config.fontSize),
    letterSpacing: getPX(props.config.letterSpacing || 2),
    fontFamily: props.config.fontFamily,
    textShadow: props.config.textShadow ? `0.06em 1px 0px ${props.config.textShadow}` : null,
    ...bold,
    ...italic,
    zIndex: props.index
  };
});

const otherStyle = computed(() => props.config.otherStyle);
</script>
<style scoped lang="scss">
.widgets-text {
  position: absolute;
  padding: 10px;
  line-height: 1.5;
}
</style>
