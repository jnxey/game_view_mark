import NProgress from 'nprogress';
import { MENU_ENUM_TYPE } from '@/values/menu.js';
import { checkIndexArray, getJSON, isExternal, toAwait } from '@/tools/index.js';
import { config } from '@/config/index.js';
import { storage } from '@/tools/storage.js';
import { CACHE_KEY_TOKEN } from '@/values/cache.js';
import { managerState, syncManageState } from '@/store/manager.js';
import { $t } from '@/lang/i18n';
import { getEnvConfig } from '@/config/env';

/*
 * 处理路由 / 菜单 相关内容
 */
export function useRouterHandler(router) {
  const modulePrefix = '/src/views/';
  const moduleSuffix = '.vue';
  // 匹配views里面所有的.vue文件，动态引入
  const modules = import.meta.glob('/src/views/**/*.vue');

  // NProgress配置
  NProgress.configure({ showSpinner: false });

  // 免登录白名单
  const whiteList = [config.route.loginPath, config.route.errorPath, config.route.notfoundPath, config.route.viewsMember];
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    document.title = $t(to.meta.title ?? '');
    const token = storage.get(CACHE_KEY_TOKEN);
    if (whiteList.includes(to.path)) {
      next(); // 在免登录白名单，直接进入
    } else if (token && to.path === config.route.loginPath) {
      next({ path: config.route.homePath }); // 进入默认页
    } else if (token) {
      if (managerState.user) {
        const [envConfig] = await toAwait(getEnvConfig());
        // 处理Table专用;
        if (!!envConfig?.table_id && to.path !== config.route.sceneEnter) {
          next({ path: config.route.sceneEnter, query: { id: envConfig?.table_id, name: envConfig?.table_name } });
        } else {
          next(); // 正常进入
        }
      } else {
        const [, err] = await toAwait(syncManageState(_createDynamicsRoute));
        if (err) {
          next({ path: config.route.errorPath }); // 正常进入
        } else {
          const homeKey = router.getRoutes().findIndex((val) => val.path === config.route.homePath);
          if (!checkIndexArray(homeKey)) {
            router.addRoute(config.route.layout, {
              path: config.route.homePath,
              name: config.route.homePath,
              meta: { title: $t('menu.directory.workbench') },
              component: () => import('@/views/workbench/place/index.vue')
            }); // 匹配空首页
          }
          router.addRoute({ path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/404' }); // 匹配404
          next({ ...to, replace: true }); // 正常进入
        }
      }
    } else {
      next({ path: config.route.loginPath, query: { redirect: to.fullPath } });
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });

  // 创建动态路由
  function _createDynamicsRoute(route) {
    if (route.meta.type !== MENU_ENUM_TYPE.MENU) return;
    if (isExternal(route.path)) return;
    const params = getJSON(route.meta.params, {}); // 扩展参数
    if (!!params.query) route.meta.query = params.query;
    if (params.layout === false) {
      router.addRoute({
        path: route.path, // 子路由路径
        name: route.name,
        meta: route.meta,
        component: _loadRouteView(route.meta.component) // 子路由对应的组件
      });
    } else {
      router.addRoute(config.route.layout, {
        path: route.path, // 子路由路径
        name: route.name,
        meta: route.meta,
        component: _loadRouteView(route.meta.component) // 子路由对应的组件
      });
    }
  }

  // 动态加载组件
  function _loadRouteView(component) {
    const errorKey = `${modulePrefix}404/index${moduleSuffix}`;
    try {
      const key = Object.keys(modules).find((key) => {
        return key.includes(`${modulePrefix}${component}${moduleSuffix}`);
      });
      if (key) return modules[key];
      return modules[errorKey];
    } catch (error) {
      return modules[errorKey];
    }
  }

  return { modules, modulePrefix, moduleSuffix };
}
