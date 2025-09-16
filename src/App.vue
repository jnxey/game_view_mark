<script setup>
import { RouterView } from 'vue-router';
import { onBeforeMount, onMounted, watch } from 'vue';
import { getSystemConfig, systemState, watchSkin } from '@/store/system.js';
import GvKeyboard from '@/components/gv-keyboard/index.vue';
import { useVKeyboard } from '@/components/gv-keyboard/keyboard';
import { imagePreviewClose, imagePreviewIndex, imagePreviewList, imagePreviewStatus } from '@/store/image-viewer';
import { changeFavicon, getBaseImagUrl } from '@/tools';
import { initSpeak } from '@/hooks/speak';
import { initInputLanguage } from '@/lang/input';
import { syncGlobalDict } from '@/store/global-dict';
import { languageBody } from '@/lang';
import { managerState } from '@/store/manager';
import { initEnv } from '@/config/env';
import { syncChatList, synChatTopMessage } from '@/store/chat';

const { keyboardState, showKeyboard, hideKeyboard, setKeyboardValue, initKeyboardListener } = useVKeyboard(() => systemState.keyboard);

const removeLoadingInit = () => {
  // 移除 Loading
  const loadingElement = document.getElementById('app-loading');
  if (loadingElement) loadingElement.remove();
};

watch(
  () => managerState.user,
  () => {
    syncGlobalDict();
    syncChatList();
    synChatTopMessage();
  },
  { immediate: true }
);

onBeforeMount(async () => {
  initEnv();
  removeLoadingInit();
  initInputLanguage();
  languageBody();
  await getSystemConfig();
  if (!!systemState.config.web_favicon) changeFavicon(getBaseImagUrl(systemState.config.web_favicon));
});

onMounted(() => {
  watchSkin();
  initSpeak();
  initKeyboardListener();
});
</script>

<template>
  <RouterView />
  <el-image-viewer
    v-if="imagePreviewStatus"
    :url-list="imagePreviewList"
    show-progress
    :initial-index="imagePreviewIndex"
    @close="imagePreviewClose"
  />
  <gv-keyboard v-if="keyboardState.show" :position="keyboardState.position" :show="showKeyboard" :hide="hideKeyboard" :set-value="setKeyboardValue" />
</template>

<style scoped></style>
