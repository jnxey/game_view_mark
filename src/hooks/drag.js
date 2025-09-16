import { onBeforeUnmount, reactive } from 'vue';

// 返回拖拽的实现业务逻辑
export function useDrag(start, end) {
  // x,y 移动的的值
  const pointer = reactive({ resize: false, x: 0, y: 0 });
  // x,y 动态变更的值
  const resize = reactive({ x: 0, y: 0 });

  const resetPointer = () => {
    pointer.resize = false;
    pointer.x = 0;
    pointer.y = 0;
    resize.x = 0;
    resize.y = 0;
  };

  const pointerdown = (e) => {
    if (start) start();
    resize.x = e.pageX - pointer.x;
    resize.y = e.pageY - pointer.y;
    pointer.resize = true;
  };

  const pointermove = (e) => {
    if (!pointer.resize) return;
    pointer.x = e.pageX - resize.x;
    pointer.y = e.pageY - resize.y;
  };

  const pointerup = () => {
    if (pointer.resize) {
      if (end) end();
      pointer.resize = false;
    }
  };

  const setDragDom = (ele, position) => {
    ele.addEventListener('pointerdown', pointerdown);
    document.body.addEventListener('pointermove', pointermove);
    window.addEventListener('pointerup', pointerup);
    window.addEventListener('pointercancel', pointerup);
    if (position) {
      // x,y
      pointer.x = position.x;
      pointer.y = position.y;
    }
  };

  onBeforeUnmount(() => {
    document.body.removeEventListener('pointermove', pointermove);
    window.removeEventListener('pointerup', pointerup);
    window.removeEventListener('pointercancel', pointerup);
  });

  return { resize, pointer, resetPointer, setDragDom };
}
