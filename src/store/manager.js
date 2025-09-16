import { nextTick, reactive } from 'vue';
import { isExternal, toAwait } from '@/tools/index.js';
import { getUserInfo } from '@/api/common.js';
import { MENU_ENUM_CACHE, MENU_ENUM_SHOW } from '@/values/menu.js';
import { storage } from '@/tools/storage.js';
import { CACHE_KEY_TOKEN } from '@/values/cache.js';

// 当前登录员工信息
export const managerState = reactive({ user: null, menu: null, permissions: null });

// 同步当前登录员工信息
export async function syncManageState(dynamicsRoute) {
  const [res, err] = await toAwait(getUserInfo());
  if (err) return Promise.reject(true);
  const routes = _filterAsyncRoutes(res.menu ?? [], '', dynamicsRoute);
  await nextTick();
  managerState.user = res.user;
  managerState.routes = routes;
  managerState.permissions = res.permissions;
  Promise.resolve(true);
}

export async function syncManageUser() {
  const [res, err] = await toAwait(getUserInfo());
  if (err) return Promise.reject(true);
  await nextTick();
  managerState.user = res.user;
  Promise.resolve(true);
}

// 设置登录Token信息
export function setManageToken(value) {
  storage.set(CACHE_KEY_TOKEN, value);
}

// 清空登录Token信息
export function clearManageToken() {
  managerState.user = null;
  managerState.routes = null;
  managerState.permissions = null;
  storage.remove(CACHE_KEY_TOKEN);
}

/************************* filter *****************************/
// 过滤路由所需要的数据
function _filterAsyncRoutes(routes, prefix, dynamicsRoute) {
  return routes.map((route) => {
    const routeRecord = _createRouteRecord(route, prefix);
    if (route.children != null && route.children && route.children.length) {
      routeRecord.children = _filterAsyncRoutes(route.children, routeRecord.path, dynamicsRoute);
    }
    dynamicsRoute(routeRecord);
    return routeRecord;
  });
}

// 创建一条路由记录
function _createRouteRecord(route, prefix) {
  return {
    path: isExternal(route.paths) ? route.paths : prefix + '/' + route.paths,
    name: Symbol(route.paths),
    meta: {
      hidden: route.is_show !== MENU_ENUM_SHOW.show,
      keepAlive: route.is_cache === MENU_ENUM_CACHE.yes,
      title: route.name,
      perms: route.perms,
      params: route.params,
      icon: route.icon,
      type: route.type,
      component: route.component,
      activeMenu: route.selected
    }
  };
}
/************************* filter *****************************/
