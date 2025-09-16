import { MENU_ENUM_TYPE } from '@/values/menu.js';
import { CACHE_VALUE, SHOW_VALUE, STATUS_VALUE, SYSTEM_PARENT_TOP } from '@/values';

export const menuEditFormTemp = {
  id: null,
  //父级id
  pid: SYSTEM_PARENT_TOP,
  //类型
  type: MENU_ENUM_TYPE.CATALOGUE,
  //图标
  icon: '',
  //名称
  name: '',
  //排序号
  sort: 0,
  // 路由路径
  paths: '',
  //权限链接
  perms: '',
  //前端组件
  component: '',
  //选中路径
  selected: '',
  //路由参数
  params: '',
  //是否缓存 0=否， 1=是
  is_cache: CACHE_VALUE.no,
  //是否显示 0=否， 1=是
  is_show: SHOW_VALUE.show,
  //是否禁用 0=否， 1=是
  is_disable: STATUS_VALUE.normal
};
