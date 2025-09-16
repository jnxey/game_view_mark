import { getRequestGet, getRequestPost } from '@/tools/request';

export const getWebsite = getRequestGet({ name: '获取网站信息', url: '/setting.web.web_setting/getWebsite' });

export const setWebsite = getRequestPost({ name: '设置网站信息', url: '/setting.web.web_setting/setWebsite' });
