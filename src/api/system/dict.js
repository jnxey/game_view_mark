import request from '@/utils/request';

// 字典类型列表
export function dictTypeLists(params) {
  return request.get('/setting.dict.dict_type/lists', { params });
}

// 字典类型列表全部
export function dictTypeAll(params) {
  return request.get('/setting.dict.dict_type/all', { params });
}

// 添加字典类型
export function dictTypeAdd(params) {
  return request.post('/setting.dict.dict_type/add', params);
}

// 编辑字典类型
export function dictTypeEdit(params) {
  return request.post('/setting.dict.dict_type/edit', params);
}

// 删除字典类型
export function dictTypeDelete(params) {
  return request.post('/setting.dict.dict_type/delete', params);
}

// 字典类型详情
export function dictTypeDetail(params) {
  return request.get('/setting.dict.dict_type/detail', { params });
}

// 字典数据列表
export function dictDataLists(params) {
  return request.get('/setting.dict.dict_data/lists', { params, ignoreCancelToken: true });
}

// 添加字典数据
export function dictDataAdd(params) {
  return request.post('/setting.dict.dict_data/add', params);
}

// 编辑字典数据
export function dictDataEdit(params) {
  return request.post('/setting.dict.dict_data/edit', params);
}

// 删除字典数据
export function dictDataDelete(params) {
  return request.post('/setting.dict.dict_data/delete', params);
}

// 字典数据详情
export function dictDataDetail(params) {
  return request.get('/setting.dict.dict_data/detail', { params });
}
