import { nextTick } from 'vue';
import { delayExec, smoothScrollTo } from '@/tools';
import { loadMoreChat, storeChatHasMore, storeChatLoading } from '@/store/chat';

// 广播室滚动条处理
export function useChatScroll(getScrollBar, scrollBottom) {
  // 滚动到底部
  const scrollToBottom = async (animate = true) => {
    await delayExec(34);
    const scrollBar = getScrollBar();
    if (!scrollBar) return;
    const wrapRef = scrollBar.wrapRef;
    const from = wrapRef.scrollTop;
    const to = wrapRef.scrollHeight - wrapRef.clientHeight;
    if (animate) {
      smoothScrollTo((value) => scrollBar.setScrollTop(value), from, to);
    } else {
      scrollBar.setScrollTop(to);
    }
  };

  // 监听滚动
  const handlerScroll = async (e) => {
    const scrollBar = getScrollBar();
    if (!scrollBar) return;
    const distance = 20;
    const wrapRef = scrollBar.wrapRef;
    const scrollHeightBefore = wrapRef.scrollHeight;
    if (e.scrollTop < distance && !!storeChatHasMore.value && !storeChatLoading.value) {
      await loadMoreChat();
      await nextTick();
      scrollBar.setScrollTop(wrapRef.scrollHeight - scrollHeightBefore);
    }

    const bottom = wrapRef.scrollHeight - wrapRef.clientHeight;
    const current = wrapRef.scrollTop;
    if (Math.abs(bottom - current) < 2 && !!scrollBottom) scrollBottom();
  };

  // 有新消息，尝试滚动到底部
  const canNewMessageScroll = () => {
    const scrollBar = getScrollBar();
    if (!scrollBar) return null;
    const distance = 50;
    const wrapRef = scrollBar.wrapRef;
    const current = wrapRef.scrollTop;
    const bottom = wrapRef.scrollHeight - wrapRef.clientHeight;
    return Math.abs(bottom - current) <= distance;
  };

  return { handlerScroll, scrollToBottom, canNewMessageScroll };
}
