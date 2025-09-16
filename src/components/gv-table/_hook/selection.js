import { computed, nextTick, reactive, watch } from 'vue';
import { mappingArrayToObject } from '@/tools';

// 使用复选框组
export function useSelection({ rowKey, getData, selectable, single, change }) {
  // 表格列表
  const tableList = computed(getData);

  // 选中列表
  const selected = reactive([]);

  // 选中对象
  const selectedMap = computed(() => mappingArrayToObject(selected, rowKey));

  // 禁用列表
  const enableList = computed(() => {
    if (!selectable) return tableList.value;
    return tableList.value.filter((val) => selectable(val));
  });

  // 禁用列表
  const enableListMap = computed(() => mappingArrayToObject(enableList.value, rowKey));

  // 是否选择全部
  const checkAll = computed(() => {
    return !!selected.length && selected.length === enableList.value.length;
  });

  // 是否中间态
  const checkIndeterminate = computed(() => {
    return !checkAll.value && !!selected.length;
  });

  // 检查是否选中
  const checkSelected = (row) => {
    return selectedMap.value[row[rowKey]];
  };

  // 设置row选中
  const toggleSelected = async (row) => {
    await nextTick();
    if (selectable && !selectable(row)) return;
    const checked = checkSelected(row);
    if (single) clearSelected();
    if (!!checked) {
      const key = selected.findIndex((val) => val[rowKey] === row[rowKey]);
      selected.splice(key, 1);
    } else {
      selected.push(row);
    }
    if (change) change();
  };

  // 选中全部
  const toggleSelectedAll = () => {
    if (!checkAll.value) {
      clearSelected();
      selected.push(...enableList.value);
    } else {
      clearSelected();
    }
    if (change) change();
  };

  // 清除全部
  const clearSelected = () => {
    selected.splice(0);
    if (change) change();
  };

  watch(
    () => tableList.value,
    () => {
      clearSelected();
    }
  );

  return { selected, selectedMap, enableListMap, toggleSelected, clearSelected, checkAll, checkIndeterminate, toggleSelectedAll };
}
