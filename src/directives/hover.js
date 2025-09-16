export default {
  beforeMount(el, binding) {
    // 定义事件处理函数
    const addClass = (e) => {
      e.stopPropagation();
      el.classList.add(binding.value);
    };
    const removeClass = (e) => {
      e.stopPropagation();
      el.classList.remove(binding.value);
    };

    // 将事件处理函数挂载到元素上，方便后续移除
    el._hoverClassAdd = addClass;
    el._hoverClassRemove = removeClass;

    // 绑定鼠标移入和移出事件
    el.addEventListener('pointerenter', addClass);
    el.addEventListener('pointerleave', removeClass);
    window.addEventListener('touchend', removeClass);
  },
  unmounted(el) {
    el.removeEventListener('pointerenter', el._hoverClassAdd);
    el.removeEventListener('pointerleave', el._hoverClassRemove);
    window.removeEventListener('touchend', el._hoverClassRemove);
    delete el._hoverClassAdd;
    delete el._hoverClassRemove;
  }
};
