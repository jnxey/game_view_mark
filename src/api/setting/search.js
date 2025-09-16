import request from '@/tools/request.js';

/**
 * @description 获取热门搜索数据
 */
export function getSearch() {
  return request.get({ url: '/setting.hot_search/getConfig' });
}

/**
 * @description 设置热门搜索
 */
export function setSearch(params) {
  return request.post('/setting.hot_search/setConfig', params);
}
