import layer from '@/tools/layer';
import { getFileExtension, toAwait } from '@/tools';
import { $t } from '@/lang/i18n';

const lockCache = { value: false };

export function errorHandler() {
  window.addEventListener(
    'error',
    async (event) => {
      if (lockCache.value) return;
      const scriptError = event.target.tagName === 'SCRIPT' && getFileExtension(event.target.src || '') === 'js';
      const linkError = event.target.tagName === 'LINK' && getFileExtension(event.target.href || '') === 'js';
      if (scriptError || linkError) {
        const isOnline = navigator.onLine;
        lockCache.value = true;
        const [res] = await toAwait(layer.confirm(isOnline ? $t('other.func.tips_error_refresh') : $t('other.func.tips_error_network')));
        lockCache.value = false;
        if (!!res) window.location.reload();
      }
    },
    true
  );
}
