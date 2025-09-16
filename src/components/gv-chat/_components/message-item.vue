<template>
  <div class="message" :class="{ 'user-message': message.user_id === currentUserId }" @click.right.prevent="rightClick">
    <div class="message-content">
      <div class="avatar">
        <el-avatar :src="getAlbumDef(message.avatar) || avatarImg" :size="40" />
      </div>
      <div class="message-value pl-8 pr-8">
        <div v-if="message.user_id !== currentUserId" class="name fz-12 mb-4">
          <span class="text-main">{{ message.account }}</span>
          <span v-if="message.account !== message.username" class="text-placeholder ml-4">- {{ message.username }}</span>
        </div>
        <template v-if="message.message_type === 'text'">
          <div class="message-bubble chat-text-box" v-safe-html="message.content"></div>
        </template>
        <template v-if="message.message_type === 'image'">
          <template v-for="(url, index) in message.file_info" :key="index">
            <img class="message-image cursor-pointer" alt="" :src="getBaseImagUrl(url)" @click="showPreviewImage(url)" />
          </template>
          <div v-if="!message.file_info?.length" class="pt-12 fz-12 text-placeholder">[No Image]</div>
        </template>
        <template v-if="message.message_type === 'file'">
          <template v-for="(url, index) in message.file_info" :key="index">
            <div class="message-file flex-row align-center">
              <div class="file-name flex-1">
                <div class="fz-18 mb-8 text-main">{{ useFileInfo(url).name }}</div>
                <div class="fz-14 text-placeholder">{{ useFileInfo(url).size }}KB</div>
              </div>
              <img class="file-icon ml-8" alt="" src="@/assets/images/common/file-fold.png" />
            </div>
          </template>
          <div v-if="!message.file_info?.length" class="pt-12 fz-12 text-placeholder">[No File]</div>
        </template>
      </div>
    </div>
    <div v-if="!!message.quote" class="message-quote flex-row">
      <message-item-quote :message="message.quote" />
    </div>
  </div>
</template>
<script setup>
import { getAlbumDef, getBaseImagUrl, getJSON } from '@/tools';
import avatarImg from '@/assets/images/layout/avatar.png';
import { computed, unref } from 'vue';
import { managerState } from '@/store/manager';
import MessageItemQuote from '@/components/gv-chat/_components/message-item-quote.vue';
import { imagePreviewOpen } from '@/store/image-viewer';
import { useFileInfo } from '@/components/gv-chat/_hook/file-info';

const emits = defineEmits(['rightClick']);

const props = defineProps({ message: Object });

const currentUserId = computed(() => managerState.user?.id);

const rightClick = (event) => {
  emits('rightClick', { event, message: unref(props.message) });
};

// 预览图片
const showPreviewImage = (str) => {
  if (!str) return;
  const list = getJSON(str, null);
  const previews = !!list ? list : [str];
  imagePreviewOpen(previews.map((val) => getBaseImagUrl(val)));
};
</script>
<style scoped lang="scss">
.message {
  margin-bottom: 15px;

  .message-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    .message-value {
      max-width: calc(100% - 80px);
    }

    .message-bubble {
      word-break: break-all;
      white-space: wrap;
      padding: 8px 15px;
      color: var(--el-text-color);
      border-radius: var(--gv-border-radius-mid);
      background-color: var(--el-bg-color);
    }

    .message-image {
      width: 200px;
    }

    .message-file {
      min-width: 200px;
      word-break: break-all;
      white-space: wrap;
      padding: 8px 15px;
      color: var(--el-text-color);
      border-radius: var(--gv-border-radius-mid);
      background-color: var(--el-bg-color);

      .file-icon {
        width: 42px;
        height: 42px;
      }
    }
  }

  .message-quote {
    width: 100%;
    padding: 10px 48px;
    justify-content: start;
  }

  &.user-message {
    .message-content {
      flex-direction: row-reverse;

      .message-bubble {
        background-color: var(--el-color-primary-light-7);
      }
    }

    .message-quote {
      justify-content: end;
    }
  }
}
</style>
