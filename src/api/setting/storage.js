import { getRequestGet, getRequestPost } from '@/tools/request';

export const storageLists = getRequestGet({ name: '获取存储引擎列表', url: '/setting.storage/lists' });

export const storageChange = getRequestPost({ name: '设置存储引擎信息', url: '/setting.storage/change' });

export const storageSetup = getRequestPost({ name: '设置存储引擎信息', url: '/setting.storage/setup' });

export const storageDetail = getRequestGet({ name: '获取存储配置信息', url: '/setting.storage/detail' });
