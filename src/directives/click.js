export default {
  mounted(el, binding) {
    let start = null;

    const handleMouseDown = () => {
      start = Date.now();
    };

    const handleMouseUp = (event) => {
      const end = Date.now();
      const during = end - start;
      if (during < 500) {
        if (typeof binding.value === 'function') binding.value(event);
      }
    };

    el.__handleMouseDown__ = handleMouseDown;
    el.__handleMouseUp__ = handleMouseUp;

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mouseleave', handleMouseUp); // 防止鼠标移出时未清除定时器
  },

  beforeUnmount(el) {
    // 移除事件监听器
    el.removeEventListener('mousedown', el.__handleMouseDown__);
    el.removeEventListener('mouseup', el.__handleMouseUp__);
    el.removeEventListener('mouseleave', el.__handleMouseUp__);
    delete el.__handleMouseDown__;
    delete el.__handleMouseUp__;
  }
};
