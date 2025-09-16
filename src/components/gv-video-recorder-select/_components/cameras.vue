<template>
  <div class="cameras">
    <iframe ref="iframeRef" class="iframe" :src="`/video-recorder/index.html?mode=hk_select&lang=${languageCurrent}`" />
  </div>
</template>
<script setup>
import { onMounted, shallowRef, onBeforeUnmount, ref, unref } from 'vue';
import { IframeCommunicator } from '@/tools/iframe-communicator';
import { deepClone } from '@/tools';
import { languageCurrent } from '@/lang';

const props = defineProps({ recorder: Object });

const iframeRef = shallowRef();
const messenger = { instance: null };
const selected = ref(null);

const getCurrentSelect = () => {
  return unref(selected);
};

onMounted(() => {
  messenger.instance = new IframeCommunicator({
    targetWindow: iframeRef.value.contentWindow
  });
  messenger.instance.on('recorder-info', (_, respond) => {
    respond(deepClone({ ...props.recorder }));
  });
  messenger.instance.on('send-recorder-selected', (info) => {
    selected.value = !!info ? { ...info } : null;
  });
});

onBeforeUnmount(() => {
  if (!!messenger.instance?.destroy) {
    messenger.instance?.destroy();
    messenger.instance = null;
  }
});

defineExpose({ getCurrentSelect });
</script>
<style scoped lang="scss">
.cameras {
  width: 1000px;
  height: 560px;

  .iframe {
    width: 1000px;
    height: 560px;
    border: none;
  }
}
</style>
