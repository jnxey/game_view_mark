<template>
  <el-drawer v-model="visible" :title="title" :direction="direction" :size="size" :custom-class="customClass">
    <slot />
    <!-- 底部弹窗页脚 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="cancelButtonText" @click="handleEvent('cancel')">
          {{ cancelButtonText }}
        </el-button>
        <el-button v-if="confirmButtonText" type="primary" @click="handleEvent('confirm')">
          {{ confirmButtonText }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script>
export default { name: 'gv-drawer' };
</script>
<script setup>
import { nextTick, ref } from 'vue';
import { $t } from '@/lang/i18n';

const props = defineProps({
  // 弹窗标题
  title: { type: String, default: '' },
  // 弹窗的宽度
  size: { type: [String, Number], default: 400 },
  // 方向
  direction: String,
  // 自定义class
  customClass: { type: String, default: '' },
  // 确认按钮内容
  confirmButtonText: { type: [String, Boolean], default: $t('common.confirm_btn') },
  // 取消按钮内容
  cancelButtonText: { type: [String, Boolean], default: $t('common.cancel') },
  // 点击遮罩层关闭对话窗口
  clickModalClose: { type: Boolean, default: false }
});

const emits = defineEmits(['confirm', 'cancel', 'close', 'open']);

const visible = ref(false);

const handleEvent = (type) => {
  emits(type);
  if (type === 'cancel') close();
};

const open = async () => {
  visible.value = true;
  await nextTick();
  emits('open');
};

const close = async () => {
  visible.value = false;
  await nextTick();
  emits('close');
};

defineExpose({ visible, handleEvent, open, close });
</script>
