<template>
  <div class="desk-road">
    <baccarat v-if="GAME_MODEL_TYPE_BACCARAT.includes(gameInfo?.game_model)" ref="baccaratRef" />
    <niu-niu v-else-if="gameInfo?.game_model === GAME_MODEL.niu_niu" ref="niuniuRef" />
    <div v-else class="fz-24 text-placeholder p-16">{{ $t('desk.road.empty_tips') }}</div>
    <exit-to-main />
  </div>
</template>
<script>
export default { name: 'no-cache-desk-road' };
</script>
<script setup>
import { computed, nextTick, onBeforeMount, provide, shallowRef } from 'vue';
import { useBetBase } from '@/views/scene/enter/_models/bet-base';
import { useRoute } from 'vue-router';
import Baccarat from './baccarat/index.vue';
import NiuNiu from './niuniu/index.vue';
import { GAME_KIND_MARK_DICT, GAME_MODEL, GAME_MODEL_TYPE_BACCARAT } from '@/values';
import { mappingArrayToObject, parseDict } from '@/tools';
import { isTop } from '@/views/game/_models';
import { useWebsocket } from '@/hooks/websocket';
import { EVENTS_SCENE_PUSH_DESK } from '@/values/events';
import ExitToMain from '@/views/desk/_components/exit-to-main.vue';
import { $t } from '@/lang/i18n';

const markMap = parseDict(GAME_KIND_MARK_DICT);

const route = useRoute();
const baccaratRef = shallowRef();
const niuniuRef = shallowRef();
const tableId = computed(() => Number(route.query.id));

// 基础信息
const {
  openingInfo,
  gameInfo,
  tableInfo,
  gameKind,
  gameConfig,
  currentBootRecord,
  refreshOpeningInfo,
  refreshTableInfo,
  refreshGameInfo,
  refreshGameKind,
  refreshCurrentBoot,
  refreshGameConfig
} = useBetBase(() => tableId.value);

// 初始化支持的gameKind
const gameKindSelect = computed(() => {
  const config = gameConfig.value ?? [];
  const result = {};
  config.forEach((item) => {
    result[item.game_kind_id] = true;
  });
  return result;
});

// 配置项-map
const gameKindMap = computed(() => mappingArrayToObject(gameKind.value));

// 处理结果信息
const formatBetResult = (item) => {
  const result = { ...item };
  const map = gameKindMap.value ?? {};
  result?.bet_result.forEach((kindId) => {
    if (isTop(map[kindId]?.is_top)) {
      result.value = map[kindId].card_pattern;
      result.color = markMap[result.value]?.color;
      result.name = markMap[result.value]?.name;
    }
  });
  return result;
};

// 拉取信息
const getBaseInfo = async () => {
  await refreshTableInfo();
  await refreshGameInfo();
  await refreshGameConfig();
  await refreshGameKind();
  //
  await refreshOpeningInfo();
  await refreshCurrentBoot();

  await nextTick();
  const list = [];
  currentBootRecord.value?.forEach((item) => {
    if (!item?.bet_result) return;
    if (GAME_MODEL_TYPE_BACCARAT.includes(gameInfo.value.game_model)) list.push(formatBetResult(item));
    else list.push(item);
  });
  if (GAME_MODEL_TYPE_BACCARAT.includes(gameInfo.value.game_model)) {
    baccaratRef.value?.resetRoadData(list);
  } else if (gameInfo.value.game_model === GAME_MODEL.niu_niu) {
    niuniuRef.value?.resetRoadData(list);
  }
};

const wsRisk = { room: 'broadcast', action: 'broadcastBetResult', refresh: ['broadcastNewBoot', 'broadcastBetResultModify'] };
useWebsocket(wsRisk.room, (message) => {
  if (message.type === EVENTS_SCENE_PUSH_DESK) {
    if (message.table_id !== tableId.value) return;
    if (GAME_MODEL_TYPE_BACCARAT.includes(gameInfo.value.game_model)) {
      baccaratRef.value?.syncRoadData(formatBetResult(message));
    }
  } else {
    if (wsRisk.refresh.includes(message.type)) getBaseInfo();
    if (message.type !== wsRisk.action) return;
    if (message.table_id !== tableId.value) return;
    refreshOpeningInfo();
    if (GAME_MODEL_TYPE_BACCARAT.includes(gameInfo.value.game_model)) {
      baccaratRef.value?.addRoadData(formatBetResult(message));
    } else if (gameInfo.value.game_model === GAME_MODEL.niu_niu) {
      niuniuRef.value?.addRoadData({ ...message });
    }
  }
});

onBeforeMount(async () => {
  getBaseInfo();
});

provide('tableInfo', tableInfo);
provide('gameInfo', gameInfo);
provide('gameKind', gameKind);
provide('gameKindMap', gameKindMap);
provide('openingInfo', openingInfo);
provide('gameKindSelect', gameKindSelect);
provide('currentBootRecord', currentBootRecord);
</script>
