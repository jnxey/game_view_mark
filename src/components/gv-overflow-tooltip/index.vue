<template>
  <div>
    <el-tooltip v-bind="props" :disabled="disabled">
      <div ref="textRef" class="overflow-text truncate" :style="{ textOverflow: overfloType }">
        {{ content }}
      </div>
    </el-tooltip>
  </div>
</template>
<script>
export default { name: 'gv-overflow-tooltip' };
</script>
<script setup>
import { useEventListener } from '@vueuse/core';
import { useTooltipContentProps } from 'element-plus';
import { ref, shallowRef } from 'vue';

const props = defineProps({
  ...useTooltipContentProps,
  teleported: { type: Boolean, default: false },
  placement: { type: String, default: 'top' },
  overfloType: { type: String, default: 'ellipsis' }
});
const textRef = shallowRef();
const disabled = ref(false);

useEventListener(textRef, 'mouseenter', () => {
  if (textRef.value?.scrollWidth > textRef.value?.offsetWidth) {
    disabled.value = false;
  } else {
    disabled.value = true;
  }
});
</script>

<style scoped lang="scss">
.overflow-text.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
