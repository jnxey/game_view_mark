<template>
  <div v-if="isShow" class="message-new-bottom cursor-pointer text-primary fz-12" @click="viewNew">
    {{ $t('layout.chat_new_message_bottom') }}
  </div>
</template>
<script setup>
import { $t } from '@/lang/i18n';
import { ref } from 'vue';

const emits = defineEmits(['viewNew']);

const isShow = ref(false);

const viewNew = () => {
  emits('viewNew');
  close();
};

const show = () => {
  isShow.value = true;
};

const close = () => {
  isShow.value = false;
};

defineExpose({ show, close });
</script>
<style scoped lang="scss">
.message-new-bottom {
  position: absolute;
  top: 50%;
  right: 0;
  padding: 10px;
  user-select: none;
  border-radius: 15px 0 0 15px;
  background-color: var(--el-bg-color);
  box-shadow: var(--gv-box-shadow-bottom);
  z-index: 20;
}
</style>
