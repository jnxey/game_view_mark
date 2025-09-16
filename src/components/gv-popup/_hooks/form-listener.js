import { nextTick, ref } from 'vue';
import { isArray } from '@/tools';

// 监听表单变更
export function useFormListener(id) {
  const formChangeStatus = ref(false);

  const changeFn = (event) => {
    console.log('值已更改', event);
    formChangeStatus.value = true;
  };

  const addListener = async () => {
    await nextTick();
    formChangeStatus.value = false;
    const target = document.getElementById(id);
    // input
    const iItems = Array.from(target?.querySelectorAll('.el-input input') ?? []);
    iItems.forEach((item) => {
      item.addEventListener('change', changeFn);
    });
    // select
    const sItems = Array.from(target?.querySelectorAll('.el-select') ?? []);
    sItems.forEach((item) => {
      item.addEventListener('click', changeFn);
    });
    // switch
    const swItems = Array.from(target?.querySelectorAll('.el-switch') ?? []);
    swItems.forEach((item) => {
      item.addEventListener('click', changeFn);
    });
    // radio
    const rItems = Array.from(target?.querySelectorAll('.el-radio') ?? []);
    rItems.forEach((item) => {
      item.addEventListener('click', changeFn);
    });
  };

  const removeListener = async () => {
    formChangeStatus.value = false;
    const target = document.getElementById(id);
    // input
    const iItems = Array.from(target?.querySelectorAll('.el-input input') ?? []);
    iItems.forEach((item) => {
      item.removeEventListener('change', changeFn);
    });
    // select
    const sItems = Array.from(target?.querySelectorAll('.el-select') ?? []);
    sItems.forEach((item) => {
      item.removeEventListener('click', changeFn);
    });
    // switch
    const swItems = Array.from(target?.querySelectorAll('.el-switch') ?? []);
    swItems.forEach((item) => {
      item.removeEventListener('click', changeFn);
    });
    // radio
    const rItems = Array.from(target?.querySelectorAll('.el-radio') ?? []);
    rItems.forEach((item) => {
      item.removeEventListener('click', changeFn);
    });
  };

  return { formChangeStatus, addListener, removeListener };
}
