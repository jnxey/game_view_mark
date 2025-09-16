// directives/trim.js
export default {
  mounted(el) {
    const input = el.querySelector('.el-input__inner');
    if (!!input) {
      const handler = (e) => {
        e.target.value = e.target.value.trim();
        input.dispatchEvent(new Event('input')); // 触发数据更新
      };
      input.addEventListener('blur', handler);
      el._trimHandler = handler;
    }
  },
  beforeUnmount(el) {
    if (el._trimHandler) {
      const input = el.querySelector('.el-input__inner');
      input.removeEventListener('blur', el._trimHandler);
    }
  }
};
