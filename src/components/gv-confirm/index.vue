<template>
  <!-- 遮罩层 -->
  <transition name="fade">
    <div v-if="isVisible" class="gv-confirm-mask" @click="close"></div>
  </transition>

  <!-- 弹窗内容 -->
  <transition name="slide">
    <div v-if="isVisible" class="gv-confirm-wrap">
      <!-- 标题 -->
      <div v-if="title" class="gv-confirm-title p-16 text-center text-main fz-24 fw-bold">
        {{ title }}
      </div>
      <!-- 内容 -->
      <div class="gv-confirm-content flex-row align-center justify-center p-16">
        <svg
          v-if="type === 'warning'"
          class="text-warning mr-8"
          viewBox="0 0 1026 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
        >
          <path
            fill="currentColor"
            d="M1004.657 801.716 602.263 91.599c-49.213-86.817-129.646-86.817-178.866 0L21.004 801.716c-49.207 86.906-8.949 157.798 89.388 157.798l804.877 0C1013.606 959.514 1053.825 888.622 1004.657 801.716zM544.635 832.216l-63.649 0 0-63.649 63.649 0L544.635 832.216zM544.635 641.27l-63.649 0L480.986 259.377l63.649 0L544.635 641.27z"
          ></path>
        </svg>
        <span class="text-main fz-18">{{ content }}</span>
      </div>
      <!-- 按钮组 -->
      <div class="gv-confirm-footer flex-row justify-center p-16">
        <button class="gvc-button cancel" v-if="!!cancelText" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="gvc-button confirm" :class="{ 'ml-16': !!cancelText }" v-if="!!confirmText" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { $t } from '@/lang/i18n';
import { delayExec } from '@/tools';

const props = defineProps({
  title: { type: String, default: $t('other.func.layer_title_tips') },
  type: { type: String, default: 'warning' },
  content: { type: String },
  cancelText: { type: String, default: $t('common.cancel') },
  confirmText: { type: String, default: $t('common.confirm_btn') },
  onCancel: Function,
  onConfirm: Function,
  onClose: Function
});

const isVisible = ref(false);

// 对外暴露的显示方法
const show = () => {
  isVisible.value = true;
};

// 关闭处理
const close = () => {
  isVisible.value = false;
  props.onClose();
};

// 取消处理
const handleCancel = () => {
  props.onCancel();
  close();
};

// 确认处理
const handleConfirm = () => {
  props.onConfirm();
  close();
};

onMounted(async () => {
  await delayExec(100);
  show();
});

// 暴露方法给父组件
defineExpose({ show });
</script>

<style scoped lang="scss">
.gv-confirm-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--el-overlay-color-lighter);
  z-index: 5;
}

.gv-confirm-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  max-width: 420px;
  padding: 16px 0;
  transform: translate(-50%, -70%);
  border-radius: var(--gv-border-radius-big);
  background-color: var(--el-color-white);
  z-index: 10;
}

.gvc-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  height: 56px;
  padding: 0 20px;
  user-select: none;
  letter-spacing: 2px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 18px;
  border-radius: 28px;

  &.cancel {
    color: var(--el-text-color-primary);
    background-color: var(--el-fill-color-darker);
    &:hover {
      background-color: var(--el-fill-color);
    }
  }

  &.confirm {
    color: var(--el-primary-text-color);
    background-color: var(--el-color-primary);
    &:hover {
      background-color: var(--el-color-primary-dark-2);
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s linear;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -80%);
}
</style>
