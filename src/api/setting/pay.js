import request from '@/tools/request.js';

// 获取支付方式
export function getPayWay() {
  return request.get('/setting.pay.pay_way/getPayWay');
}

// 设置支付方式
export function setPayWay(params) {
  return request.post('/setting.pay.pay_way/setPayWay', params);
}

// 获取支付方式
export function getPayConfigLists() {
  return request.get('/setting.pay.pay_config/lists');
}

// 设置支付方式
export function setPayConfig(params) {
  return request.post('/setting.pay.pay_config/setConfig', params);
}

// 设置支付方式
export function getPayConfig(params) {
  return request.get('/setting.pay.pay_config/getConfig', { params });
}
