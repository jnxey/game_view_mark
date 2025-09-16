import { computed, ref, shallowRef } from 'vue';

export function useHistory() {
  const history = shallowRef([]); // 存储所有操作状态
  const current = ref(-1); // 当前状态索引
  const maxSteps = 200; // 最大历史记录数

  const disabledUndo = computed(() => current.value <= -1); // 回退是否禁用
  const disabledRedo = computed(() => current.value >= history.value.length - 1);

  // 获取当前状态值
  const getCurrentState = () => {
    return history.value[current.value];
  };

  // 添加新操作（自动清除后续历史）
  const push = (state) => {
    history.value = history.value.slice(0, current.value + 1);
    // 限制历史记录数量
    if (history.value.length >= maxSteps.value) {
      history.value.shift(); // 移除最旧记录
      current.value = current.value - 1;
    }
    // 添加新记录
    history.value.push(state);
    current.value = current.value + 1;
  };

  // 撤销操作（后退）
  const undo = () => {
    if (current.value >= 0) {
      current.value = current.value - 1;
      return getCurrentState();
    }
    return null;
  };

  // 重做操作（前进）
  const redo = () => {
    if (current.value < history.value.length - 1) {
      current.value = current.value + 1;
      return getCurrentState();
    }
    return null;
  };

  return { history, current, disabledUndo, disabledRedo, push, undo, redo };
}
