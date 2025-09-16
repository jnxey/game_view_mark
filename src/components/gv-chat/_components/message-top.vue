<template>
  <div class="message-top" :class="{ full: !!isFold }">
    <!--  simple  -->
    <div v-if="!isFold" class="simple h-full flex-row align-top">
      <div class="title fz-12 fw-bold text-primary">{{ $t('layout.chat_top_title') }}</div>
      <!--      -->
      <div class="chat-content fz-12 text-placeholder flex-1 flex-w0 ml-8">
        <template v-if="message.message_type === 'text'">
          <div v-safe-html="message.content" />
        </template>
        <template v-if="message.message_type === 'image'">[IMAGE]</template>
        <template v-if="message.message_type === 'file'">
          <template v-for="(url, index) in message.file_info" :key="index">{{ useFileInfo(url).name }}</template>
          <template v-if="!message.file_info?.length">[No Image]</template>
        </template>
      </div>
    </div>
    <!--  full  -->
    <div v-if="!!isFold" class="content">
      <el-scrollbar max-height="42vh">
        <div class="title fz-14 fw-bold text-primary">{{ $t('layout.chat_top_title') }}</div>
        <!--      -->
        <div class="chat-content fz-14 text-placeholder">
          <template v-if="message.message_type === 'text'">
            <div class="flex-row align-center flex-wrap" v-safe-html="message.content" />
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
                <div class="file-name flex-1 fw-bold fz-18">
                  <div class="fz-18 mb-8 text-main">{{ useFileInfo(url).name }}</div>
                  <div class="fz-14 text-placeholder">{{ useFileInfo(url).size }}KB</div>
                </div>
              </div>
            </template>
            <div v-if="!message.file_info?.length" class="fz-12 text-placeholder">[No File]</div>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <!--  cancel btn  -->
    <div v-if="!!isFold && checkPerm([permsMap.layout.chat_top_cancel])" class="cancel-btn link" @click="cancel">
      {{ $t('layout.chat_top_cancel') }}
    </div>
    <!--  change btn  -->
    <div class="change-btn cursor-pointer" @click="toggle">
      <gv-icon v-if="!isFold" class="fz-20 text-primary" name="el-icon-arrow-down" />
      <gv-icon v-else class="fz-20 text-primary" name="el-icon-arrow-up" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import GvIcon from '@/components/gv-icon/index.vue';
import { getBaseImagUrl, getJSON } from '@/tools';
import { imagePreviewOpen } from '@/store/image-viewer';
import { $t } from '@/lang/i18n';
import layer from '@/tools/layer';
import { toolsChatPinnedMessage, toolsChatUnpinnedMessage } from '@/api/common';
import { synChatTopMessage } from '@/store/chat';
import { checkPerm } from '@/directives/perms';
import { permsMap } from '@/api/perms';
import { useFileInfo } from '../_hook/file-info';

const props = defineProps({ message: Object });

const isFold = ref(false);

const toggle = () => {
  isFold.value = !isFold.value;
};

// 预览图片
const showPreviewImage = (str) => {
  if (!str) return;
  const list = getJSON(str, null);
  const previews = !!list ? list : [str];
  imagePreviewOpen(previews.map((val) => getBaseImagUrl(val)));
};

// 取消置顶
const cancel = async () => {
  await layer.confirm($t('layout.chat_top_cancel_tips'));
  layer.loading();
  const params = { message_id: props.message.id };
  await toolsChatUnpinnedMessage(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.operate_success'));
  synChatTopMessage();
};
</script>
<style scoped lang="scss">
.message-top {
  position: absolute;
  top: 40px;
  left: 20px;
  right: 20px;
  height: 40px;
  border-radius: var(--gv-border-radius-mid);
  background-color: var(--el-bg-color);
  box-shadow: var(--gv-box-shadow-bottom);
  z-index: 10;

  &.full {
    height: fit-content;
  }

  .simple {
    padding: 0 40px 0 10px;
    line-height: 40px;
    overflow: hidden;
  }

  .content {
    padding: 10px;
    line-height: 32px;

    .message-image {
      width: 100%;
      height: fit-content;
    }

    .message-file {
      .file-icon {
        width: 42px;
        height: 42px;
      }
    }
  }

  .chat-content {
    ::v-deep(img) {
      width: 14px;
      height: 14px;
    }
  }

  .cancel-btn {
    position: absolute;
    top: 0;
    right: 40px;
    padding: 10px;
    line-height: 20px;
    user-select: none;
    z-index: 10;
  }

  .change-btn {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    user-select: none;
    z-index: 10;
  }
}
</style>
