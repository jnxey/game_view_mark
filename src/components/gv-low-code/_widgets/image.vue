<template>
  <glc-hit-box class="widgets-image" :style="wrapStyle" resize :uid="uid">
    <img :src="config.imageSrc" alt="" :style="imageStyle" />
  </glc-hit-box>
</template>
<script>
export default { name: 'glc-widget-image' };
</script>
<script setup>
import { computed } from 'vue';
import { getPX } from '@/tools/index.js';
import GlcHitBox from './_hit-box.vue';

const props = defineProps({ config: Object, uid: String, index: Number });

const wrapStyle = computed(() => {
  return {
    top: getPX(props.config.position?.y),
    left: getPX(props.config.position?.x),
    zIndex: props.index
  };
});

const imageStyle = computed(() => {
  return {
    width: getPX(props.config.size?.width),
    height: getPX(props.config.size?.height)
  };
});
</script>
<style scoped lang="scss">
.widgets-image {
  position: absolute;
}
</style>
