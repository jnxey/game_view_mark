<template>
  <div class="dialog">
    <div class="dialog__trigger" @click="open">
      <!-- 触发弹窗 -->
      <slot name="trigger"></slot>
    </div>
    <el-dialog
      ref="modalRef"
      :id="popupId"
      v-model="visible"
      class="popup-dialog"
      :class="customClass"
      :center="center"
      :append-to-body="true"
      :modal="modal"
      :width="width"
      :draggable="draggable"
      :close-on-click-modal="clickModalClose"
      :fullscreen="fullscreen"
      :z-index="zIndex"
      :modal-class="!!transform ? 'modal-no-click' : ''"
      @closed="close"
      @pointerdown="pointerdown"
    >
      <!-- 弹窗内容 -->
      <template v-if="title" #header>{{ title }}</template>

      <!-- 自定义内容 -->
      <el-scrollbar :max-height="fullscreen ? 'calc(100vh - 120px)' : maxHeight">
        <slot>{{ content }}</slot>
      </el-scrollbar>
      <!-- 底部弹窗页脚 -->
      <template #footer v-if="showFooter">
        <template v-if="!!$slots.footer">
          <div class="dialog-footer">
            <slot name="footer"></slot>
          </div>
        </template>
        <template v-else>
          <div class="dialog-footer">
            <el-button v-if="cancelButtonText" @click="handleEvent('cancel')" size="large" round>
              {{ cancelButtonText }}
            </el-button>
            <el-button v-if="confirmButtonText" type="primary" @click="handleEvent('confirm')" size="large" round>
              {{ confirmButtonText }}
            </el-button>
          </div>
        </template>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default { name: 'gv-popup' };
</script>
<script setup>
import { nextTick, provide, ref, shallowRef, watch } from 'vue';
import { delayExec, generateUUID } from '@/tools';
import { $t } from '@/lang/i18n';
import { useFormListener } from '@/components/gv-popup/_hooks/form-listener';

const popupId = generateUUID();

const props = defineProps({
  // 弹窗标题
  title: { type: String, default: '' },
  // 弹窗内容
  content: { type: String, default: '' },
  // 确认按钮内容
  confirmButtonText: { type: [String, Boolean], default: $t('common.confirm_btn') },
  // 取消按钮内容
  cancelButtonText: { type: [String, Boolean], default: $t('common.cancel') },
  // 弹窗的宽度
  width: { type: String, default: '400px' },
  // 是否禁用
  disabled: { type: Boolean, default: false },
  // 是否开启异步关闭
  async: { type: Boolean, default: false },
  // 点击遮罩层关闭对话窗口
  clickModalClose: { type: Boolean, default: false },
  // 是否居中布局
  center: { type: Boolean, default: false },
  // 自定义class
  customClass: { type: String, default: '' },
  // 弹窗的最大高度
  maxHeight: { type: String, default: 'calc(70vh - 100px)' },
  // 是否可拖动
  draggable: { type: Boolean, default: true },
  // 是否是全屏
  fullscreen: { type: Boolean, default: false },
  // 是否需要遮罩层
  modal: { type: Boolean, default: true },
  // 弹窗偏移量
  transform: { type: Object },
  // 是否显示底部
  showFooter: { type: Boolean, default: true },
  // 显示时是否获取焦点
  autoFocus: { type: Boolean, default: false },
  // 监听表单是否编辑
  formListener: { type: Boolean, default: false },
  // 弹窗层级
  zIndex: Number
});

const emits = defineEmits(['confirm', 'cancel', 'close', 'open', 'pointerdown']);

const modalRef = shallowRef();
const visible = ref(false);

const formListener = useFormListener(popupId);

const handleEvent = (type) => {
  emits(type);
  if (type === 'cancel') close();
};

const close = () => {
  visible.value = false;
  nextTick(() => emits('close'));
  if (props.formListener) formListener.removeListener();
};
const open = async () => {
  if (props.disabled) return;
  emits('open');
  visible.value = true;
  triggeredHeaderMove();
  if (props.autoFocus) getFocus();
  if (props.formListener) formListener.addListener();
};

// 获取焦点
const getFocus = async () => {
  await delayExec(400);
  const wrap = document.getElementById(popupId);
  const input = wrap.querySelector('input');
  if (!!input) {
    input.focus();
  }
};

// 手动触发header移动事件
const triggeredHeaderMove = async () => {
  if (!props.transform) return;
  await nextTick();
  const wrap = document.getElementById(popupId);
  const headerDom = wrap?.querySelector('.el-dialog__header');
  if (!headerDom || !props.transform) return;
  modalRef.value?.resetPosition();
  await nextTick();
  const rect = headerDom.getBoundingClientRect();
  const event = { bubbles: true, cancelable: true, clientX: rect.x, clientY: rect.y };
  const downEvent = new MouseEvent('mousedown', { ...event });
  const moveEvent = new MouseEvent('mousemove', { ...event, clientX: rect.x + props.transform.x, clientY: rect.y + props.transform.y });
  const upEvent = new MouseEvent('mouseup', { ...event });
  headerDom.dispatchEvent(downEvent);
  headerDom.dispatchEvent(moveEvent);
  headerDom.dispatchEvent(upEvent);
};

const pointerdown = (e) => {
  emits('pointerdown', e);
};

watch(
  () => props.zIndex,
  async (value) => {
    await nextTick();
    const dialog = document.getElementById(popupId);
    const mask = dialog?.parentNode?.parentNode;
    if (!mask) return;
    mask.style.zIndex = value;
  }
);

provide('visible', visible);

defineExpose({ open, close });
</script>
<style lang="scss">
.modal-no-click {
  pointer-events: none;
  .el-dialog {
    pointer-events: auto;
  }
}
.el-dialog.popup-dialog {
  &.near-top {
    --el-dialog-margin-top: 5vh;
  }
}
</style>
