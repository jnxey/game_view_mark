import { reactive, toRaw } from 'vue';

import { getDictData } from '@/api/common.js';
import { QUERY_LIST_TYPE, STATUS_VALUE } from '@/values';
import { isArray } from '@/tools';

// {
//     dict: {
//         api: dictData,
//         params: { name: 'user' },
//         transformData(data: any) {
//             return data.list
//         }
//     }
// }

export function useDictOptions(options, delay = false) {
  const fulfilled = 'fulfilled';
  const optionsData = reactive({});
  const optionsKey = Object.keys(options);
  const apiLists = optionsKey.map((key) => {
    const value = options[key];
    const params = { page_type: QUERY_LIST_TYPE.all, status: STATUS_VALUE.normal, ...toRaw(value.params) };
    optionsData[key] = [];
    return () => value.api(params);
  });
  const getList = (res) => {
    return isArray(res?.lists) ? res.lists : res;
  };
  const refresh = async () => {
    const res = await Promise.allSettled(apiLists.map((api) => api()));
    res.forEach((item, index) => {
      const key = optionsKey[index];
      if (item.status === fulfilled) {
        const { transformData } = options[key];
        optionsData[key] = transformData ? transformData(item.value) : getList(item.value);
      }
    });
  };
  if (!delay) refresh();
  return { optionsData, refresh };
}

// useDictData<{
//     dict: any[]
// }>(['dict'])

export function useDictData(dict) {
  const dictData = reactive({});
  const refresh = async () => {
    const res = await getDictData({ type: dict });
    Object.assign(dictData, res);
  };

  refresh();
  return { dictData: dictData, refresh };
}
