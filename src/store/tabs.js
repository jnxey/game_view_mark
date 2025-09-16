import { reactive, unref } from 'vue';
import { config } from '@/config';
import { storage } from '@/tools/storage';
import { CACHE_KEY_TABS_MULTIPLE } from '@/values/cache';
import { deepClone } from '@/tools';

const defTabs = storage.get(CACHE_KEY_TABS_MULTIPLE);

export const tabsListState = reactive(defTabs || []);

// 报错tab+
const saveTabs = () => {
  storage.set(CACHE_KEY_TABS_MULTIPLE, tabsListState);
};

// 从route获取tabitem
export const getTabItem = (route) => {
  return { fullPath: route.fullPath, name: route.name, title: route.query.title ?? route.meta.title, cache_query: deepClone(route.query) };
};

// 变更tab
export const updateTab = (route) => {
  const key = tabsListState.findIndex((val) => val.fullPath === route.fullPath);
  if (key <= -1) tabsListState.push(getTabItem(route));
  saveTabs();
};

// 移除Tab
export const removeTab = (current, fullPath, router) => {
  const key = tabsListState.findIndex((val) => val.fullPath === fullPath);
  const handlerItem = tabsListState[key];
  const prev = tabsListState[key - 1];
  const next = tabsListState[key + 1];
  if (key <= -1) return;
  tabsListState.splice(key, 1);
  if (current === fullPath) {
    if (prev) {
      router.push(prev.fullPath);
    } else if (next) {
      router.push(next.fullPath);
    } else if (current !== config.route.homePath) {
      router.push(config.route.homePath);
    } else {
      tabsListState.push(handlerItem);
    }
  }
  saveTabs();
};

// 移除除当前Tab外的其他Tab
export const removeOtherTab = (fullPath, router) => {
  const route = unref(router.currentRoute);
  const key = tabsListState.findIndex((val) => val.fullPath === fullPath);
  const current = tabsListState[key];
  tabsListState.splice(0);
  tabsListState.push(current);
  if (route.fullPath !== fullPath) {
    router.push(fullPath);
  }
  saveTabs();
};

// 移除所有Tab
export const removeAllTab = (router) => {
  const route = unref(router.currentRoute);
  tabsListState.splice(0);
  if (route.fullPath !== config.route.homePath) {
    router.push(config.route.homePath);
  } else {
    tabsListState.push(getTabItem(route));
  }
  saveTabs();
};

// 回退tab
export const backTab = (router) => {
  const route = unref(router.currentRoute);
  removeTab(route, route.fullPath, router);
  router.back();
};
