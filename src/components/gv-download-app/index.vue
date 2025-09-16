<template>
  <gv-popup ref="popupRef" :title="$t('components.gv_download_app.title')" :async="true" width="800px" :show-footer="false">
    <gv-download-app-panel ref="appPanelRef" :config="config" />
  </gv-popup>
</template>
<script>
export default { name: 'gv-download-app' };
</script>
<script setup>
import { shallowRef } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import { $t } from '@/lang/i18n';
import GvDownloadAppPanel from '@/components/gv-download-app/panel.vue';

const emit = defineEmits(['success']);

const popupRef = shallowRef();
const appPanelRef = shallowRef();

const config = shallowRef({});

const open = (options) => {
  config.value = options;
  appPanelRef.value?.reset();
  popupRef.value?.open();
};

defineExpose({ open });
</script>
