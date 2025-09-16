<template>
  <gv-popup
    ref="popupRef"
    :title="title || $t('game_data.bet_open.title_edit')"
    :async="true"
    width="550px"
    @confirm="handleSubmit"
    @close="handleClose"
  >
    <div v-if="gameConfig && gameKind && gameCompose" class="result-wrap">
      <div class="flex-row flex-wrap">
        <template v-for="item in gameKindTop" :key="item.id">
          <gv-scene-button-simple
            class="mr-8 mb-8"
            :color="getKindColor(item.icon)"
            type="simple"
            :active="currentKindTop === item.id"
            @click="setCurrentKindTop(item)"
          >
            {{ $ti(item.name) }}
          </gv-scene-button-simple>
        </template>
      </div>
      <div class="flex-row flex-wrap">
        <template v-if="!!gameKindTopSub.length">
          <template v-for="kid in gameKindTopSub" :Key="kid">
            <gv-scene-button-simple
              class="mr-8 mb-8"
              type="primary"
              v-if="gameKindMap[kid]"
              :color="getKindColor(gameKindMap[kid].icon)"
              :active="currentKindSubMap[kid]"
              @click="setCurrentKindSub(kid)"
            >
              {{ $ti(gameKindMap[kid].name) }}
            </gv-scene-button-simple>
          </template>
        </template>
      </div>
    </div>
  </gv-popup>
</template>
<script setup>
import { betOpenSet } from '@/api/game-data/bet-open';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, ref, shallowRef, toRaw } from 'vue';
import layer from '@/tools/layer';
import { checkIndexArray, deepClone, findAllChildren, getJSON, isFunction, mappingArrayToObject } from '@/tools';
import { gameKindComposeGet, gameKindLists } from '@/api/game/kind';
import { gameConfigLists } from '@/api/game/list';
import { GAME_KIND_CALC, GAME_KIND_LEVEL, QUERY_LIST_TYPE } from '@/values';
import { useBetBaseFilter, useBetKindFilter } from '@/views/scene/enter/_models/bet-filter';
import { getKindColor } from '@/views/scene/enter/_models/kind-color';
import GvSceneButtonSimple from '@/views/scene/enter/_components/gv-scene-button/simple.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const placeValue = 0;

const emit = defineEmits(['success', 'close']);

const props = defineProps({ submitFn: Function, title: String });

const popupRef = shallowRef();
const gameConfig = shallowRef();
const gameKind = shallowRef();
const gameCompose = shallowRef();

// 当前选中-顶级
const currentKindTop = ref(null);
// 当前选中-子集
const currentKindSub = ref([]);
// 当前开牌信息
const currentInfo = shallowRef();

// 配置项map
const gameKindMap = computed(() => mappingArrayToObject(gameKind.value ?? []));

// 选中子集的map
const currentKindSubMap = computed(() => mappingArrayToObject(currentKindSub.value, null));

// 获取过滤的数据
const { gameKindFilter, filterCompose } = useBetBaseFilter(
  () => gameKind.value,
  () => gameConfig.value,
  () => gameCompose.value
);

// 获取顶级选项，子集选项
const { gameKindTop, gameKindTopSub } = useBetKindFilter(
  () => gameKindFilter.value,
  () => filterCompose.value,
  () => currentKindTop.value,
  () => currentKindSub.value
);

const open = async (row) => {
  layer.loading();
  await getGameInfo(row);
  layer.closeLoading();
  initCurrentKind(row.bet_result || []);
  currentInfo.value = toRaw(row);
  popupRef.value?.open();
};

// 初始化配置项选中
const initCurrentKind = (result) => {
  const map = gameKindMap.value;
  const subs = [];
  let top = null;
  result.forEach((id) => {
    if (map[id]?.is_top === GAME_KIND_LEVEL.top) top = id;
    else subs.push(id);
  });
  // 补充计算类型为子项的ID
  const suffix = [];
  const composeList = filterCompose.value[top]?.composeList ?? [];
  const composeMap = mappingArrayToObject(composeList);
  subs.forEach((id) => {
    const pid = composeMap[id]?.pid;
    if (map[pid] && map[pid]?.sub_calc === GAME_KIND_CALC.sub) suffix.push(pid);
  });
  subs.push(...suffix);
  // 设置值
  currentKindTop.value = top;
  currentKindSub.value = subs;
};

