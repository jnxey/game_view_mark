<template>
  <div ref="elRef" @pointerdown.stop />
</template>
<script>
export default { name: 'glc-hit-resize' };
</script>
<script setup>
import { inject, onMounted, shallowRef } from 'vue';
import { useResize } from '../_hooks/resize.js';
import { usePosNumber } from '../_hooks/number.js';

const windowConfig = inject('windowConfig');
const isEnterSpace = inject('isEnterSpace');
const current = inject('current');
const schema = inject('schema');
const setSchema = inject('setSchema');

const props = defineProps({ position: String });

const elRef = shallowRef();

const { setDragDom } = useResize(
  () => !isEnterSpace.value,
  (pointer) => {
    if (props.position === 'top') {
      setSchema(current.value, 'position', usePosNumber(pointer.py + pointer.y), 'y');
      setSchema(current.value, 'size', usePosNumber(pointer.cy - pointer.y), 'height');
    } else if (props.position === 'right') {
      setSchema(current.value, 'size', usePosNumber(pointer.cx + pointer.x), 'width');
    } else if (props.position === 'bottom') {
      setSchema(current.value, 'size', usePosNumber(pointer.cy + pointer.y), 'height');
    } else if (props.position === 'left') {
      setSchema(current.value, 'position', usePosNumber(pointer.px + pointer.x), 'x');
      setSchema(current.value, 'size', usePosNumber(pointer.cx - pointer.x), 'width');
    }
  },
  () => windowConfig.scale,
  () => {
    const size = getSize();
    const position = getPosition();
    return { x: size.width, y: size.height, px: position.x, py: position.y };
  }
);

const getPosition = () => {
  const key = schema.findIndex((val) => val.uid === current.value);
  if (key <= -1) return;
  const temp = schema[key];
  return { ...temp.config.position };
};

const getSize = () => {
  const key = schema.findIndex((val) => val.uid === current.value);
  if (key <= -1) return;
  const temp = schema[key];
  return { ...temp.config.size };
};

onMounted(() => {
  const size = getSize();
  setDragDom(elRef.value, { ...size });
});
</script>
<style scoped lang="scss">
.resize-top-bottom {
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  width: 30px;
  height: 8px;
  border: 2px solid rgb(var(--el-color-primary-rgb));
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
  transform: translateX(-50%);
  z-index: 10;
}

.resize-left-right {
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  width: 8px;
  height: 30px;
  border: 2px solid rgb(var(--el-color-primary-rgb));
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
  transform: translateY(-50%);
  z-index: 10;
}

.resize-top {
  top: -5px;
  cursor: n-resize;
}

.resize-right {
  right: -5px;
  cursor: e-resize;
}

.resize-bottom {
  bottom: -5px;
  cursor: n-resize;
}

.resize-left {
  left: -5px;
  cursor: e-resize;
}
</style>
