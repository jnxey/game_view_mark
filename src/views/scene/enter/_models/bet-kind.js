import { mappingArrayToObject } from '@/tools';
import { computed, ref } from 'vue';

export function useBetKind(getGameKind) {
  // 当前选中-顶级
  const currentKindTop = ref(null);
  // 当前选中-子集
  const currentKindSub = ref([]);
  // 配置项map
  const gameKindMap = computed(() => mappingArrayToObject(getGameKind() ?? []));

  // 设置当前顶级配置项选中-顶级
  const updateCurrentKindTop = (value) => {
    currentKindTop.value = value;
  };

  // 设置当前顶级配置项选中-子集
  const updateCurrentKindSub = (value) => {
    currentKindSub.value = value;
  };

  return { currentKindTop, currentKindSub, gameKindMap, updateCurrentKindTop, updateCurrentKindSub };
}
