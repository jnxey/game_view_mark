<template>
  <teleport to="#app">
    <transition name="fade">
      <div v-if="isVisible" class="gv-video-recorder-connection">
        <div class="container">
          <!--          -->
          <recorders v-show="!currentRecorders" @set-current="setCurrentRecorders" />
          <!--          -->
          <cameras v-if="!!currentRecorders" ref="camerasRef" :recorder="currentRecorders" />
          <div class="button-wrap flex-row align-center justify-end pr-16">
            <template v-if="!!nowBindInfo">
              <el-button type="danger" size="large" @click="handleUnbindCamera">{{ $t('components.gv_video_recorder_select.unbind') }}</el-button>
            </template>
            <template v-if="!!currentRecorders">
              <el-button size="large" @click="backSelectRecorders">{{ $t('components.gv_video_recorder_select.select_recorder') }}</el-button>
              <el-button type="primary" size="large" @click="handleConfirmBind">
                {{ $t('components.gv_video_recorder_select.confirm_bind') }}
              </el-button>
            </template>
          </div>
          <!--  title -->
          <div class="title p-8 cursor-pointer fz-18 fw-bold">
            {{ $t('components.gv_video_recorder_select.title') }}
          </div>
          <!--  关闭按钮 -->
          <div class="close-icon p-8 cursor-pointer" @click="close">
            <gv-icon class="fz-24" name="el-icon-close" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script>
export default { name: 'gv-video-recorder-select' };
</script>
<script setup>
import { ref, onMounted, computed, shallowRef, nextTick } from 'vue';
import { $t } from '@/lang/i18n';
import GvIcon from '@/components/gv-icon/index.vue';
import Recorders from '@/components/gv-video-recorder-select/_components/recorders.vue';
import Cameras from '@/components/gv-video-recorder-select/_components/cameras.vue';
import { deepClone, getJSON, mappingArrayToObject } from '@/tools';
import layer from '@/tools/layer';
import { financeTableBindCamera, financeTableUnbindDevice } from '@/api/finance/table';
import { getDefPoints } from '@/components/gv-video-recorder-select/_models';
import { useDictOptions } from '@/hooks/dict';
import { financeCameraLists } from '@/api/finance/video-recorder';

const emits = defineEmits(['bind', 'unbind']);

const props = defineProps({ checkInfo: Object });

const isVisible = ref(false);
const currentRecorders = ref(null);
const currentCamera = ref(null);
const tableInfo = ref(null);
const camerasRef = shallowRef();

const nowBindInfo = computed(() => getJSON(tableInfo.value?.camera_info, null));
const { optionsData, refresh } = useDictOptions({ recorders: { api: financeCameraLists } }, true);
const recordersMap = computed(() => mappingArrayToObject(optionsData.recorders ?? []));

// 对外暴露的显示方法
const show = async (row) => {
  tableInfo.value = { ...row };
  await refresh();
  await nextTick();
  const rMap = recordersMap.value;
  if (!!nowBindInfo.value) {
    const nInfo = nowBindInfo.value;
    const rInfo = rMap?.[nInfo.id];
    currentRecorders.value = { ...nInfo, ...rInfo };
    currentCamera.value = { ...nInfo, ...rInfo };
  } else {
    backSelectRecorders();
  }
  isVisible.value = true;
};

// 关闭处理
const close = () => {
  isVisible.value = false;
};

// 回到选择录像机
const backSelectRecorders = () => {
  currentRecorders.value = null;
  currentCamera.value = null;
};

// 选择当前的录像机
const setCurrentRecorders = (info) => {
  currentRecorders.value = { ...info };
  currentCamera.value = null;
};

// 解绑当前摄像头
const handleUnbindCamera = async () => {
  const info = tableInfo.value ?? {};
  await layer.confirm($t('components.gv_video_recorder_select.confirm_unbind'));
  layer.loading();
  await financeTableBindCamera({ id: info.id, camera_info: '' });
  layer.closeLoading();
  layer.msgSuccess($t('components.gv_video_recorder_select.tips_unbind_success'));
  close();
  emits('unbind');
};

// 确认绑定
const handleConfirmBind = async () => {
  const info = tableInfo.value ?? {};
  const current = camerasRef.value?.getCurrentSelect();
  if (!current) return layer.msgError($t('components.gv_video_recorder_select.tips_no_camera'));
  await layer.confirm($t('components.gv_video_recorder_select.tips_confirm_bind'));
  const params = { ...currentRecorders.value, ...current, table_id: info.id, game_model: info.game_model };
  const modelChange = params.game_model !== nowBindInfo.value?.game_model;
  if (!params.AREA_POINTS || modelChange) {
    params.AREA_POINTS = getDefPoints(info?.game_model);
  } else {
    params.AREA_POINTS = deepClone(nowBindInfo.value.AREA_POINTS);
  }
  layer.loading();
  await financeTableBindCamera({ id: info.id, camera_info: JSON.stringify(params) });
  layer.closeLoading();
  layer.msgSuccess($t('components.gv_video_recorder_select.tips_bind_success'));
  close();
  emits('bind');
};

onMounted(() => {});

defineExpose({ show, close });
</script>

<style lang="scss"></style>
<style scoped lang="scss">
.gv-video-recorder-connection {
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
