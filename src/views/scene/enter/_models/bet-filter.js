import { computed } from 'vue';
import { GAME_INSURANCE_TYPE, GAME_KIND_CALC, GAME_KIND_LEVEL } from '@/values';
import { mappingArrayToObject } from '@/tools';

// 过滤投注项信息
export function useBetBaseFilter(getGameKind, getGameConfig, getGameCompose) {
  // 初始化支持的gameKind
  const gameKindSelect = computed(() => {
    const gameConfig = getGameConfig() ?? [];
    const result = {};
    gameConfig.forEach((item) => {
      result[item.game_kind_id] = true;
    });
    return result;
  });

  // 支持的gameKind
  const gameKindFilter = computed(() => {
    const gameKind = getGameKind() ?? [];
    const select = gameKindSelect.value ?? [];
    return gameKind.filter((val) => select[val.id]);
  });

  // 过滤组合配置信息
  const filterCompose = computed(() => {
    const gameCompose = getGameCompose() ?? {};
    const compose = gameCompose ?? {};
    const select = gameKindSelect.value ?? [];
    const result = {};
    Object.keys(compose).forEach((topId) => {
      topId = Number(topId);
      if (!select[topId]) return;
      const cResult = [];
      const cList = compose[topId]?.composeList ?? [];
      cList.forEach((item) => {
        if (select[item.id] && select[item.pid]) {
          cResult.push(item);
        }
      });
      result[topId] = { composeList: cResult, opposeList: compose[topId]?.opposeList ?? [] };
    });
    return result;
  });

  // 计算类型为子集的子集
  const subCalcTypeMap = computed(() => {
    const gameKind = getGameKind() ?? [];
    const parent = {};
    const result = {};
    gameKind.forEach((item) => {
      if (item.sub_calc === GAME_KIND_CALC.sub) parent[item.id] = true;
    });
    const compose = filterCompose.value ?? {};
    Object.keys(compose).forEach((topId) => {
      const cList = compose[topId]?.composeList ?? [];
      cList.forEach((item) => {
        if (parent[item.pid]) result[item.id] = item.pid;
      });
    });
    return result;
  });

  return { gameKindSelect, gameKindFilter, filterCompose, subCalcTypeMap };
}

// 获取投注项选项
export function useBetKindFilter(getGameKind, getCompose, getCurrentTop, getCurrentSub) {
  // 顶级配置项列表
  const gameKindTop = computed(() => {
    const gameKind = getGameKind();
    return gameKind?.filter((val) => val.is_top === GAME_KIND_LEVEL.top);
  });

  // 配置项Map
  const gameKindMap = computed(() => mappingArrayToObject(getGameKind()));

  // 显示可选择的子集
  const gameKindTopSub = computed(() => {
    const kindMap = gameKindMap.value ?? {};
    const gameCompose = getCompose() ?? {};
    const currentSub = getCurrentSub();
    const currentTop = getCurrentTop();
    const compose = gameCompose[currentTop]?.composeList ?? [];
    const subs = currentSub ?? [];
    const result = [];
    compose.forEach((item) => {
      if (kindMap[item.id]?.is_insurance_allowed === GAME_INSURANCE_TYPE.insurance) return;
      if (item.pid === currentTop) result.push(item.id); // 顶级
      if (subs.includes(item.pid)) result.push(item.id); // 选中子集
    });
    return result;
  });

  // 禁用的子集配置项
  const disabledSubKind = computed(() => {
    const gameCompose = getCompose() ?? {};
    const currentSub = getCurrentSub();
    const currentTop = getCurrentTop();
    const oppose = gameCompose[currentTop]?.opposeList ?? [];
    const subs = currentSub ?? [];
    const result = [];
    oppose.forEach((group) => {
      let check = false;
      const cResult = [];
      group.forEach((kid) => {
        if (subs.includes(kid)) check = true;
        else cResult.push(kid);
      });
      if (check) result.push(...cResult);
    });
    return mappingArrayToObject(result, null);
  });

  return { gameKindTop, gameKindTopSub, disabledSubKind };
}
