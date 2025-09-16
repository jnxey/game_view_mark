import request from '@/tools/request.js';

/**
 * @description 获取用户设置
 */
export function getUserSetup() {
  return request.get('/setting.user.user/getConfig');
}

/**
 * @description 设置用户设置
 */
export function setUserSetup(params) {
  return request.post('/setting.user.user/setConfig', params);
}

/**
 * @description 设置登录注册规则
 */
export function getLogin() {
  return request.get('/setting.user.user/getRegisterConfig');
}

/**
 * @description 设置登录注册规则
 */
export function setLogin(params) {
  return request.post('/setting.user.user/setRegisterConfig', params);
}
