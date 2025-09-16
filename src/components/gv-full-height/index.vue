<template>
  <div class="gv-table-height" :class="{ 'scroll-custom': scroll }" ref="maTableHeightRef">
    <slot />
  </div>
</template>
<script>
export default { name: 'gv-full-height' };
</script>
<script setup>
// 快捷设置表格恰好填满屏幕
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { getOffsetDOM, getPX, isDisplayNone } from '@/tools';

let timer = null;
let observerEnt = null;
const props = defineProps({
  // 距离底部的距离
  bottom: Number,
  // 是否允许滚动
  scroll: Boolean,
  // 是否计算适应高度
  exec: { type: Boolean, default: true }
});

const maTableHeightRef = ref();

const emits = defineEmits(['resize']);

const resizeHandler = () => {
  if (!props.exec || document.documentElement.clientWidth < 768) return;
  nextTick(() => {
    const offset = getOffsetDOM(maTableHeightRef.value);
    const height = Math.max(window.innerHeight - offset.y - (props.bottom || 0), 300);
    maTableHeightRef.value.style.height = getPX(height);
    emits('resize', height);
  });
};

const delayResizeHandler = () => {
  resizeHandler();
  timer = setTimeout(() => {
    resizeHandler();
  }, 300);
  return timer;
};

const checkElement = () => {
  const targetElement = isDisplayNone(maTableHeightRef.value);
  if (!targetElement || !window.MutationObserver) return delayResizeHandler();
  // 创建一个 MutationObserver 对象
  observerEnt = new MutationObserver((mutationsList, observer) => {
    // 在属性变化时执行回调函数
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        if (window.getComputedStyle(targetElement).display !== 'none') {
          delayResizeHandler();
          observer.disconnect();
        }
      }
    }
  });
  observerEnt.observe(targetElement, { attributes: true });
};

onMounted(() => {
  checkElement();
  window.addEventListener('resize', resizeHandler, false);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  observerEnt?.disconnect();
  window.removeEventListener('resize', resizeHandler, false);
});

defineExpose({ resizeHandler });
</script>
<style scoped lang="scss">
.gv-table-height {
}
</style>
