export const config = {
  title: import.meta.env.VITE_APP_TITLE,
  baseURL: import.meta.env.VITE_APP_BASE,
  pagePrefix: import.meta.env.VITE_APP_PAGE_PREFIX,
  version: '1.9.4',
  rootCheck: 1, // 0 表示不是，1 表示是 超级管理员
  elementUI: {
    size: 'default',
    zIndex: 3000
  },
  baseImage: '/erp-oss',
  baseImageCountry: '/images-country',
  baseImageRoadNiu: '/road-niuniu',
  baseImageExtend: '/images-extend',
  route: {
    layout: 'layout',
    homePath: '/workbench',
    accountPath: '/account',
    loginPath: '/login',
    errorPath: '/500',
    notfoundPath: '/404',
    sceneEnter: '/scene/enter',
    viewsMember: '/views/member'
  }
};
