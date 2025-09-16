<template>
  <div class="voice-wrap" :class="{ open: utterSilence, close: !utterSilence }" @click="toggleSpeak" />
</template>
<script setup>
import { toggleSpeak, utterSilence } from '@/hooks/speak';
import { onMounted } from 'vue';
import { delayExec } from '@/tools';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';

onMounted(async () => {
  await delayExec(500);
  if (!utterSilence.value) {
    await layer.confirm($t('desk.bonus.tips_toggle_voice'));
    toggleSpeak();
  }
});
</script>
<style lang="scss" scoped>
.voice-wrap {
  position: fixed;
  top: 10px;
  right: 10px;
  width: 60px;
  height: 60px;
  cursor: pointer;
  opacity: 0.2;
  z-index: 10;

  &.open {
    background-image: url('@/assets/images/activity/voice-open.png');
    background-size: 100% 100%;
  }

  &.close {
    background-image: url('@/assets/images/activity/voice-close.png');
    background-size: 100% 100%;
  }

  &:hover {
    opacity: 0.6;
  }
}
</style>
