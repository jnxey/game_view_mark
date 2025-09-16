import { CACHE_KEY_GV_TABLE_SCROLL_POSITION } from '@/values/cache';
import { debounce } from 'throttle-debounce';
import { session } from '@/tools/session';

export function useTableScroll(tableKey, getTableRef) {
  // 存储滚动位置
  const saveScrollPositionNative = (position) => {
    const cachePosition = session.get(CACHE_KEY_GV_TABLE_SCROLL_POSITION) ?? {};
    cachePosition[tableKey] = position;
    session.set(CACHE_KEY_GV_TABLE_SCROLL_POSITION, cachePosition);
  };

  // 恢复滚动位置
  const restoreScrollPosition = () => {
    const tableRef = getTableRef();
    const cachePosition = session.get(CACHE_KEY_GV_TABLE_SCROLL_POSITION) ?? {};
    if (!!tableRef) {
      tableRef.setScrollLeft(cachePosition[tableKey]?.scrollLeft ?? 0);
      tableRef.setScrollTop(cachePosition[tableKey]?.scrollTop ?? 0);
    }
  };

  // 滚动防抖
  const saveScrollPosition = debounce(300, saveScrollPositionNative);

  return { saveScrollPosition, restoreScrollPosition };
}
