import axios from 'axios';
import { CACHE_KEY_TOKEN } from '@/values/cache.js';
import { RESPONSE_CODE } from '@/values';
import { storage } from '@/tools/storage.js';
import { config as systemConfig } from '@/config/index.js';
import layer from '@/tools/layer.js';
import { clearManageToken, managerState } from '@/store/manager.js';
import { delayExec, isEmpty, isFunction, isObject, isString } from '@/tools/index.js';
import { languageCurrent } from '@/lang';
import eventManager from '@/tools/event-manager';
import { EVENTS_LOG_POPUP_REFRESH } from '@/values/events';
import { $ti, inputLanguageMark } from '@/lang/input';

// 获取登录页面地址
function _getLoginPath() {
  return (
    systemConfig.pagePrefix + systemConfig.route.loginPath + '?redirect=' + encodeURIComponent(window.location.pathname + window.location.search)
  );
}

// 处理错误信息国际化
function _getErrorMsg(str) {
  if (isEmpty(str)) return '';
  const stack = [];
  const result = [];
  let _str = String(str);
  for (let i = 0; i < _str.length; i++) {
    if (_str[i] === '[') {
      stack.push(i);
    } else if (_str[i] === ']' && stack.length) {
      const start = stack.pop();
      result.push(_str.slice(start + 1, i));
    }
  }
  result.forEach((value) => {
    if (isString(value) && !value.indexOf(inputLanguageMark)) _str = _str.replace(value, $ti(value));
  });
  return _str;
}

const request = axios.create({
  baseURL: systemConfig.baseURL,
  timeout: 600 * 1000,
  withCredentials: false,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept-Language': languageCurrent
  }
});

request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = storage.get(CACHE_KEY_TOKEN);
    const noFilterNull = config.noFilterNull ?? [];
    if (token) config.headers.Token = token;
    Object.keys(config.params ?? {}).forEach((name) => {
      if (config.params[name] === undefined) config.params[name] = null;
    });
    Object.keys(config.data ?? {}).forEach((name) => {
      if (config.data[name] === undefined) config.data[name] = null;
    });
    Object.keys(config.params ?? {}).forEach((name) => {
      if (!noFilterNull.includes(name) && config.params[name] === null) delete config.params[name];
    });
    Object.keys(config.data ?? {}).forEach((name) => {
      if (!noFilterNull.includes(name) && config.data[name] === null) delete config.data[name];
    });

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  async function (config) {
    const dto = config.data || {};
    const code = dto.code;
    if (code === RESPONSE_CODE.SUCCESS) {
      if (config.config.logRefresh) eventManager.emit(EVENTS_LOG_POPUP_REFRESH);
      if (isFunction(config.config.pipeFormat)) config.config.pipeFormat(dto.data);
      return Promise.resolve(dto.data);
    } else if (code === RESPONSE_CODE.FAIL) {
      if (!config.config.noShowMsg && !!config.config.errorAlert) {
        layer.alertError(_getErrorMsg(dto.msg));
      } else if (!config.config.noShowMsg) {
        layer.msgError(_getErrorMsg(dto.msg));
      }
      layer.closeLoading();
      return Promise.reject(dto);
    } else if (code === RESPONSE_CODE.LOGIN_FAILURE) {
      layer.msgError(_getErrorMsg(dto.msg));
      await delayExec(500);
      clearManageToken();
      window.location.href = _getLoginPath();
      layer.closeLoading();
      return Promise.reject(dto);
    } else if (code === RESPONSE_CODE.OPEN_NEW_PAGE) {
      window.location.href = dto.url;
      return Promise.resolve(dto);
    } else {
      layer.closeLoading();
      if (!config.config.noShowMsg && !!config.config.errorAlert) {
        layer.alertError(_getErrorMsg(dto.msg));
      } else if (!config.config.noShowMsg) {
        layer.msgError(_getErrorMsg(dto.msg));
      }
      return Promise.reject(dto);
    }
  },
  function (error) {
    layer.closeLoading();
    layer.msgError(error.message);
    return Promise.reject(error);
  }
);

function post(params) {
  if (isObject(this.mixin)) params = { ...this.mixin, ...params };
  return request.post(this.url, params, {
    noFilterNull: this.noFilterNull,
    pipeFormat: this.pipeFormat,
    logRefresh: this.logRefresh,
    errorAlert: this.errorAlert,
    noShowMsg: this.noShowMsg
  });
}

function get(params) {
  if (isObject(this.mixin)) params = { ...this.mixin, ...params };
  return request.get(this.url, {
    params,
    noFilterNull: this.noFilterNull,
    pipeFormat: this.pipeFormat,
    logRefresh: this.logRefresh,
    errorAlert: this.errorAlert,
    noShowMsg: this.noShowMsg
  });
}

function getPermByUrl(url) {
  return url.slice(0, 1) === '/' ? url.slice(1) : url;
}

export function getRequestPost(options) {
  const fn = post.bind(options);
  fn.title = options.name;
  fn.perm = getPermByUrl(options.url);
  fn.symbol = fn.perm.replace(/[\/.]/g, '_');
  fn.noFilterNull = options.noFilterNull;
  fn.pipeFormat = options.pipeFormat;
  return fn;
}

export function getRequestGet(options) {
  const fn = get.bind(options);
  fn.title = options.name;
  fn.perm = getPermByUrl(options.url);
  fn.symbol = fn.perm.replace(/[\/.]/g, '_');
  fn.noFilterNull = options.noFilterNull;
  fn.pipeFormat = options.pipeFormat;
  return fn;
}

export default request;
