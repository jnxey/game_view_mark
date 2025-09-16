export default {
  mounted(el, binding) {
    let pressTimer = null;
    let pressTarget = null;

    // 解析参数
    const { handler, duration } = parseBinding(binding);

    // 创建事件处理函数
    const start = (e) => {
      // 排除右键点击
      if (e.type === 'mousedown' && e.button !== 0) return;
      if (!e.target.classList.contains('v-press-target')) return;

      // 阻止默认行为和冒泡
      e.preventDefault();
      // e.stopPropagation();

      // 记录触发目标
      pressTarget = e.target;

      // 清除已有定时器
      clearTimeout(pressTimer);

      // 设置新定时器
      pressTimer = setTimeout(() => {
        handler(e);
        pressTarget = null;
      }, duration);
    };

    const cancel = (e) => {
      // 如果目标元素不一致时忽略
      if (e.target !== pressTarget) return;

      clearTimeout(pressTimer);
      pressTarget = null;
    };

    // 添加事件监听
    el.addEventListener('mousedown', start);
    el.addEventListener('mouseup', cancel);
    el.addEventListener('mouseleave', cancel);

    el.addEventListener('touchstart', start);
    el.addEventListener('touchend', cancel);
    el.addEventListener('touchcancel', cancel);

    // 保存引用以便卸载
    el._longPressHandlers = { start, cancel };
  },

  unmounted(el) {
    const { start, cancel } = el._longPressHandlers || {};
    if (start) {
      el.removeEventListener('mousedown', start);
      el.removeEventListener('touchstart', start);
    }
    if (cancel) {
      el.removeEventListener('mouseup', cancel);
      el.removeEventListener('mouseleave', cancel);

      el.removeEventListener('touchend', cancel);
      el.removeEventListener('touchcancel', cancel);
    }
  }
};

function parseBinding(binding) {
  let handler,
    duration = 800;

  if (typeof binding.value === 'function') {
    handler = binding.value;
  } else {
    handler = binding.value.handler;
    duration = binding.value.duration || duration;
  }

  if (typeof handler !== 'function') {
    console.warn('v-longpress 需要绑定一个函数');
  }

  return { handler, duration };
}
