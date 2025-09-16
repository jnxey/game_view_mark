import { reactive, ref } from 'vue';
import { toolsChatGetHistory, toolsChatGetPinnedMessage } from '@/api/common';
import { checkIndexArray, getArrayLastKey, toAwait, isObject } from '@/tools';
import { managerState } from '@/store/manager';

export const storeChatList = reactive([]);
export const storeChatHasMore = ref(false);
export const storeChatLoading = ref(false);
export const storeChatTopMessage = ref(null);

// 同步聊天列表
export const syncChatList = async () => {
  if (!managerState.user) return;
  if (storeChatLoading.value) return;
  storeChatLoading.value = true;
  const [res] = await toAwait(toolsChatGetHistory({ page_no: 1, page_size: 20 }));
  storeChatLoading.value = false;
  if (!res) return;
  storeChatList.splice(0);
  storeChatList.push(...res.messages);
  storeChatHasMore.value = res.has_more;
};

// 同步置顶消息
export const synChatTopMessage = async () => {
  if (!managerState.user) return;
  const res = await toolsChatGetPinnedMessage();
  storeChatTopMessage.value = isObject(res) ? res : null;
};

// 加载更多聊天记录
export const loadMoreChat = async () => {
  if (storeChatLoading.value) return;
  const lastKey = getArrayLastKey(storeChatList);
  const lastId = storeChatList[lastKey]?.id;
  storeChatLoading.value = true;
  const [res] = await toAwait(toolsChatGetHistory({ page_no: 1, page_size: 20, last_message_id: lastId }));
  storeChatLoading.value = false;
  if (!res) return;
  storeChatList.push(...res.messages);
  storeChatHasMore.value = res.has_more;
};

// 删除某一条聊天记录
export const delSomeChat = async (id) => {
  const key = storeChatList.findIndex((val) => val.id === id);
  if (checkIndexArray(key)) storeChatList.splice(key, 1);
};

// 添加一条新的聊天记录
export const addNewChat = (data) => {
  storeChatList.unshift(data);
};
