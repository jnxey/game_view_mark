import { onBeforeUnmount } from 'vue';

export function useDelay(fn, time) {
  let timer = null;
  const delayFn = function (...args) {
    timer = setTimeout(() => fn.apply(this, args), time);
  };
  onBeforeUnmount(() => {
    clearTimeout(timer);
  });

  return delayFn;
}
