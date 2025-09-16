// 当前环境
import { initUniMessageHandler, uniEvents } from '@/config/uni';

export const ENV_MAP = { terminal: 'terminal', browser: 'browser' };

// 初始化环境
export const initEnv = () => {
  initUniMessageHandler();
};

// 获取当前环境
export const getEnv = () => {
  if (!!window.electron || !!window.plus) {
    return ENV_MAP.terminal;
  } else {
    return ENV_MAP.browser;
  }
};

// 获取环境配置
export const getEnvConfig = () => {
  if (!!window.electron) {
    return window.electron.getLocalConfig();
  } else if (!!window.plus) {
    return uniEvents.getLocalConfig();
  } else {
    return Promise.resolve({});
  }
};

// 获取环境配置
export const setEnvConfig = (config) => {
  if (!!window.electron) {
    return window.electron.setLocalConfig(config);
  } else if (!!window.plus) {
    return uniEvents.setLocalConfig(config);
  } else {
    return Promise.resolve();
  }
};

// Electron获取是否是全屏
export const getFullscreen = () => {
  if (!!window.electron) {
    return window.electron.getFullscreen();
  } else if (!!window.plus) {
    return true;
  } else {
    return Promise.resolve(false);
  }
};

// Electron获取怯寒全屏
export const setFullscreen = (status) => {
  if (!!window.electron) {
    return window.electron.setFullscreen(status);
  } else if (!!window.plus) {
    return true;
  } else {
    return Promise.resolve(true);
  }
};

// Electron获取设备Mac
export const getEnvMacAddress = () => {
  if (!!window.electron) {
    return window.electron.getMacAddress();
  } else if (!!window.plus) {
    return uniEvents.getMacAddress();
  } else {
    return Promise.resolve('');
  }
};

// Electron获取设备信息
export const getEnvDevice = () => {
  if (!!window.electron) {
    return window.electron.getDevice();
  } else if (!!window.plus) {
    return uniEvents.getDevice();
  } else {
    return Promise.resolve({});
  }
};
