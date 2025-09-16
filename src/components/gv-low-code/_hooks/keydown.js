import { onBeforeUnmount, onMounted } from 'vue';

export function useKeydownSpace(downFn, upFn) {
  const _execDown = (event) => {
    if (String(event.code).toLowerCase() === 'space' && downFn) downFn();
  };
  const _execUP = (event) => {
    if (String(event.code).toLowerCase() === 'space' && upFn) upFn();
  };
  onMounted(() => {
    window.addEventListener('keydown', _execDown);
    window.addEventListener('keyup', _execUP);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', _execDown);
    window.removeEventListener('keyup', _execUP);
  });
}
