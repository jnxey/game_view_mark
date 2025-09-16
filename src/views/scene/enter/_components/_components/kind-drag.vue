<template>
  <div class="kind-drag flex-row align-center justify-center" ref="elRef">
    <gv-icon class="resize-icon fz-12" name="local-icon-drag-dot" />
  </div>
</template>
<script setup>
import { useDrag } from '@/hooks/drag';
import { onMounted, ref, shallowRef, watch } from 'vue';
import GvIcon from '@/components/gv-icon/index.vue';

const emits = defineEmits(['setWidth']);
const props = defineProps({ kindId: Number, width: Number });

const elRef = shallowRef();
const cacheStartWidth = ref(100);

const { pointer, resetPointer, setDragDom } = useDrag(
  () => {
    cacheStartWidth.value = props.width;
  },
  () => handlerEnd()
);

const handlerEnd = () => {
  resetPointer();
};

watch(
  () => pointer.x,
  () => {
    if (!pointer.resize) return;
    const newWidth = cacheStartWidth.value + pointer.x;
    emits('setWidth', { id: props.kindId, width: Math.max(10, newWidth) });
  }
);

onMounted(() => {
  setDragDom(elRef.value);
});
</script>
<style scoped lang="scss">
.kind-drag {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 100%;
  user-select: none;
  cursor: ew-resize;
  background-color: var(--scene-enter-amount-normal-btn-bg-1);
  z-index: 10;
}
</style>
