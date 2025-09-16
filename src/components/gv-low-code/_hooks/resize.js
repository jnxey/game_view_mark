import { onBeforeUnmount, reactive } from 'vue';
import { usePosNumber } from './number.js';

// 返回拖拽的实现业务逻辑
export function useResize(check, setPointer, getScale, getFirst) {
  // x,y 移动的的值
  const pointer = reactive({ resize: false, x: 0, y: 0, cx: 0, cy: 0, sx: 0, sy: 0, px: 0, py: 0 });

  let scale = 1;

  const resetPointer = () => {
    pointer.resize = false;
    pointer.x = 0;
    pointer.y = 0;
    pointer.cx = 0;
    pointer.cy = 0;
    pointer.sx = 0;
    pointer.sy = 0;
  };

  const pointerdown = (e) => {
    if (!!check && !check()) return;
    if (getScale) scale = getScale();
    const first = getFirst();
    pointer.cx = first.x;
    pointer.cy = first.y;
    pointer.px = first.px;
    pointer.py = first.py;
    pointer.sx = e.pageX;
    pointer.sy = e.pageY;
    pointer.resize = true;
  };

  const pointermove = (e) => {
    if (!pointer.resize) return;
    pointer.x = usePosNumber((e.pageX - pointer.sx) / scale);
    pointer.y = usePosNumber((e.pageY - pointer.sy) / scale);
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
