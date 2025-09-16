<template>
  <teleport to="#app">
    <transition name="fade">
      <!-- 聊天容器 -->
      <div v-if="isVisible" class="chat-wrap">
        <div class="chat-container flex-col">
          <!--  置顶消息  -->
          <message-top v-if="!!storeChatTopMessage" :message="storeChatTopMessage" />
          <!-- 消息展示区域 -->
          <div class="chat-messages flex-1">
            <el-scrollbar ref="scrollbarRef" class="h-full" @scroll="handlerScroll">
              <div class="h-40 flex-row align-center justify-center fz-12 text-placeholder">
                <template v-if="!storeChatList.length">
                  {{ $t('layout.chat_no_data') }}
                </template>
                <template v-if="!!storeChatLoading">
                  {{ $t('common.loading') }}
                </template>
              </div>
              <div class="chat-list">
                <template v-for="message in storeChatList" :key="message.id">
                  <message-item :message="message" @right-click="rightClick" />
                </template>
              </div>
            </el-scrollbar>
          </div>
          <!-- 输入区域 -->
          <div v-perms="[permsMap.layout.chat_send]" class="input-container p-16">
            <message-input class="w-full" :quote="quoteValue" @close-quote="handlerQuoteClear" />
            <message-quote v-if="!!quoteValue" :message="quoteValue" @close-quote="handlerQuoteClear" />
          </div>
          <!--  title -->
          <div class="title p-8 cursor-pointer fz-16 fw-bold">
            {{ $t('layout.chat_name') }}
          </div>
          <!--  关闭按钮 -->
          <div class="close-icon p-4 cursor-pointer" @click="close">
            <gv-icon class="fz-24" name="el-icon-circle-close-filled" />
          </div>
          <!--   滚动到底部 -->
          <message-new-bottom ref="messageNewBottomRef" @view-new="() => scrollToBottom()" />
        </div>
      </div>
    </transition>
  </teleport>
  <gv-command ref="commandRef">
    <div v-perms="[permsMap.layout.chat_top]" class="command-item" @click="handlerTop">{{ $t('common.top_btn') }}</div>
    <div v-if="commandMessage.message_type === 'text'" class="command-item" @click="handlerCopy">{{ $t('common.copy_btn') }}</div>
    <div v-if="commandMessage.message_type === 'image' || commandMessage.message_type === 'file'" class="command-item" @click="handlerDownload">
      {{ $t('common.download_btn') }}
    </div>
    <div class="command-item" @click="handlerQuote">{{ $t('common.quote_btn') }}</div>
    <div v-if="commandMessage.user_id === currentUserId" class="command-item" @click="handlerDelete">{{ $t('common.del_btn') }}</div>
  </gv-command>
</template>
<script>
export default { name: 'gv-chat' };
</script>
<script setup>
import { ref, onMounted, onBeforeUnmount, shallowRef, computed, unref } from 'vue';
import { delSomeChat, storeChatList, storeChatLoading, storeChatTopMessage, synChatTopMessage } from '@/store/chat';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';
import eventManager from '@/tools/event-manager';
import { EVENTS_CHAT_NEW_MESSAGE } from '@/values/events';
import { useChatScroll } from '@/components/gv-chat/_hook/chat-scroll';
import MessageInput from '@/components/gv-chat/_components/message-input.vue';
import MessageItem from '@/components/gv-chat/_components/message-item.vue';
import GvCommand from '@/components/gv-command/index.vue';
import { managerState } from '@/store/manager';
import { copyText, getFilenameByUrl } from '@/tools';
import layer from '@/tools/layer';
import FileSaver from '@/tools/fileSaver';
import { toolsChatDeleteMessage, toolsChatPinnedMessage } from '@/api/common';
import MessageQuote from '@/components/gv-chat/_components/message-quote.vue';
import MessageTop from '@/components/gv-chat/_components/message-top.vue';
import { permsMap } from '@/api/perms';
import MessageNewBottom from '@/components/gv-chat/_components/message-new-bottom.vue';

const scrollbarRef = shallowRef();
const commandRef = shallowRef();
const isVisible = ref(false);
const commandMessage = shallowRef();
const quoteValue = shallowRef(null);
const messageNewBottomRef = shallowRef();

const currentUserId = computed(() => managerState.user?.id);

const { handlerScroll, scrollToBottom, canNewMessageScroll } = useChatScroll(
  () => scrollbarRef.value,
  () => closeNewBottom()
);

// 对外暴露的显示方法
const show = () => {
  isVisible.value = true;
  scrollToBottom(false);
  synChatTopMessage();
};

// 关闭处理
const close = () => {
  isVisible.value = false;
};

// 获取弹窗是否打开
const getIsShow = () => {
  return isVisible.value;
};

// 右击显示命令行
const rightClick = ({ event, message }) => {
  commandMessage.value = message;
  commandRef.value.open(event);
};

// 置顶
const handlerTop = async () => {
  const params = { message_id: commandMessage.value.id };
  layer.loading();
  await toolsChatPinnedMessage(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.operate_success'));
  commandRef.value?.close();
};

// 复制
const handlerCopy = () => {
  copyText(commandMessage.value.content);
  layer.msgSuccess($t('common.copy_success'));
  commandRef.value?.close();
};

// 下载
const handlerDownload = () => {
  const fileURL = commandMessage.value.file_info[0];
  if (!fileURL) return;
  FileSaver.saveAs(fileURL, getFilenameByUrl(fileURL));
  commandRef.value?.close();
};

// 引用
const handlerQuote = () => {
  quoteValue.value = unref(commandMessage);
  commandRef.value?.close();
};

// 清除引用
const handlerQuoteClear = () => {
  quoteValue.value = null;
};

// 删除
const handlerDelete = async () => {
  const params = { message_ids: commandMessage.value.id };
  await toolsChatDeleteMessage(params);
  layer.msgSuccess($t('common.del_success'));
  delSomeChat(commandMessage.value.id);
  commandRef.value?.close();
};

// 有新消息，滚动到底部
const handlerMessageScroll = () => {
  const can = canNewMessageScroll();
  if (can === null) return;
  if (can) {
    scrollToBottom();
  } else {
    messageNewBottomRef.value?.show();
  }
};

// 关闭查看新消息
const closeNewBottom = () => {
  messageNewBottomRef.value?.close();
};

onMounted(() => {
  eventManager.on(EVENTS_CHAT_NEW_MESSAGE, handlerMessageScroll);
});

onBeforeUnmount(() => {
  eventManager.off(EVENTS_CHAT_NEW_MESSAGE, handlerMessageScroll);
});

defineExpose({ show, close, getIsShow });
</script>

<style lang="scss">
@use './_styles/index.scss';
</style>
<style scoped lang="scss">
.chat-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--el-overlay-color-lighter);
  z-index: var(--gv-popup-z-index);

  .chat-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90vw;
    max-width: 800px;
    height: 90vh;
    max-height: 700px;
    border-radius: var(--gv-border-radius-mid);
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
    transform: translate(-50%, -50%);
    overflow: hidden;
    z-index: 10;
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
    }
  }

  .chat-messages {
    padding: 40px 0 10px;
    background-color: var(--el-fill-color);
    overflow: hidden;

    .chat-list {
      display: flex;
      flex-direction: column-reverse;
      padding: 0 20px;
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
