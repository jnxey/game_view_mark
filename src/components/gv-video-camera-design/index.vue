<template>
  <teleport to="#app">
    <transition name="fade">
      <div v-if="isVisible" class="gv-video-camera-design">
        <div class="container">
          <design v-if="!!nowBindInfo" ref="designRef" :recorder="nowBindInfo" @save-success="saveSuccess" />
          <div class="button-wrap flex-row align-center justify-end pr-16">
            <el-button size="large" @click="close">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" size="large" @click="handlerSave">
              {{ $t('common.save_btn') }}
            </el-button>
          </div>
          <!--  title -->
          <div class="title p-8 cursor-pointer fz-18 fw-bold">
            {{ $t('components.gv_video_camera_design.title') }}
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
export default { name: 'gv-video-camera-design' };
</script>
<script setup>
import { ref, onMounted, computed, nextTick, shallowRef } from 'vue';
import { $t } from '@/lang/i18n';
import GvIcon from '@/components/gv-icon/index.vue';
import { getJSON, mappingArrayToObject } from '@/tools';
import Design from '@/components/gv-video-camera-design/_components/design.vue';
import { useDictOptions } from '@/hooks/dict';
import { financeCameraLists } from '@/api/finance/video-recorder';

const props = defineProps({ tableId: Number, checkInfo: Object });

const emits = defineEmits(['saveSuccess']);

const isVisible = ref(false);
const tableInfo = ref(null);
const designRef = shallowRef();
const { optionsData, refresh } = useDictOptions({ recorders: { api: financeCameraLists } }, true);
const recordersMap = computed(() => mappingArrayToObject(optionsData.recorders ?? []));

const nowBindInfo = computed(() => {
  const nInfo = getJSON(tableInfo.value?.camera_info, null);
  if (!!nInfo) {
    const rMap = recordersMap.value;
    const rInfo = rMap?.[nInfo.id];
    return { ...nInfo, ...rInfo };
  } else {
    return nInfo;
  }
});

// 对外暴露的显示方法
const show = async (row) => {
  await refresh();
  tableInfo.value = { ...row };
  isVisible.value = true;
};

// 关闭处理
const close = () => {
  isVisible.value = false;
};

// 保存成功
const saveSuccess = () => {
  close();
  emits('saveSuccess');
};

// 保存
const handlerSave = () => {
  designRef.value?.saveCurrentPoint(tableInfo.value?.id, { ...nowBindInfo.value });
};

onMounted(() => {});

defineExpose({ show, close });
</script>

<style lang="scss"></style>
<style scoped lang="scss">
.gv-video-camera-design {
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
