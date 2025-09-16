<template>
  <div class="message pt-16">
    <div class="message-content flex-row flex-wrap p-8">
      <!--      -->
      <div class="name fz-12 text-placeholder mr-4">{{ message.account }}:</div>
      <!--      -->
      <div class="content flex-1 flex-w0">
        <template v-if="message.message_type === 'text'">
          <span class="chat-content fz-12 text-placeholder flex-row align-center flex-wrap" v-safe-html="message.content" />
        </template>
        <template v-if="message.message_type === 'image'">
          <template v-for="(url, index) in message.file_info" :key="index">
            <img class="w-40" alt="" :src="getBaseImagUrl(url)" />
          </template>
          <span v-if="!message.file_info?.length" class="fz-12 text-placeholder">[No Image]</span>
        </template>
        <template v-if="message.message_type === 'file'">
          <template v-for="(url, index) in message.file_info" :key="index">
            <span class="fz-12 text-placeholder">{{ useFileInfo(url).name }}</span>
          </template>
          <div v-if="!message.file_info?.length" class="pt-12 fz-12 text-placeholder">[No File]</div>
        </template>
      </div>
      <!--      -->
      <gv-icon name="el-icon-close" class="cursor-pointer" @click="close" />
    </div>
  </div>
</template>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';
import { useFileInfo } from '../_hook/file-info';
import { getBaseImagUrl } from '@/tools';

const emits = defineEmits(['closeQuote']);

const props = defineProps({ message: Object });

const close = () => {
  emits('closeQuote');
};
</script>
<style scoped lang="scss">
.message {
  .message-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    background-color: var(--el-fill-color-dark);
    border-radius: var(--gv-border-radius-mid);
    .chat-content {
      ::v-deep(img) {
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>
