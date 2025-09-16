import { isArray, isEmpty } from '@/tools';

function checkPlaceholder(el, empty, placeholder, contentSelector) {
  const content = el?.querySelector(contentSelector);
  if (!placeholder) return;
  if (empty) {
    const target = el.querySelector('.placeholder-dom');
    if (!target || target.classList.contains('remove')) return;
    target.classList.add('remove');
    content.style.opacity = 0;
    setTimeout(() => {
      el.removeChild(target);
      content.style.opacity = 1;
    }, 300);
  } else {
    const target = el.querySelector('.placeholder-dom');
    if (target) return;
    const dom = document.createElement('div');
    dom.classList.add('placeholder-dom');
    dom.textContent = placeholder;
    el.appendChild(dom);
  }
}

// 处理顶部提示
function execUpdate(el, vnode) {
  // 获取组件实例
  const input = el.querySelector('.el-input__inner');
  const select = el.querySelector('.el-select__wrapper');
  const dataRange = el.querySelector('.gv-date-mark');
  const textarea = el.querySelector('.el-textarea__inner');
  const component = vnode.ctx?.props ?? vnode.ctx?.$props ?? {};
  if (dataRange) {
    const contentSelector = '.show-value';
    const newValue = el.getAttribute('data-end-value');
    checkPlaceholder(el, isEmpty(newValue), component.placeholder, contentSelector);
  } else if (!!input) {
    const contentSelector = 'input';
    const newValue = component.modelValue;
    checkPlaceholder(el, isEmpty(newValue) || (isArray(newValue) && !newValue.length), component.placeholder, contentSelector);
  } else if (!!select) {
    const contentSelector = '.el-select__selected-item.el-select__placeholder';
    const newValue = component.modelValue;
    checkPlaceholder(el, isEmpty(newValue) || (isArray(newValue) && !newValue.length), component.placeholder, contentSelector);
  } else if (!!textarea) {
    const contentSelector = 'textarea';
    const newValue = component.modelValue;
    checkPlaceholder(el, isEmpty(newValue) || (isArray(newValue) && !newValue.length), component.placeholder, contentSelector);
  }
}

export default {
  mounted(el, binding, vnode) {
    if (binding.value === false) return;
    execUpdate(el, vnode);
  },
  updated(el, binding, vnode) {
    if (binding.value === false) return;
    execUpdate(el, vnode);
  },
  beforeUnmount(el) {}
};
