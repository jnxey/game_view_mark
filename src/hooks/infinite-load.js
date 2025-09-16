import { computed, reactive, ref } from 'vue';

// 使用无限加载
export function useInfiniteLoad(fn) {
  const pagination = reactive({ page_no: 1, page_size: 20, count: 0 });
  const loadLoading = ref(false);

  const tableData = reactive([]);

  const noMore = computed(() => pagination.page_no * pagination.page_size >= pagination.count);

  const loadTableData = async (refresh, params, handler) => {
    if (loadLoading.value) return;
    if (refresh === true) {
      pagination.page_no = 1;
      tableData.splice(0);
    } else {
      if (pagination.page_no * pagination.page_size >= pagination.count) return;
      pagination.page_no += 1;
    }
    loadLoading.value = true;
    const { count, lists, extend } = await fn({ page_no: pagination.page_no, page_size: pagination.page_size, ...params });
    loadLoading.value = false;
    pagination.count = count;
    tableData.push(...lists);
    if (handler) handler(count, lists, extend);
  };

  return { tableData, loadLoading, noMore, loadTableData };
}
