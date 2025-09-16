import { getRequestGet, getRequestPost } from '@/tools/request';

export const fileCateAdd = getRequestPost({ name: '文件添加', url: '/file/addCate' });

export const fileCateEdit = getRequestPost({ name: '文件编辑', url: '/file/editCate' });

export const fileCateDelete = getRequestPost({ name: '文件分类删除', url: '/file/delCate' });

export const fileCateLists = getRequestGet({ name: '文件分类列表', url: '/file/listCate' });

export const fileList = getRequestGet({ name: '文件列表', url: '/file/lists' });

export const fileDelete = getRequestPost({ name: '文件删除', url: '/file/delete' });

export const fileMove = getRequestPost({ name: '文件移动', url: '/file/move' });

export const fileRename = getRequestPost({ name: '文件重命名', url: '/file/rename' });
