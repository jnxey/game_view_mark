<template>
  <div class="gv-download-app pb-16">
    <div class="flex-row align-top justify-around">
      <div class="download-item flex-col align-center justify-center">
        <qrcode-vue v-if="!!androidUrl" class="device-icon mb-16" :value="androidUrl" :size="160" level="H" render-as="svg" />
        <img v-else class="device-icon mb-16" src="@/assets/images/common/android.png" alt="" />
        <el-button type="primary" size="large" round @click="downloadAndroid">
          Android{{ !!androidUrl ? ' ' + $t('components.gv_download_app.download') : '' }}
        </el-button>
      </div>
      <div class="download-item flex-col align-center justify-center">
        <qrcode-vue v-if="!!windowsUrl" class="device-icon mb-16" :value="windowsUrl" :size="160" level="H" render-as="svg" />
        <img v-else class="device-icon mb-16" src="@/assets/images/common/windows.png" alt="" />
        <el-button type="primary" size="large" round @click="downloadWindows">
          Windows{{ !!windowsUrl ? ' ' + $t('components.gv_download_app.download') : '' }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default { name: 'gv-download-app-panel' };
</script>
<script setup>
import { $t } from '@/lang/i18n';
import { toAwait } from '@/tools';
import axios from 'axios';
import layer from '@/tools/layer';
import FileSaver from '@/tools/fileSaver';
import { RESPONSE_CODE } from '@/values';
import QrcodeVue from 'qrcode.vue';
import { ref } from 'vue';

const props = defineProps({ config: Object });

const androidUrl = ref();
const windowsUrl = ref();

// 重置
const reset = () => {
  androidUrl.value = null;
  windowsUrl.value = null;
};

// 打包Android
const downloadAndroid = async () => {
  const params = { ...props.config };
  const apkName = `${params.install_name}.apk`;
  if (!!androidUrl.value) return downloadPackage(androidUrl.value, apkName);
  layer.loading($t('components.gv_download_app.tips_build_loading'));
  const [res, err] = await toAwait(axios.post('/build/build-android', params));
  layer.closeLoading();
  if (!!err) return layer.notifyError(err?.msg);
  if (res.data.code === RESPONSE_CODE.FAIL) return layer.notifyError(res.data.msg);
  else layer.msgSuccess($t('components.gv_download_app.tips_build_success'));
  androidUrl.value = `${location.origin}/build/android/${res.data.data}/${apkName}`;
};

// 打包Windows
const downloadWindows = async () => {
  const params = { ...props.config };
  const apkName = `${params.install_name}.exe`;
  if (!!windowsUrl.value) return downloadPackage(windowsUrl.value, apkName);
  layer.loading($t('components.gv_download_app.tips_build_loading'));
  const [res, err] = await toAwait(axios.post('/build/build-windows', params));
  layer.closeLoading();
  if (!!err) return layer.notifyError(err?.msg);
  if (res.data.code === RESPONSE_CODE.FAIL) return layer.notifyError(res.data.msg);
  else layer.msgSuccess($t('components.gv_download_app.tips_build_success'));
  windowsUrl.value = `${location.origin}/build/window/${res.data.data}/${apkName}`;
};

// 下载安装包
const downloadPackage = (url, name) => {
  FileSaver.saveAs(url, name);
};

defineExpose({ reset });
</script>
<style lang="scss">
.gv-download-app {
  .download-item {
    width: 300px;
    padding: 20px 0;
    border-radius: var(--gv-border-radius-mid);
    border: 1px solid var(--el-border-color);

    .device-icon {
      width: 160px;
      height: 160px;
    }
  }
}
</style>
