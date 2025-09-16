import { getRequestGet, getRequestPost } from '@/tools/request';

export const dictTypeLists = getRequestGet({ name: '字典类型列表', url: '/setting.dict.dict_type/lists' });

export const dictTypeAll = getRequestGet({ name: '字典类型列表全部', url: '/setting.dict.dict_type/all' });

export const dictTypeAdd = getRequestPost({ name: '添加字典类型', url: '/setting.dict.dict_type/add' });

export const dictTypeEdit = getRequestPost({ name: '编辑字典类型', url: '/setting.dict.dict_type/edit' });

export const dictTypeDelete = getRequestPost({ name: '删除字典类型', url: '/setting.dict.dict_type/delete' });

export const dictTypeDetail = getRequestGet({ name: '字典类型详情', url: '/setting.dict.dict_type/detail' });

export const dictDataLists = getRequestGet({ name: '字典数据列表', url: '/setting.dict.dict_data/lists' });

export const dictDataAdd = getRequestPost({ name: '添加字典数据', url: '/setting.dict.dict_data/add' });

export const dictDataEdit = getRequestPost({ name: '编辑字典数据', url: '/setting.dict.dict_data/edit' });

export const dictDataDelete = getRequestPost({ name: '删除字典数据', url: '/setting.dict.dict_data/delete' });

export const dictDataDetail = getRequestPost({ name: '字典数据详情', url: '/setting.dict.dict_data/detail' });
