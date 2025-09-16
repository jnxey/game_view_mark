import { getRequestGet, getRequestPost } from '@/tools/request';

export const financeCameraLists = getRequestGet({ name: '录像机列表', url: '/finance.camera/lists' });

export const financeCameraSet = getRequestPost({ name: '编辑录像机', url: '/finance.camera/set' });

export const financeCameraDel = getRequestPost({ name: '删除录像机', url: '/finance.camera/del' });
