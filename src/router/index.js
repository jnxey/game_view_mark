import { createRouter, createWebHistory } from 'vue-router';
import { useRouterHandler } from '@/router/handler.js';
import { config } from '@/config/index.js';
import layer from '@/tools/layer';
import { checkPerm } from '@/directives/perms';
import { $t } from '@/lang/i18n';
import { base64 } from '@/tools/base64';
import { isObject } from '@vue/shared';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: config.route.layout,
      redirect: config.route.homePath,
      component: () => import('@/views/layout/index.vue'),
      children: [
        {
          path: '/account',
          name: 'account',
          meta: { title: $t('other.func.route_account') },
          component: () => import('@/views/account/index.vue')
        }
      ]
    },
    {
      path: '/desk/road',
      name: 'desk-road',
      meta: { title: $t('other.func.route_desk_road') },
      component: () => import('@/views/desk/road/index.vue')
    },
    {
      path: '/desk/bonus',
      name: 'desk-bonus',
      meta: { title: $t('other.func.route_desk_bonus') },
      component: () => import('@/views/desk/bonus/index.vue')
    },
    {
      path: '/views/member',
      name: 'views-member',
      meta: { title: 'Member' },
      component: () => import('@/views-member/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: $t('other.func.route_login') },
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/500',
      name: '500',
      meta: { title: 'Error' },
      component: () => import('@/views/500/index.vue')
    },
    {
      path: '/404',
      name: '404',
      meta: { title: 'Not Found' },
      component: () => import('@/views/404/index.vue')
    }
  ]
});

const { modules, modulePrefix, moduleSuffix } = useRouterHandler(router);

export function getModulesKey() {
  return Object.keys(modules).map((item) => item.replace(modulePrefix, '').replace(moduleSuffix, ''));
}

export function getRoutePath(perms) {
  return router.getRoutes().find((item) => item.meta?.perms === perms)?.path || '';
}

export function getRouteName(perms) {
  return router.getRoutes().find((item) => item.meta?.perms === perms)?.name || '';
}

export function toRoutePath(perms, query) {
  if (!checkPerm([perms])) return layer.msgError($t('other.func.tips_no_perms_visit'));
  const path = getRoutePath(perms);
  if (path) {
    if (path.indexOf(':uni') <= -1) {
      router.push({ path, query });
    } else {
      const name = getRouteName(perms);
      const qString = isObject(query) ? JSON.stringify(query) : 'all';
      router.push({ name, query, params: { uni: base64.encode(qString) } });
    }
  } else {
    layer.msgError($t('other.func.tips_no_found'));
  }
}

export default router;
