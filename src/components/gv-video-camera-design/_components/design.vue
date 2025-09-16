<template>
  <div class="design">
    <iframe ref="iframeRef" class="iframe" :src="`/video-recorder/index.html?mode=hk_mask&lang=${languageCurrent}`" />
  </div>
</template>
<script setup>
import { onMounted, shallowRef, onBeforeUnmount } from 'vue';
import layer from '@/tools/layer';
import { deepClone, delayExec } from '@/tools';
import { $t } from '@/lang/i18n';
import { financeTableBindCamera } from '@/api/finance/table';
import { IframeCommunicator } from '@/tools/iframe-communicator';
import { languageCurrent } from '@/lang';

const emits = defineEmits(['saveSuccess']);

const props = defineProps({ recorder: Object });

const iframeRef = shallowRef();
const messenger = { instance: null };

const saveCurrentPoint = async (tableId, params) => {
  await delayExec(100);
  messenger.instance.request('get-point-map').then(async (data) => {
    if (!data) return layer.msgError($t('components.gv_video_camera_design.tips_error_point'));
    console.log(data, '--------------------------1');
    params.AREA_POINTS = deepClone(data);
    layer.loading();
    await financeTableBindCamera({ id: tableId, camera_info: JSON.stringify(params) });
    layer.closeLoading();
    layer.msgSuccess($t('common.save_success'));
    emits('saveSuccess');
  });
};

onMounted(() => {
  messenger.instance = new IframeCommunicator({
    targetWindow: iframeRef.value.contentWindow
  });
  messenger.instance.on('recorder-info', (_, respond) => {
    respond(deepClone({ ...props.recorder }));
  });
});

onBeforeUnmount(() => {
  if (!!messenger.instance?.destroy) {
    messenger.instance?.destroy();
    messenger.instance = null;
  }
});

defineExpose({ saveCurrentPoint });
</script>
<style scoped lang="scss">
.design {
  width: 1000px;
  height: 560px;

  .iframe {
    width: 1000px;
    height: 560px;
    border: none;
  }
}
</style>
