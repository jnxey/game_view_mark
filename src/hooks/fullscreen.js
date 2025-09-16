import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { delayExec, exitFullscreen, getFullscreen as getFullscreenBrowser, toggleFullscreen } from '@/tools/index.js';
import { ENV_MAP, getEnv, getFullscreen as getFullscreenTerminal, setFullscreen as setFullscreenTerminal } from '@/config/env';
import { $t } from '@/lang/i18n';

const keydownCode = { f11: 'F11', escape: 'Escape' };

export function useListenerFullscreen() {
  const isFullscreen = ref(false);

  const tooltip = computed(() => {
    return isFullscreen.value ? $t('other.func.fullscreen_out') : $t('other.func.fullscreen_enter');
  });

  const keydownEnter = async (event) => {
    if (event.ctrlKey) return;
    if (event.code === keydownCode.f11) {
      event.preventDefault();
      if (getEnv() === ENV_MAP.browser) toggleFullscreen();
    }
    if (event.code === keydownCode.escape) {
      event.preventDefault();
      // if (getEnv() === ENV_MAP.browser) exitFullscreen();
    }
    await delayExec(100);
    setFullscreen();
  };

  const setFullscreen = async () => {
    if (getEnv() === ENV_MAP.browser) {
      isFullscreen.value = getFullscreenBrowser();
    } else {
      isFullscreen.value = await getFullscreenTerminal();
    }
  };

  const toggle = async () => {
    if (getEnv() === ENV_MAP.browser) {
      toggleFullscreen();
    } else {
      const isFullscreen = await getFullscreenTerminal();
      setFullscreenTerminal(!isFullscreen);
    }
    await delayExec(100);
    setFullscreen();
  };

  onMounted(() => {
    setFullscreen();
    window.addEventListener('fullscreenchange', setFullscreen);
    window.addEventListener('keyup', keydownEnter);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('fullscreenchange', setFullscreen);
    window.removeEventListener('keyup', keydownEnter);
  });

  return { isFullscreen, tooltip, setFullscreen, toggle };
}
