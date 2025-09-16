import { onMounted, onBeforeUnmount } from 'vue';
import { throttle } from 'throttle-debounce';

export function useListenResize(fn, isThrottle = true) {
  const handler = isThrottle ? throttle(500, fn) : fn;

  onMounted(() => {
    window.addEventListener('resize', handler);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handler);
  });
}
