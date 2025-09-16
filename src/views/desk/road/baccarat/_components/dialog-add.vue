<template>
  <teleport to="#app">
    <transition>
      <div class="dialog-add" v-if="show" :style="style">
        <gv-game-kind-icon v-if="handler" :kinds="gameKindMap" :compose="handler.bet_result" :size="100" percent />
      </div>
    </transition>
  </teleport>
</template>
<script setup>
import { inject, onBeforeUnmount, ref } from 'vue';
import { getPX, getWindowSize } from '@/tools/index.js';
import GvGameKindIcon from '@/components/gv-game-kind-icon/index.vue';

const gameKindMap = inject('gameKindMap');

const show = ref(false);
const isSync = ref(false);
const handler = ref(null);
const style = ref({});
let timer = null;

const open = (item, sync) => {
  const screen = getWindowSize();
  const part = screen.width / 4;
  const top = (screen.height - part) / 2;
  const left = (screen.width - part) / 2;
  style.value = { top: getPX(top), left: getPX(left), width: getPX(part), height: getPX(part) };
  handler.value = item;
  show.value = true;
  isSync.value = sync;
};

const close = () => {
  show.value = false;
};

const getShow = () => show.value;

const getSync = () => isSync.value;

const move = (to, callback) => {
  if (!to) {
    close();
    callback();
  } else {
    const top = to.y * to.boxSize + to.rect.top;
    const left = to.x * to.boxSize + to.rect.left - to.translate;
    style.value = {
      top: getPX(top),
      left: getPX(left),
      width: getPX(to.boxSize),
      height: getPX(to.boxSize),
      transform: 'scale(0.8)',
      transformOrigin: 'center'
    };
    clearTimeout(timer);
    timer = setTimeout(() => {
      close();
      callback();
    }, 500);
  }
};

onBeforeUnmount(() => {
  clearTimeout(timer);
});

defineExpose({ open, close, move, getShow, getSync });
</script>
<style lang="scss" scoped>
.dialog-add {
  position: fixed;
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  z-index: 12;

  /* 下面我们会解释这些 class 是做什么的 */
  &.v-enter-active,
  &.v-leave-active {
    opacity: 1;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  &.v-enter-from,
  &.v-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }
}
</style>
