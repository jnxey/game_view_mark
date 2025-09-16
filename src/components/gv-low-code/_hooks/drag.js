import { onBeforeUnmount, reactive } from 'vue';
import { usePosNumber } from './number.js';

// 返回拖拽的实现业务逻辑
export function useDrag(check, setPointer, getScale, getPosition) {
  // x,y 移动的的值
  const pointer = reactive({ resize: false, x: 0, y: 0 });
  // x,y 动态变更的值
  const resize = reactive({ sx: 0, sy: 0, x: 0, y: 0 });

  let scale = 1;

  const resetPointer = () => {
    pointer.resize = false;
    pointer.x = 0;
    pointer.y = 0;
    resize.sx = 0;
    resize.xy = 0;
    resize.x = 0;
    resize.y = 0;
  };

  const pointerdown = (e) => {
    if (!!check && !check()) return;
    if (getScale) scale = getScale();
    if (getPosition) {
      const position = getPosition();
      pointer.x = position.x;
      pointer.y = position.y;
    }

    resize.sx = e.pageX;
    resize.sy = e.pageY;
    resize.x = pointer.x;
    resize.y = pointer.y;
    pointer.resize = true;
  };

  const pointermove = (e) => {
    if (!pointer.resize) return;
    pointer.x = usePosNumber((e.pageX - resize.sx) / scale + resize.x);
    pointer.y = usePosNumber((e.pageY - resize.sy) / scale + resize.y);
    if (setPointer) setPointer(pointer);
  };

  const pointerup = () => {
    if (!pointer.resize) return;
    pointer.resize = false;
  };

  const setDragDom = (ele) => {
    ele.addEventListener('pointerdown', pointerdown);
    document.body.addEventListener('pointermove', pointermove);
    window.addEventListener('pointerup', pointerup);
    window.addEventListener('pointercancel', pointerup);
  };

  onBeforeUnmount(() => {
    document.body.removeEventListener('pointermove', pointermove);
    window.removeEventListener('pointerup', pointerup);
    window.removeEventListener('pointercancel', pointerup);
  });

  return { pointer, resetPointer, setDragDom };
}
