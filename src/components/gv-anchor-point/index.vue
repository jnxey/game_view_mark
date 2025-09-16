<template>
  <el-scrollbar ref="scrollbarRef" :max-height="maxHeight" :height="height" @scroll="handleScroll" class="gv-anchor-point">
    <slot></slot>
  </el-scrollbar>
</template>
<script>
// 锚点滚动
export default { name: 'gv-anchor-point' };
</script>
<script setup>
import { onMounted, provide, ref, shallowRef } from 'vue';
import { delayExec, getOffsetDOM, smoothScrollTo } from '@/tools';
import { throttle } from 'throttle-debounce';

const markName = 'data-anchor-point';

const emits = defineEmits(['scroll-anchor']);

const props = defineProps({ maxHeight: [String, Number], height: [String, Number] });
const scrollbarRef = shallowRef();
const position = ref([]);
const lock = ref(false);

const getScrollValue = (value, offset = 10) => {
  return Math.max(0, value - offset);
};

const scroll = (mark) => {
  const target = scrollbarRef.value?.wrapRef?.querySelector(`[${markName}="${mark}"]`);
  if (!target) return;
  const current = scrollbarRef.value?.wrapRef?.scrollTop;
  const to = getOffsetDOM(target, scrollbarRef.value?.wrapRef?.parentNode);
  lock.value = true;
  smoothScrollTo(
    (value) => {
      scrollbarRef.value?.setScrollTop(value);
    },
    current,
    getScrollValue(to.y),
    () => {
      lock.value = false;
    }
  );
};

const initPosition = async () => {
  await delayExec(60);
  const targets = scrollbarRef.value?.wrapRef?.querySelectorAll(`[${markName}]`);
  const _position = [];
  targets.forEach((node) => {
    const value = getOffsetDOM(node, scrollbarRef.value?.wrapRef?.parentNode);
    _position.push({
      name: node.getAttribute(markName),
      value: value.y
    });
  });
  position.value = _position;
};

const handleScroll = throttle(60, () => {
  if (lock.value) return;
  const current = scrollbarRef.value?.wrapRef?.scrollTop;
  let anchor = position[0]?.name;
  position.value.forEach((item) => {
    if (current > getScrollValue(item.value, 20)) anchor = item.name;
  });
  emits('scroll-anchor', anchor);
});

onMounted(() => {
  initPosition();
});

provide('initPosition', initPosition);
defineExpose({ scroll, initPosition });
</script>
