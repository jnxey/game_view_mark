<template>
  <el-tooltip :content="$t('layout.chat_name')" placement="bottom">
    <div class="header-item cursor-pointer" @click="openChat">
      <gv-icon name="local-icon-notice" />
    </div>
  </el-tooltip>
  <gv-chat ref="chatRef" />
</template>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';
import GvChat from '@/components/gv-chat/index.vue';
import { computed, h, shallowRef } from 'vue';
import { useWebsocket } from '@/hooks/websocket';
import { addNewChat, delSomeChat, synChatTopMessage } from '@/store/chat';
import { isObject } from '@vue/shared';
import eventManager from '@/tools/event-manager';
import { EVENTS_CHAT_NEW_MESSAGE } from '@/values/events';
import { ElNotification } from 'element-plus';
import { Message } from '@element-plus/icons-vue';
import { managerState } from '@/store/manager';
import { checkIndexArray, isString } from '@/tools';
const chatRef = shallowRef();

const currentMarkAccount = computed(() => `>@${managerState.user?.account}<`);

const openChat = () => {
  chatRef.value?.show();
};

const tipsNotice = () => {
  const isShow = chatRef.value?.getIsShow();
  if (!!isShow) return;
  const notice = ElNotification({
    title: $t('other.func.layer_title_tips'),
    duration: 0,
    icon: Message,
    message: h('p', null, [
      h('span', { class: 'mr-8' }, $t('layout.chat_new_message_tips')),
      h(
        'span',
        {
          class: 'link',
          onClick: () => {
            openChat();
            notice.close();
          }
        },
        $t('layout.chat_new_message_btn')
      )
    ])
  });
};

const wsRisk = { room: 'adminMinChat', action: 'new_message', top: 'message_pinned', del: 'message_delete' };
useWebsocket(wsRisk.room, (message) => {
  if (message.type === wsRisk.action && isObject(message.data)) {
    addNewChat({ ...message.data });
    eventManager.emit(EVENTS_CHAT_NEW_MESSAGE);
    if (isString(message.data.content)) {
      const key = message.data.content.indexOf(currentMarkAccount.value);
      if (checkIndexArray(key)) tipsNotice();
    }
  }
  if (message.type === wsRisk.top) {
    synChatTopMessage();
    tipsNotice();
  }
  if (message.type === wsRisk.del) {
    message.data.forEach((id) => {
      delSomeChat(Number(id));
    });
  }
});
</script>
<style scoped lang="scss">
@use '../_style/index.scss';
</style>
