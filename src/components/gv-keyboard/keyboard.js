import { reactive, ref, shallowRef, watch } from 'vue';
import { getPX, getTextWidth } from '@/tools';
import { popoverPosition } from '@/tools/popover-position';

// 键盘特殊值
export const KEYBOARD_SPECIAL = { horizontalBar: '-', point: '.', space: 'space', delete: 'delete' };

// 使用虚拟键盘
export function useVKeyboard(getApply) {
  let timerAnimate = null;

  // 键盘偏移量
  const offsetSize = 10;

  // 默认键盘尺寸
  const keyboardSize = { width: 360, height: 283 };

  // 键盘显示状态
  const keyboardState = reactive({ show: false, position: null });

  // 当前获取焦点的键盘元素
  const keyboardElement = shallowRef();

  // 当前获取焦点的键盘元素-内容值
  const keyboardElementValue = ref('');

  // 显示键盘
  function showKeyboard() {
    if (!getApply()) return;
    keyboardState.show = true;
    updateKeyboardElementValue();
  }

  // 隐藏键盘
  function hideKeyboard() {
    keyboardState.show = false;
  }

  // 设置输入框的值
  function setKeyboardValue(key) {
    if (!keyboardElement.value) return;
    const currentInput = keyboardElement.value;
    const currentValue = currentInput.value ?? '';
    if (key === KEYBOARD_SPECIAL.delete) {
      currentInput.value = currentValue.slice(0, -1);
    } else if (key === KEYBOARD_SPECIAL.space) {
      currentInput.value += ' ';
    } else {
      currentInput.value += key;
    }
    const event = new Event('input', { bubbles: true });
    currentInput.dispatchEvent(event);
    updateKeyboardElementValue();
  }

  // 更新输入框的值
  function updateKeyboardElementValue() {
    const input = keyboardElement.value;
    if (!input) return (keyboardElementValue.value = '');
    keyboardElementValue.value = input.value;
  }

  // 设置键盘位置
  function setKeyboardPosition(value) {
    keyboardState.position = value;
  }

  // 获取焦点-通用事件处理函数
  function handleFocusEvent(event) {
    const target = event.target;
    if (!target) return;
    const targetWrap = getKeyboardWrap(target);
    targetWrap.classList.add('v-keyboard-focus');
    timerAnimate = setTimeout(() => {
      // 其他操作（如显示虚拟键盘）
      targetWrap.classList.add('v-keyboard-cursor-show');
      const rect = target.getBoundingClientRect();
      keyboardElement.value = target;
      const popover = popoverPosition(rect, keyboardSize);
      const position = { x: popover.coordinates.left, y: popover.coordinates.top };
      if (popover.position === 'top') position.y = position.y - offsetSize;
      if (popover.position === 'bottom') position.y = position.y + offsetSize;
      if (popover.position === 'left') position.x = position.x - offsetSize;
      if (popover.position === 'right') position.x = position.x + offsetSize;
      setKeyboardPosition(position);
      showKeyboard();
      setKeyboardCursor();
    }, 300);
  }

  // 失去焦点-通用事件处理函数
  function handleBlurEvent(event) {
    const target = event.target;
    if (!target) return;
    keyboardElement.value = null;
    hideKeyboard();
    const targetWrap = getKeyboardWrap(target);
    targetWrap.classList.remove('v-keyboard-focus');
    targetWrap.classList.remove('v-keyboard-cursor-show');
    target.dispatchEvent(new Event('change', { bubbles: true })); // 适配input number
    clearTimeout(timerAnimate);
  }

  // 获取wrap
  function getKeyboardWrap(el) {
    const wrap = el.parentNode;
    const wrapDou = wrap?.parentNode;
    const wrapThr = wrap?.parentNode?.parentNode;
    if (wrap.classList.contains('v-keyboard-wrap')) {
      return wrap;
    }
    if (wrapDou.classList.contains('v-keyboard-wrap')) {
      return wrapDou;
    }
    if (wrapThr.classList.contains('v-keyboard-wrap')) {
      return wrapThr;
    }
  }

  // 获取同样长度的密码占位符号
  function getPwdPlace(len) {
    let result = '';
    Array.from({ length: len }).forEach(() => {
      result += '•';
    });
    return result;
  }

  // 设置光标
  function setKeyboardCursor() {
    if (!keyboardElement.value) return;
    const input = keyboardElement.value;
    const type = input.getAttribute('type');
    let inputValue = keyboardElementValue.value;
    if (type === 'password') {
      inputValue = getPwdPlace(inputValue.length);
    }
    const wrap = getKeyboardWrap(input);
    const cursor = wrap?.querySelector('.v-keyboard-cursor');
    const inputHeight = input.clientHeight;
    const inputWidth = input.clientWidth;
    const cursorHeight = cursor.clientHeight;
    if (!input || !cursor) return;
    const inputOffset = input.offsetLeft;
    const textWidth = getTextWidth(inputValue, input) + inputOffset + 2;

    if (textWidth > inputWidth) {
      cursor.style.opacity = 0;
    } else {
      cursor.style.opacity = 1;
      const offset = Math.floor((inputHeight - cursorHeight) / 2);
      cursor.style.left = getPX(textWidth);
      cursor.style.top = getPX(offset);
    }
  }

  // 监听虚拟键盘启动-并处理元素类
  function watchKeyboard() {
    // 设置现有 input
    setAllInputsReadonly();

    // 创建观察器监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (getApply() && !!mutation.addedNodes.length) setAllInputsReadonly();
      });
    });

    // 监听整个文档的 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 设置 readonly 的函数
    function setAllInputsReadonly() {
      document.querySelectorAll('.v-keyboard-wrap').forEach((wrap) => {
        // 添加input虚拟键盘类
        const classList = wrap.querySelector('input').classList;
        if (!classList.contains('v-keyboard')) classList.add('v-keyboard');
        // 添加光标元素
        const cursor = wrap.querySelector('.v-keyboard-cursor');
        if (!cursor) {
          const dom = document.createElement('div');
          dom.classList.add('v-keyboard-cursor');
          wrap.appendChild(dom);
        }
      });
      document.querySelectorAll('.v-keyboard').forEach((input) => {
        if (getApply()) {
          if (!input.hasAttribute('readonly')) input.setAttribute('readonly', 'readonly');
        } else {
          if (input.hasAttribute('readonly')) input.removeAttribute('readonly');
        }
      });
    }

    watch(
      getApply,
      () => {
        setAllInputsReadonly();
      },
      { immediate: true }
    );
  }

  // 初始化键盘监听器
  function initKeyboardListener() {
    document.addEventListener(
      'focus',
      function (e) {
        if (!getApply()) return;
        const target = e.target;
        if (target.classList.contains('v-keyboard')) {
          handleFocusEvent(e);
        }
      },
      true
    );
    document.addEventListener(
      'blur',
      function (e) {
        if (!getApply()) return;
        const target = e.target;
        if (target.classList.contains('v-keyboard')) {
          handleBlurEvent(e);
        }
      },
      true
    );

    // 设置光标位置
    watch(
      () => keyboardElementValue.value,
      () => setKeyboardCursor()
    );

    watchKeyboard();
  }

  return { keyboardState, showKeyboard, hideKeyboard, setKeyboardValue, initKeyboardListener };
}
