<template>
  <teleport to="#app">
    <div v-show="isVisible" class="scan-card">
      <div class="container">
        <iframe ref="iframeRef" class="iframe" :src="`/video-recorder/index.html?mode=hk_clip&lang=${languageCurrent}`" />
        <!--  title -->
        <div class="title p-8 cursor-pointer fz-18 fw-bold">
          {{ $t('scene.enter.operate_scan') }}
        </div>
        <!--  关闭按钮 -->
        <div class="close-icon p-8 cursor-pointer" @click="close">
          <gv-icon class="fz-24" name="el-icon-close" />
        </div>
      </div>
    </div>
  </teleport>
</template>
<script setup>
import { ref, onMounted, shallowRef, onBeforeUnmount, inject, computed } from 'vue';
import { $t } from '@/lang/i18n';
import GvIcon from '@/components/gv-icon/index.vue';
import { deepClone, delayExec, getJSON, mappingArrayToObject } from '@/tools';
import { storage } from '@/tools/storage';
import { CACHE_KEY_TOKEN } from '@/values/cache';
import { IframeCommunicator } from '@/tools/iframe-communicator';
import { $ti } from '@/lang/input';
import eventManager from '@/tools/event-manager';
import { EVENTS_SCENE_AI_SCAN_SET } from '@/values/events';
import layer from '@/tools/layer';
import { financeTableBindCamera } from '@/api/finance/table';
import { languageCurrent } from '@/lang';
import { useDictOptions } from '@/hooks/dict';
import { financeCameraLists } from '@/api/finance/video-recorder';

const tableInfo = inject('tableInfo');
const gameKindFilter = inject('gameKindFilter');

const isVisible = ref(false);
const iframeRef = shallowRef();
const messenger = { instance: null };
const { optionsData, refresh } = useDictOptions({ recorders: { api: financeCameraLists } }, true);
const recordersMap = computed(() => mappingArrayToObject(optionsData.recorders ?? []));

const bindInfo = computed(() => getJSON(tableInfo.value?.camera_info, null));

// 对外暴露的显示方法
const show = async () => {
  isVisible.value = true;
  messenger.instance.send('try-scan-poker');
};

// 关闭处理
const close = () => {
  isVisible.value = false;
};

onMounted(async () => {
  messenger.instance = new IframeCommunicator({
    targetWindow: iframeRef.value.contentWindow
  });
  messenger.instance.on('recorder-info', async (_, respond) => {
    await refresh();
    const rMap = recordersMap.value;
    const nInfo = bindInfo.value;
    const rInfo = rMap?.[nInfo.id];
    const token = storage.get(CACHE_KEY_TOKEN);
    respond(deepClone({ ...nInfo, ...rInfo, token: token }));
  });
  messenger.instance.on('preview-hit-item', (hits, respond) => {
    const result = [];
    const kinds = gameKindFilter.value ?? [];
    kinds.forEach((kind) => {
      if (hits.includes(kind.card_pattern)) {
        result.push({ id: kind.id, name: $ti(kind.name) });
      }
    });
    respond(deepClone(result));
  });
  messenger.instance.on('use-hit-item', (hits, respond) => {
    if (!hits) return;
    eventManager.emit(EVENTS_SCENE_AI_SCAN_SET, hits);
    messenger.instance.send('clear-scan-poker');
    close();
    respond(true);
  });
  messenger.instance.on('save-hit-area', async (data, respond) => {
    if (!data) return layer.msgError($t('components.gv_video_camera_design.tips_error_point'));
    const params = deepClone(bindInfo.value);
    params.AREA_POINTS = deepClone(data);
    console.log(params, '--------------------------1');
    layer.loading();
    await financeTableBindCamera({ id: tableInfo.value.id, camera_info: JSON.stringify(params) });
    layer.closeLoading();
    layer.msgSuccess($t('common.save_success'));
    respond(true);
  });
  messenger.instance.on('send-point-map', (data) => {
    iframePointInfo.value = data;
  });
});

onBeforeUnmount(() => {
  if (!!messenger.instance?.destroy) {
    messenger.instance?.destroy();
    messenger.instance = null;
  }
});

defineExpose({ show, close });
</script>

<style lang="scss"></style>
<style scoped lang="scss">
.scan-card {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--el-overlay-color-lighter);
  z-index: var(--gv-popup-z-index);

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1000px;
    height: 700px;
    padding-top: 40px;
    border-radius: var(--gv-border-radius-mid);
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
    transform: translate(-50%, -50%);
    overflow: hidden;
    z-index: 10;

    .iframe {
      width: 1000px;
      height: 640px;
      border: none;
    }
  }

  .button-wrap {
    height: 100px;
  }

  .title {
    position: absolute;
    top: 0;
    left: 0;
  }

  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    color: var(--el-text-color-secondary);

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }
}
</style>
