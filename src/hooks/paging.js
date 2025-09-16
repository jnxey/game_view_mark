import { reactive, toRaw } from 'vue';
import { QUERY_LIST_SIZE } from '@/values';

export function usePaging(options) {
  const { page = 1, size = QUERY_LIST_SIZE, fetchFun, params = {}, fixedParams = {}, firstLoading = false } = options;
  // 参数
  const query = reactive({ ...params });
  // 分页数据
  const pager = reactive({
    page,
    size,
    loading: firstLoading,
    count: 0,
    lists: [],
    extend: {}
  });
  // 请求分页接口
  const getLists = () => {
    pager.loading = true;
    return fetchFun({
      page_no: pager.page,
      page_size: pager.size,
      ...query,
      ...fixedParams
    })
      .then((res) => {
        pager.count = res?.count;
        pager.lists = res?.lists;
        pager.extend = res?.extend;
        return Promise.resolve(res);
      })
      .catch((err) => {
        return Promise.reject(err);
      })
      .finally(() => {
        pager.loading = false;
      });
  };
  // 重置为第一页
  const search = () => {
    pager.page = 1;
    getLists();
  };
  // 重置参数
  const reset = () => {
    Object.keys(params).forEach((item) => {
      query[item] = params[item];
    });
    getLists();
  };
  return {
    pager,
    query,
    getLists,
    reset,
    search
  };
}
