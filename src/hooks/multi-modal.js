import { nextTick, reactive } from 'vue';

// 返回多开类型
export function useMultipleModal() {
  const temp = { name: 'multiple_modal_', id: null, vm: null, transform: null, zIndex: 2000, type: null };
  const modalList = reactive([]);

  // 设置多开弹窗示例
  const setEditForm = (vm, index) => {
    modalList[index].vm = vm;
  };

  // 寻找关闭form，并打开（没有则新增）
  const findModalAble = async (id, type) => {
    for (let i = 0; i < modalList.length; i++) {
      if (modalList[i].id === id) return i;
    }
    for (let i = 0; i < modalList.length; i++) {
      const typeMatch = !type ? true : modalList[i].vm?.type === type;
      if (!modalList[i].vm?.visible && typeMatch) return i;
    }
    modalList.push({ ...temp, name: temp.name + modalList.length, type: type });
    return nextTick().then(() => modalList.length - 1);
  };

  // 重置层级
  const resetZIndex = (index) => {
    modalList[index].zIndex = findMaxZIndex(modalList[index].zIndex, modalList[index].name);
    modalList[index] = { ...modalList[index] };
  };

  // 寻找当前层级最高的元素
  const findMaxZIndex = (init, self) => {
    let max = init;
    modalList.forEach((item) => {
      if (self === item.name) return;
      if (item.zIndex >= max) max = item.zIndex + 1;
    });
    return max;
  };

  // 获取实例
  const getModalVM = (key) => {
    return modalList[key].vm;
  };

  // 设置弹窗显示
  const setModalShow = (key, index, id) => {
    modalList[key].id = id;
    modalList[key].zIndex = findMaxZIndex(temp.zIndex);
    modalList[key].transform = getEditFormOffset(index);
  };

  // 获取层级显示偏移量
  const getEditFormOffset = (index) => {
    if (!index) return { x: 0, y: 0 };
    const value = index * 20;
    return { x: value, y: value };
  };

  // 获取弹窗类型
  const getTypeId = (type, id) => {
    return type + '_' + id;
  };

  return { modalList, setEditForm, findModalAble, resetZIndex, findMaxZIndex, getEditFormOffset, getModalVM, setModalShow, getTypeId };
}
