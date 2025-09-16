<template>
  <div class="gv-resize-text" ref="elRef" :style="fontSize">{{ content }}</div>
</template>
<script>
export default {
  name: 'gv-resize-text'
};
</script>
<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import { getPX, parsePX } from '@/tools';
import { debounce } from 'throttle-debounce';

const elRef = shallowRef();

const props = defineProps({ content: [String, Number] });

const elWidth = ref(null);

const elContent = ref();

const fontSize = ref();

const closePage = { func: null };

const setElWidth = () => {
  if (!elRef.value) return;
  if (elWidth.value === elRef.value?.clientWidth) return;
  elWidth.value = elRef.value?.clientWidth;
  fontSize.value = null;
};

const setElContent = () => {
  if (elContent.value === props.content) return;
  elContent.value = props.content;
  fontSize.value = null;
};

const watchWidth = () => {
  if (!elRef.value) return;
  const delaySetELWidth = debounce(300, setElWidth);
  const observer = new ResizeObserver(() => delaySetELWidth());
  observer.observe(elRef.value);
  closePage.func = () => {
    delaySetELWidth.cancel();
    observer.disconnect();
  };
};

watch(
  () => props.content,
  () => setElContent()
);

watch([() => elContent.value, () => elWidth.value], async () => {
  await nextTick();
  const content = String(elContent.value ?? '');
  const cWidth = elWidth.value;
  const sWidth = elRef.value?.scrollWidth ?? 0;
  if (!cWidth || !content || !getComputedStyle || !elRef.value) return;
  const cFontSize = parsePX(getComputedStyle(elRef.value).fontSize);
  if (sWidth > cWidth) {
    fontSize.value = { fontSize: getPX(Math.floor(cFontSize * (cWidth / sWidth))) };
  } else {
    fontSize.value = { fontSize: getPX(cFontSize) };
  }
});

onMounted(() => {
  setElWidth();
  setElContent();
  watchWidth();
});

onBeforeUnmount(() => {
  if (closePage.func) closePage.func();
});
</script>
<style scoped lang="scss">
.gv-resize-text {
  white-space: nowrap;
  word-break: keep-all;
  overflow: hidden;
}
</style>
