<template>
  <teleport to="#app">
    <transition name="fade">
      <div v-if="isVisible" class="gv-video-recorder-connection">
        <div class="container">
          <iframe
            v-if="checkMode === modeValue.checking"
            ref="iframeRef"
            class="check-iframe"
            :src="`/video-recorder/index.html?mode=hk_connection&lang=${languageCurrent}`"
          />
          <div class="check-result flex-row align-center justify-center">
            <span v-if="checkMode === modeValue.success" class="text-success">
              {{ $t('components.gv_video_recorder_connection.tips_check_success') }}
            </span>
            <span v-if="checkMode === modeValue.fail" class="text-danger">
              {{ $t('components.gv_video_recorder_connection.tips_check_fail') }}
            </span>
          </div>
          <!--  title -->
          <div class="title p-8 cursor-pointer fz-18 fw-bold">
            {{ $t('components.gv_video_recorder_connection.title') }}
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
export default { name: 'gv-video-recorder-connection' };
</script>
<script setup>
import { ref, onMounted, shallowRef, nextTick } from 'vue';
import { $t } from '@/lang/i18n';
import GvIcon from '@/components/gv-icon/index.vue';
import { deepClone, delayExec } from '@/tools';
import { IframeCommunicator } from '@/tools/iframe-communicator';
import { languageCurrent } from '@/lang';

const props = defineProps({ checkInfo: Object });

const modeValue = { checking: 1, success: 2, fail: 3 };

const isVisible = ref(false);
const iframeRef = shallowRef();
const messenger = { instance: null };
const checkMode = ref(modeValue.checking);

// 对外暴露的显示方法
const show = async () => {
  checkMode.value = modeValue.checking;
  isVisible.value = true;
  await nextTick();
  messenger.instance = new IframeCommunicator({
    targetWindow: iframeRef.value.contentWindow
  });
  messenger.instance.on('recorder-info', (_, respond) => {
    respond(deepClone({ ...props.checkInfo }));
  });
  messenger.instance.on('recorder-connection-success', () => {
    checkMode.value = modeValue.success;
  });
  messenger.instance.on('recorder-connection-fail', () => {
    checkMode.value = modeValue.fail;
  });
};

// 关闭处理
const close = () => {
  if (!!messenger.instance?.destroy) {
    messenger.instance?.destroy();
    messenger.instance = null;
  }
  isVisible.value = false;
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
  z-index: var(--gv-command-z-index);

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 230px;
    padding-top: 30px;
    border-radius: var(--gv-border-radius-mid);
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
    transform: translate(-50%, -50%);
    overflow: hidden;
    z-index: 10;

    .check-iframe {
      width: 300px;
      height: 200px;
      border: none;
    }

    .check-result {
      width: 300px;
      height: 200px;
    }
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
