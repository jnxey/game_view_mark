<template>
  <div
    class="hit-box"
    :style="style"
    v-hover="'is-hover'"
    :class="{ 'is-current': current === uid }"
    @mousedown.stop
    @click.stop="setCurrent(uid)"
    ref="elRef"
    @click.right.prevent="rightClick"
  >
    <slot />
    <div class="box" />
    <template v-if="resize && current === uid">
      <glc-hit-resize class="resize-top resize-top-bottom" position="top" />
      <glc-hit-resize class="resize-right resize-left-right" position="right" />
      <glc-hit-resize class="resize-bottom resize-top-bottom" position="bottom" />
      <glc-hit-resize class="resize-left resize-left-right" position="left" />
    </template>
    <glc-hit-command ref="commandRef">
      <div class="command-item" @click="execCommand('top')">{{ $t('components.gv_low_code.command_top') }}</div>
      <div class="command-item" @click="execCommand('bottom')">{{ $t('components.gv_low_code.command_bottom') }}</div>
      <div class="command-item" @click="execCommand('up')">{{ $t('components.gv_low_code.command_up') }}</div>
      <div class="command-item" @click="execCommand('down')">{{ $t('components.gv_low_code.command_down') }}</div>
      <div class="command-item" @click="execCommand('copy')">{{ $t('components.gv_low_code.command_copy') }}</div>
      <el-divider class="size-small" direction="horizontal" />
      <div class="command-item" @click="execCommand('delete')">{{ $t('components.gv_low_code.command_delete') }}</div>
    </glc-hit-command>
  </div>
</template>
<script>
export default { name: 'glc-hit-box' };
</script>
<script setup>
import { computed, inject, onMounted, reactive, shallowRef, watch } from 'vue';
import { useDrag } from '../_hooks/drag.js';
import GlcHitCommand from './_hit-command.vue';
import GlcHitResize from './_hit-resize.vue';
import { $t } from '@/lang/i18n';
import { checkIndexArray, deepClone, isFunction } from '@/tools';

const windowConfig = inject('windowConfig');
const isEnterSpace = inject('isEnterSpace');
const current = inject('current');
const setCurrent = inject('setCurrent');
const schema = inject('schema');
const setSchema = inject('setSchema');
const addSchema = inject('addSchema');
const setZIndex = inject('setZIndex');
const setBLine = inject('setBLine');

const props = defineProps({ style: Object, resize: Boolean, uid: String });

const elRef = shallowRef();
const commandRef = shallowRef();

// 当前配置项
const schemaCurrent = computed(() => {
  const key = schema.findIndex((val) => val.uid === props.uid);
  if (!checkIndexArray(key)) return;
  return schema[key];
});

// 计算除当前配置项的边界位置
const boundary = computed(() => {
  const result = [];
  schema?.forEach((item) => {
    if (item.uid === props.uid) return;
    const xFull = item.config.position.x + item.config.size.width;
    const yFull = item.config.position.y + item.config.size.height;
    result.push({ x: item.config.position.x, y: item.config.position.y, xFull: xFull, yFull: yFull });
  });
  return result;
});

// 设置拖拽
const { pointer, setDragDom } = useDrag(
  () => {
    if (!isEnterSpace.value && current.value === props.uid) return true;
  },
  (position) => {
    setSchema(props.uid, 'position', { ...position });
  },
  () => windowConfig.scale,
  () => ({ ...schemaCurrent.value.config.position })
);

// 辅助线
const bLine = computed(() => {
  const result = { x: null, y: null, xFull: null, yFull: null };
  if (!pointer.resize || !schemaCurrent.value) return result;
  const position = schemaCurrent.value.config.position;
  const size = schemaCurrent.value.config.size;
  const xFull = position.x + size.width;
  const yFull = position.y + size.height;
  boundary.value.forEach((val) => {
    // normal
    if (Math.abs(val.x - position.x) <= 50) {
      result.x = result.x === null || Math.abs(result.x - position.x) > Math.abs(val.x - position.x) ? val.x : result.x;
    }
    if (Math.abs(val.y - position.y) <= 50) {
      result.y = result.y === null || Math.abs(result.y - position.y) > Math.abs(val.y - position.y) ? val.y : result.y;
    }
    // full
    if (Math.abs(val.xFull - xFull) <= 50) {
      result.xFull = result.xFull === null || Math.abs(result.xFull - xFull) > Math.abs(val.xFull - xFull) ? val.xFull : result.xFull;
    }
    if (Math.abs(val.yFull - yFull) <= 50) {
      result.yFull = result.y === null || Math.abs(result.yFull - yFull) > Math.abs(val.yFull - yFull) ? val.yFull : result.yFull;
    }
  });
  const xMin =
    result.x !== null && result.xFull !== null
      ? Math.abs(result.xFull - xFull) < Math.abs(result.x - position.x)
        ? result.xFull
        : result.x
      : (result.x ?? result.xFull);
  const yMin =
    result.y !== null && result.yFull !== null
      ? Math.abs(result.yFull - yFull) < Math.abs(result.y - position.y)
        ? result.yFull
        : result.y
      : (result.y ?? result.yFull);
  return { x: xMin, y: yMin };
});

// 右击
const rightClick = (event) => {
  if (current.value !== props.uid) return;
  commandRef.value?.open(event);
};

// 执行指令
const execCommand = (type) => {
  commandRef.value?.close();
  if (type === 'copy') {
    const key = schema?.findIndex((val) => val.uid === current.value);
    if (checkIndexArray(key)) {
      const info = deepClone(schema[key]);
      info.config.position.x = info.config.position.x + 10;
      info.config.position.y = info.config.position.y + 10;
      const uid = addSchema(info);
      setCurrent(uid);
    }
  } else {
    setZIndex(props.uid, type);
  }
};

watch(
  () => bLine.value,
  () => {
    if (isFunction(setBLine)) setBLine(bLine.value);
  }
);

onMounted(() => {
  setDragDom(elRef.value);
});
</script>
<style scoped lang="scss">
.hit-box {
  .box {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  &.is-hover .box {
    display: block;
    border: 1px dashed rgb(var(--el-color-primary-rgb));
  }
  &.is-current .box {
    display: block;
    border: 1px solid rgb(var(--el-color-primary-rgb));
    background-color: rgba(var(--el-color-primary-rgb), 0.2);

    &:hover {
      cursor: move;
    }
  }
}
</style>
