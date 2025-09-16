<template>
  <div class="gv-drag-area" ref="elRef">
    <div class="content" :class="contentClass" :style="contentStyle">
      <slot name="content" />
    </div>
    <slot name="other" />
  </div>
</template>
<script>
export default { name: 'gv-drag-area' };
</script>
<script setup>
import { computed, onMounted, shallowRef } from 'vue';
import { useDrag } from '@/hooks/drag';
import { getPX } from '@/tools';

defineProps({ contentClass: String });

const elRef = shallowRef();

const { pointer, resetPointer, setDragDom } = useDrag();

const contentStyle = computed(() => {
  return { top: getPX(pointer.y), left: getPX(pointer.x) };
});

onMounted(() => {
  setDragDom(elRef.value);
});

defineExpose({ resetPointer });
</script>
<style lang="scss" scoped>
.gv-drag-area {
  position: relative;
  overflow: hidden;
  touch-action: none;

  .content {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    z-index: 1;
  }
}
</style>
