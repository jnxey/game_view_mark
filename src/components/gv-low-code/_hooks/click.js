import { onMounted, onBeforeUnmount } from 'vue';

export function useWindowClick(fn) {
  onMounted(() => {
    window.addEventListener('click', fn);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('click', fn);
  });
}
