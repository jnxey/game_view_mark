<template>
  <el-image :style="styles" v-bind="props"></el-image>
</template>
<script>
export default { name: 'gv-image' };
</script>
<script setup name="gv-image">
import { imageProps } from 'element-plus';
import { computed } from 'vue';
import { getPX } from '@/tools/index.js';

const props = defineProps({
  width: {
    type: [String, Number],
    default: 'auto'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  radius: {
    type: [String, Number],
    default: 0
  },
  ...imageProps
});

const styles = computed(() => {
  return {
    width: getPX(props.width),
    height: getPX(props.height),
    borderRadius: getPX(props.radius)
  };
});
</script>

<style lang="scss" scoped>
.el-image {
  display: block;
}
</style>