// 获取游戏信息
const getGameInfo = async (row) => {
  const res1 = await gameConfigLists({ game_id: row.game_id, page_type: QUERY_LIST_TYPE.all });
  gameConfig.value = res1.lists;
  const res2 = await gameKindLists({ page_type: QUERY_LIST_TYPE.all });
  gameKind.value = res2.lists;
  const res3 = await gameKindComposeGet({ page_type: QUERY_LIST_TYPE.all });
  const info = res3.lists?.[0] ?? {};
  info.content = getJSON(info.content, {});
  gameCompose.value = info.content;
  if (!gameConfig.value?.length) layer.msgError($t('game_data.bet_open.tips_no_kind'));
};

// 设置顶级配置项选中
const setCurrentKindTop = (item) => {
  currentKindTop.value = currentKindTop.value === item.id ? null : item.id;
  currentKindSub.value = [];
};

// 选中子集
const setCurrentKindSub = (kid) => {
  const subs = deepClone(currentKindSub.value ?? []);
  const composeList = filterCompose.value[currentKindTop.value]?.composeList ?? [];
  const opposeList = filterCompose.value[currentKindTop.value]?.opposeList;
  const key = subs.findIndex((val) => val === kid);
  const exclude = [];
  // 移除此项及其子项
  const eChildren = (value) => {
    const k = subs.indexOf(value);
    if (checkIndexArray(k)) {
      subs.splice(k, 1);
      const allKid = findAllChildren(composeList, value);
      allKid.forEach(({ id }) => {
        const k = subs.indexOf(id);
        if (checkIndexArray(k)) subs.splice(k, 1);
      });
    }
  };
  if (checkIndexArray(key)) {
    eChildren(kid);
  } else {
    subs.push(kid);
    // 移除排斥的项
    opposeList.forEach((oppose) => {
      const k = oppose.indexOf(kid);
      if (checkIndexArray(k)) exclude.push(...oppose.filter((val) => val !== kid));
    });
    exclude.forEach((id) => eChildren(id));
  }
  currentKindSub.value = subs;
};

// 获取开牌子项
const getKindSubFormat = () => {
  const map = gameKindMap.value ?? {};
  const compose = filterCompose.value[currentKindTop.value]?.composeList ?? [];
  const subCalc = {};
  const betSubs = [];
  const mapKinds = [];
  let checkSub = true;
  const selected = deepClone(currentKindSub.value ?? []);
  selected.forEach((kid) => {
    // current.push(kid);
    if (map[kid]?.sub_calc === GAME_KIND_CALC.sub) subCalc[kid] = placeValue;
    else betSubs.push(kid); // 子项也要传
    // 添加mapKinds
    if (map[kid]?.sub_calc === GAME_KIND_CALC.sub) {
      const allKid = findAllChildren(compose, kid);
      mapKinds.push({ pid: kid, sub: allKid.map((val) => val.id) });
    }
  });
  selected.forEach((kid) => {
    compose.forEach((com) => {
      if (subCalc[com.pid] === placeValue && kid === com.id) subCalc[com.pid] = com.id;
    });
  });
  Object.keys(subCalc).forEach((p) => {
    if (subCalc[p] === placeValue) checkSub = false;
  });
  return { betSubs, mapKinds, checkSub };
};

// 提交
const handleSubmit = async () => {
  if (!currentKindTop.value) return layer.msgError($t('game_data.bet_open.tips_select_result'));
  const { betSubs, mapKinds, checkSub } = getKindSubFormat();
  if (!checkSub) return layer.msgError($t('scene.enter.tips_check_map_kinds'));
  const params = { id: currentInfo.value.id, bet_result: [...betSubs, currentKindTop.value], map_kinds: mapKinds };
  if (isFunction(props.submitFn)) {
    popupRef.value?.close();
    return props.submitFn(params);
  }
  layer.loading();
  await betOpenSet(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.result-wrap {
  padding: 20px;
  background-image: radial-gradient(circle farthest-corner at left top, #0a1935, transparent);
}
</style>
