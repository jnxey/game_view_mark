import DOMPurify from 'dompurify';

export default {
  updated(el, binding) {
    // 响应数据变化
    if (binding.value !== binding.oldValue) {
      // 避免不必要的更新
      el.innerHTML = DOMPurify.sanitize(binding.value);
    }
  },
  mounted(el, binding) {
    el.innerHTML = DOMPurify.sanitize(binding.value);
  }
};
