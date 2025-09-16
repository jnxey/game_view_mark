import { computed, nextTick, reactive, ref, watch } from 'vue';
import { getPX } from '@/tools';

// 使用虚拟滚动
export function useVirtual({ getData, getScroll, setWrapStyle }) {
  // 初始化过高度
  let isInitHeight = false;

  // 表格列表
  const tableList = computed(getData);

  // 表格实例
  const scrollRef = computed(getScroll);

  // 缓存高度
  const itemsHeight = ref(40);

  // 项的类名
  const itemClass = 'virtual-item';

  // 状态
  const state = reactive({ start: 0, end: 0 });

  // 表格内容高度
  const tableFullHeight = computed(() => {
    return tableList.value?.length * itemsHeight.value;
  });

  // 虚拟列表数据
  const virtualList = computed(() => tableList.value?.slice(state.start, state.end));

  // 每屏显示的数量
  const itemsEver = computed(() => {
    const height = scrollRef.value?.clientHeight ?? 0;
    const count = Math.ceil(height / itemsHeight.value) * 3;
    return Math.max(100, count);
  });

  // 滚动监听
  const scrollVirtual = () => {
    if (tableList.value.length <= itemsEver.value) {
      state.start = 0;
      state.end = tableList.value.length;
      if (setWrapStyle) setWrapStyle({ minHeight: 'auto', paddingTop: getPX(0) });
    } else {
      const scrollTop = scrollRef.value?.scrollTop ?? 0;
      const offset = Math.floor(itemsEver.value / 3);
      state.start = Math.max(Math.floor(scrollTop / itemsHeight.value) - offset, 0); // 根据滚动位置计算起始索引
      state.end = Math.min(state.start + itemsEver.value, tableList.value.length); // 计算结束索引
      if (setWrapStyle) setWrapStyle({ minHeight: getPX(tableFullHeight.value), paddingTop: getPX(state.start * itemsHeight.value) });
    }
    if (!isInitHeight) initHeight();
  };

  // 缓存高度
  const initHeight = async () => {
    await nextTick();
    const firstItem = scrollRef.value?.querySelector('.' + itemClass);
    if (firstItem) {
      itemsHeight.value = firstItem.clientHeight;
      isInitHeight = true;
    }
  };

  // 设置每项样式
  const setItemClass = () => itemClass;

  // 重置滚动条
  const resetScrollBar = () => {
    if (scrollRef.value) scrollRef.value.scrollTop = 0;
  };

  watch(
    () => tableList.value,
    () => {
      resetScrollBar();
      scrollVirtual();
    },
    { immediate: true }
  );

  return { scrollVirtual, setItemClass, virtualList };
}
