import { createApp, h, ref } from 'vue';
import Confirm from './index.vue';
import { checkIndexArray, getArrayLastKey } from '@/tools';

export const useConfirm = () => {
  const confirm = (options) => {
    return new Promise((resolve, reject) => {
      let zIndex = 3000;
      const overlays = document.querySelectorAll('.el-overlay') ?? [];
      const overlaysLastKey = getArrayLastKey(overlays);
      if (checkIndexArray(overlaysLastKey)) {
        const cIndex = window.getComputedStyle(overlays[overlaysLastKey]).zIndex;
        if (!!cIndex) {
          zIndex = Number(cIndex) + 1;
        }
      }
      // 创建挂载节点
      const mountNode = document.createElement('div');
      mountNode.style.zIndex = zIndex;
      mountNode.classList.add('gv-confirm-overlay');
      document.body.appendChild(mountNode);

      // 解析参数（支持两种调用方式）
      const config = typeof options === 'string' ? { content: options } : options;

      // 创建应用实例
      const app = createApp({
        render() {
          return h(Confirm, {
            ...{
              ...config,
              onConfirm: () => resolve(),
              onCancel: () => reject(new Error('Canceled')),
              onClose: () => {
                // 延迟卸载确保动画完成
                setTimeout(() => {
                  app.unmount();
                  document.body.removeChild(mountNode);
                }, 300);
              }
            }
          });
        }
      });

      // 挂载实例
      app.mount(mountNode);
    });
  };

  return { confirm };
};
