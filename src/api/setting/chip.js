import { getRequestGet, getRequestPost } from '@/tools/request';

export const settingChipLists = getRequestGet({ name: '点码配置列表', url: '/setting.system.chip_config/lists' });

export const settingChipSet = getRequestPost({ name: '保存点码配置', url: '/setting.system.chip_config/set' });

export const settingChipDel = getRequestPost({ name: '删除点码配置', url: '/setting.system.chip_config/del' });

export const settingGetChipBind = getRequestPost({ name: '获取筹码绑定状态', url: '/setting.system.system/getChipBind' });

export const settingSetChipBind = getRequestPost({ name: '设置筹码绑定状态', url: '/setting.system.system/setChipBind' });
