import { generateUUID } from '@/tools';

const callbacks = {};

export function initUniMessageHandler() {
  window.uniappMessageHandler = function (data) {
    if (callbacks[`${data.key}`]) {
      callbacks[`${data.key}`](data.value);
      delete callbacks[`${data.key}`];
    }
  };
  document.addEventListener('plusready', function () {
    const styleEl = document.createElement('style');
    styleEl.textContent = `body { --gv-status-bar-height: 25px; }`;
    document.head.appendChild(styleEl);
  });
}

export const uniEvents = {
  getLocalConfig: () => {
    return new Promise((resolve) => {
      const uk = generateUUID();
      callbacks[`UNI_${uk}`] = (value) => resolve(value);
      window.uni.postMessage({ data: { action: 'get-local-config', key: `UNI_${uk}` } });
    });
  },
  setLocalConfig: (config) => {
    return new Promise((resolve) => {
      const uk = generateUUID();
      window.uni.postMessage({ data: { action: 'set-local-config', key: `UNI_${uk}`, options: config } });
      resolve();
    });
  },
  getMacAddress: () => {
    return new Promise((resolve) => {
      const uk = generateUUID();
      callbacks[`UNI_${uk}`] = (value) => resolve(value);
      window.uni.postMessage({ data: { action: 'get-mac-address', key: `UNI_${uk}` } });
    });
  },
  getDevice: () => {
    return new Promise((resolve) => {
      const uk = generateUUID();
      callbacks[`UNI_${uk}`] = (value) => resolve(value);
      window.uni.postMessage({ data: { action: 'get-device-info', key: `UNI_${uk}` } });
    });
  },
  getIPAddress: () => {
    return new Promise((resolve) => {
      const uk = generateUUID();
      callbacks[`UNI_${uk}`] = (value) => resolve(value);
      window.uni.postMessage({ data: { action: 'get-ip-address', key: `UNI_${uk}` } });
    });
  },
  getScreenSize: () => {
    return new Promise((resolve) => {
      const uk = generateUUID();
      callbacks[`UNI_${uk}`] = (value) => resolve(value);
      window.uni.postMessage({ data: { action: 'get-screen-size', key: `UNI_${uk}` } });
    });
  },
  setFullscreen: () => {
    return new Promise((resolve) => {
      const uk = generateUUID();
      window.uni.postMessage({ data: { action: 'set-fullscreen', key: `UNI_${uk}` } });
      resolve();
    });
  },
  appQuit: () => {
    return new Promise((resolve) => {
      const uk = generateUUID();
      window.uni.postMessage({ data: { action: 'app-quit', key: `UNI_${uk}` } });
      resolve();
    });
  }
};
