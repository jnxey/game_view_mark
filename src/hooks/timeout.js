import { onBeforeUnmount } from 'vue';

export function useTimeout(fn, time) {
  let timer = null;
  const timeout = () => {
    timer = setTimeout(fn, time);
  };
  const close = () => clearTimeout(timer);
  onBeforeUnmount(() => close());
  return { timeout, close };
}
