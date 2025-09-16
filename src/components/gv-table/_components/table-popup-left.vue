<template>
  <transition name="fade">
    <div v-show="show" class="table-popup-left mr-12" :style="{ width: getPX(width), height: getPX(contentHeight) }">
      <div class="content" :style="{ height: getPX(contentHeight) }">
        <slot />
      </div>
      <span class="popup-title fz-14 fw-bold">
        {{ title }}
      </span>
      <span class="close-icon flex-row align-center justify-center cursor-pointer" @click="close">
        <gv-icon name="el-icon-close" class="fz-16" />
      </span>
    </div>
  </transition>
  <div class="table-popup-left-place" :style="{ width: show ? getPX(width + 15) : 0 }"></div>
  <div
    v-show="!show"
    class="table-touch-button cursor-pointer"
    :style="{ bottom: getPX(buttonBottom - 80), height: getPX(touchButtonHeight) }"
    @click="open"
  >
    <div class="title" :style="{ height: getPX(touchButtonHeight) }">
      <gv-icon class="fz-14 color-white mr-4" :name="icon" />
      <span>{{ title }}</span>
    </div>
    <gv-icon class="icon fz-14 color-white" :name="icon" />
  </div>
</template>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';
import { computed, inject, ref } from 'vue';
import { delayExec, getPX } from '@/tools';
import { storage } from '@/tools/storage';
import { CACHE_KEY_GV_TABLE_POPUP_LEFT } from '@/values/cache';

const touchButtonHeight = 40;

const tableKey = inject('tableKey');

const cachePopup = storage.get(CACHE_KEY_GV_TABLE_POPUP_LEFT) ?? {};

const emits = defineEmits(['statusChange']);
const props = defineProps({
  title: String,
  width: Number,
  height: Number,
  offset: Number,
  buttonBottom: Number,
  icon: String,
  defaultShow: Boolean
});
const show = ref(cachePopup[tableKey] ?? props.defaultShow);

const contentHeight = computed(() => {
  return props.height - props.offset;
});

const open = async () => {
  show.value = true;
  saveCache(true);
  await delayExec(300);
  emits('statusChange', show.value);
};

const close = async () => {
  show.value = false;
  saveCache(false);
  await delayExec(300);
  emits('statusChange', show.value);
};

const saveCache = (bool) => {
  const cache = storage.get(CACHE_KEY_GV_TABLE_POPUP_LEFT) ?? {};
  cache[tableKey] = bool;
  storage.set(CACHE_KEY_GV_TABLE_POPUP_LEFT, cache);
};

defineExpose({ open, close });
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    transform 0.3s linear,
    opacity 0.3s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.table-popup-left-place {
  transition: width 0.3s linear;
}

.table-popup-left {
  position: absolute;
  top: 15px;
  left: 15px;
  min-width: 120px;
  overflow: hidden;
  border-radius: var(--gv-border-radius-big);
  box-shadow: var(--el-box-shadow-light);
  background-color: var(--el-bg-color);
  z-index: var(--gv-popup-z-index);

  .content {
    padding-top: 40px;
  }

  .popup-title {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    z-index: 10;
  }

  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    z-index: 10;

    &:hover {
      color: var(--el-primary-text-color);
      border-radius: 0 0 0 16px;
      background-color: var(--el-color-primary);
    }
  }
}

.table-touch-button {
  position: absolute;
  left: 0;
  opacity: 1;
  user-select: none;
  border-radius: 0 8px 8px 0;
  background-color: var(--el-color-primary);
  z-index: var(--gv-popup-z-index);

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    max-width: 16px;
    padding: 0 10px;
    line-height: 1.2;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    color: transparent;
    transition:
      max-width 0.3s linear,
      color 0.3s linear;
  }

  .icon {
    position: absolute;
    top: 50%;
    right: 2px;
    transform: translateY(-50%);
    color: var(--el-primary-text-color);
    transition: color 0.3s linear;
    z-index: 10;
  }

  &:hover {
    .icon {
      color: transparent;
    }

    .title {
      max-width: 200px;
      color: var(--el-primary-text-color);
    }
  }
}
</style>
