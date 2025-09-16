<template>
  <div class="scene-enter-page">
    <div class="scene-enter-content" v-if="initSuccess">
      <pannel-left />
      <pannel-content />
      <pannel-right />
      <slide-button class="left-toggle-button" direction="left" :is-show="panelLeftShow" @click="togglePanelLeft" />
      <slide-button v-if="!hideRightButton" class="right-toggle-button" direction="right" :is-show="panelRightShow" @click="togglePanelRight" />
      <slide-button class="top-toggle-button" direction="top" :is-show="panelContentTop" @click="togglePanelTop" />
    </div>
    <div class="bg-wrap">
      <img src="@/assets/images/scene/enter-bg.jpg" alt="" />
    </div>
    <div v-if="panelShowMark" class="mark-bg" />
  </div>
  <bet-record ref="betRecordRef" />
  <bet-baccarat-road ref="betBaccaratRoadRef" @success="refreshCurrentBoot" />
  <bet-niuniu-road ref="betNiuniuRoadRef" @success="refreshCurrentBoot" />
  <table-check ref="tableCheckRef" />
  <table-close ref="tableCloseRef" />
  <road-niuniu ref="roadNiuniuRef" />
  <scan-card v-if="isScanCard" ref="scanCardRef" />
</template>
<script setup>
import PannelLeft from '@/views/scene/enter/_components/pannel-left.vue';
import PannelContent from '@/views/scene/enter/_components/pannel-content.vue';
import PannelRight from '@/views/scene/enter/_components/pannel-right.vue';
import SlideButton from '@/views/scene/enter/_components/_components/slide-button.vue';
import {
  hideRightButton,
  panelContentTop,
  panelLeftShow,
  panelRightShow,
  panelShowMark,
  togglePanelLeft,
  togglePanelRight,
  togglePanelTop
} from '@/views/scene/enter/_models/enter-layout';
import { useRoute } from 'vue-router';
import { computed, onBeforeMount, provide, shallowRef, unref, watch } from 'vue';
import { mappingArrayToObject } from '@/tools';
import layer from '@/tools/layer';
import { setSystemState, systemState } from '@/store/system';
import GvIcon from '@/components/gv-icon/index.vue';
import { debounce } from 'throttle-debounce';
import { useBetBaseFilter } from '@/views/scene/enter/_models/bet-filter';
import eventManager from '@/tools/event-manager';
import { EVENTS_SCENE_OPENING_SET, EVENTS_SCENE_PUSH_DESK } from '@/values/events';
import BetRecord from '@/views/scene/enter/_components/_components/bet-record.vue';
import BetBaccaratRoad from '@/views/scene/enter/_components/_components/bet-baccarat-road.vue';
import TableCheck from '@/views/scene/enter/_components/_components/table-check.vue';
import TableClose from '@/views/scene/enter/_components/_components/table-close.vue';
import { useWebsocket } from '@/hooks/websocket';
import { useBetBase } from '@/views/scene/enter/_models/bet-base';
import { useBetPlayer } from '@/views/scene/enter/_models/bet-player';
import { useBetKind } from '@/views/scene/enter/_models/bet-kind';
import { useBetResult } from '@/views/scene/enter/_models/bet-result';
import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT, GAME_MODEL_TYPE_GENERAL } from '@/values';
import RoadNiuniu from '@/views/scene/enter/_components/_components/road-niuniu.vue';
import BetNiuniuRoad from '@/views/scene/enter/_components/_components/bet-niuniu-road.vue';
import { $t } from '@/lang/i18n';
import { toolsPushMessage } from '@/api/common';
import ScanCard from '@/views/scene/enter/_components/_components/scan-card.vue';

const route = useRoute();

const betRecordRef = shallowRef();
const betBaccaratRoadRef = shallowRef();
const betNiuniuRoadRef = shallowRef();
const tableCheckRef = shallowRef();
const tableCloseRef = shallowRef();
const roadNiuniuRef = shallowRef();
const scanCardRef = shallowRef();

// 基础信息
const {
  openingInfo,
  tableInfo,
  gameInfo,
  gameConfig,
  gameKind,
  gameCompose,
  gameCheck,
  currencyConfig,
  currencyBase,
  faceConfig,
  bonusList,
  bonusSetting,
  currentBootRecord,
  currentBootProfit,
  currentTableBase,
  refreshOpeningInfo,
  refreshTableInfo,
  refreshGameInfo,
  refreshGameConfig,
  refreshGameKind,
  refreshKindCompose,
  refreshGameCheck,
  refreshCurrencyConfig,
  refreshCurrencyBase,
  refreshFaceConfig,
  refreshCurrentBoot,
  refreshCurrentProfit,
  refreshCurrentTableBase,
  refreshBonusList
} = useBetBase(() => Number(route.query.id));

// 是否是百家乐
const isBaccarat = computed(() => GAME_MODEL_TYPE_BACCARAT.includes(gameInfo.value?.game_model));

// 是否是通用类-包括niu_niu,general
const isGeneral = computed(() => GAME_MODEL_TYPE_GENERAL.includes(gameInfo.value?.game_model));

// 牛牛类型
const isRoadNiuniu = computed(() => gameInfo.value?.game_model === GAME_MODEL.niu_niu);

// 是否可用摄像头扫牌
const isScanCard = computed(() => gameInfo.value?.game_model !== GAME_MODEL.general && !!tableInfo.value?.camera_info);

// 配置项
const { currentKindTop, currentKindSub, gameKindMap, updateCurrentKindTop, updateCurrentKindSub } = useBetKind(() => gameKind.value);

// 玩家信息
const { currentPlayer, currentPlayerCount, updateCurrentPlayer } = useBetPlayer();

// 开牌
const { openingLoading, currentOpenResult, formatCheckSubCalc, openCheck, openSet, updateCurrentOpenResult } = useBetResult(
  () => openingInfo.value,
  () => currentPlayer.value,
  () => gameInfo.value,
  () => gameKindMap.value,
  () => filterCompose.value,
  () => currentKindTop.value,
  () => currentKindSub.value,
  () => bonusSetting.value,
  () => isGeneral.value,
  () => isBaccarat.value,
  () => isRoadNiuniu.value,
  () => roadNiuniuRef.value,
  () => {
    refreshCurrentBoot();
    refreshCurrentProfit();
    refreshCurrentTableBase();
    refreshOpeningInfo();
    updateCurrentOpenResult(null);
    refreshBonusList();
    eventManager.emit(EVENTS_SCENE_OPENING_SET);
  }
);

// 初始化是否成功
const initSuccess = computed(() => {
  return (
    !!tableInfo.value &&
    !!gameInfo.value &&
    !!openingInfo.value &&
    !!gameConfig.value?.length &&
    !!gameKind.value &&
    !!gameCompose.value &&
    !!filterCompose.value &&
    !!currencyConfig.value?.length &&
    !!currencyBase.value?.length
  );
});

// 获取过滤的数据
const { gameKindFilter, filterCompose, subCalcTypeMap } = useBetBaseFilter(
  () => gameKind.value,
  () => gameConfig.value,
  () => gameCompose.value
);

// 监听table websocket
const listenerTable = () => {
  const wsTable = { room: 'table_' + route.query.id, action: 'bonusTotalUpdate' };
  useWebsocket(wsTable.room, (message) => {
    if (message.type !== wsTable.action) return;
    openingInfo.value = { ...unref(openingInfo), win_bonus_total: message.win_bonus_total };
  });
};

listenerTable(); // 监听

// 获取台/游戏信息
const getBaseInfo = async () => {
  await refreshTableInfo();
  await refreshGameInfo();
  await refreshOpeningInfo();
  refreshGameConfig().then(() => {
    if (!gameConfig.value?.length) layer.msgError($t('scene.enter.tips_no_game_config'));
  });
  refreshGameKind();
  refreshKindCompose();
  refreshCurrencyConfig().then(() => {
    if (!currencyConfig.value?.length) layer.msgError($t('scene.enter.tips_no_currency_config'));
  });
  refreshCurrencyBase();
  refreshFaceConfig();
  refreshCurrentBoot();
  refreshCurrentProfit();
  refreshCurrentTableBase();
  refreshBonusList();
  refreshGameCheck();
};

// 打开下注详情
const openBetRecord = () => {
  const info = tableInfo.value;
  const opening = openingInfo.value;
  const map = mappingArrayToObject(unref(currencyConfig));
  betRecordRef.value?.open({ table_id: info.id, game_id: info.game_id, boot_number: opening.boot_number }, map, unref(gameKindMap));
};

// 打开路珠修改
const openBaccaratBetRoad = () => {
  const info = tableInfo.value;
  const opening = openingInfo.value;
  betBaccaratRoadRef.value?.open({ table_id: info.id, game_id: info.game_id, boot_number: opening.boot_number });
};

// 打开牛牛路单
const openNiuniuBetRoad = () => {
  const info = tableInfo.value;
  const opening = openingInfo.value;
  betNiuniuRoadRef.value?.open({ table_id: info.id, game_id: info.game_id, boot_number: opening.boot_number });
};

// 打开点码
const openTableCheck = () => {
  const info = tableInfo.value;
  tableCheckRef.value?.open(info.id);
};

// 打开收码
const openTableClose = () => {
  const info = tableInfo.value;
  tableCloseRef.value?.open(info.id);
};

// 进入下一靴处理
const handleNextBoot = async () => {
  await refreshOpeningInfo();
  refreshCurrentTableBase();
  refreshCurrentBoot();
  updateCurrentOpenResult(null);
  refreshBonusList();
  eventManager.emit(EVENTS_SCENE_OPENING_SET);
};

// 打开进行扫牌
const openScanCard = async () => {
  scanCardRef.value?.show();
};

// 计算开牌结果-防抖
const openCheckDebounce = debounce(500, openCheck);

// 监听并计算开牌结果，以及推送消息
watch([() => currentKindTop.value, () => currentKindSub.value], async () => {
  openCheckDebounce();
  const result = !!currentKindTop.value ? [currentKindTop.value, ...currentKindSub.value] : [];
  await toolsPushMessage({ type: EVENTS_SCENE_PUSH_DESK, table_id: tableInfo.value?.id, bet_result: result });
});

onBeforeMount(async () => {
  await getBaseInfo();
});

// 基础信息
provide('openingInfo', openingInfo);
provide('tableInfo', tableInfo);
provide('gameInfo', gameInfo);
provide('gameConfig', gameConfig);
provide('gameKind', gameKind);
provide('gameCompose', gameCompose);
provide('gameCheck', gameCheck);
provide('currencyConfig', currencyConfig);
provide('currencyBase', currencyBase);
provide('faceConfig', faceConfig);
provide('bonusList', bonusList);
provide('currentBootRecord', currentBootRecord);
provide('currentBootProfit', currentBootProfit);
provide('currentTableBase', currentTableBase);
provide('refreshOpeningInfo', refreshOpeningInfo);
provide('refreshTableInfo', refreshTableInfo);
provide('refreshGameInfo', refreshGameInfo);
provide('refreshGameConfig', refreshGameConfig);
provide('refreshGameKind', refreshGameKind);
provide('refreshKindCompose', refreshKindCompose);
provide('refreshCurrencyConfig', refreshCurrencyConfig);
provide('refreshCurrencyBase', refreshCurrencyBase);
provide('refreshFaceConfig', refreshFaceConfig);
provide('refreshCurrentBoot', refreshCurrentBoot);
provide('refreshCurrentTableBase', refreshCurrentTableBase);
provide('refreshBonusList', refreshBonusList);

// 基础信息-过滤
provide('gameKindFilter', gameKindFilter);
provide('filterCompose', filterCompose);
provide('subCalcTypeMap', subCalcTypeMap);
provide('bonusSetting', bonusSetting);
provide('isGeneral', isGeneral);
provide('isBaccarat', isBaccarat);
provide('isRoadNiuniu', isRoadNiuniu);
provide('isScanCard', isScanCard);

// 玩家
provide('currentPlayer', currentPlayer);
provide('currentPlayerCount', currentPlayerCount);
provide('updateCurrentPlayer', updateCurrentPlayer);

// 配置项
provide('currentKindTop', currentKindTop);
provide('currentKindSub', currentKindSub);
provide('gameKindMap', gameKindMap);
provide('updateCurrentKindTop', updateCurrentKindTop);
provide('updateCurrentKindSub', updateCurrentKindSub);

// 开牌
provide('openingLoading', openingLoading);
provide('currentOpenResult', currentOpenResult);
provide('formatCheckSubCalc', formatCheckSubCalc);
provide('openCheck', openCheck);
provide('openSet', openSet);
provide('updateCurrentOpenResult', updateCurrentOpenResult);
provide('openCheckDebounce', openCheckDebounce);

// 其他
provide('handleNextBoot', handleNextBoot);
provide('openBetRecord', openBetRecord);
provide('openBaccaratBetRoad', openBaccaratBetRoad);
provide('openNiuniuBetRoad', openNiuniuBetRoad);
provide('openTableCheck', openTableCheck);
provide('openTableClose', openTableClose);
provide('openScanCard', openScanCard);
</script>
<style lang="scss">
@use './_theme/index.scss';
</style>
<style scoped lang="scss">
@use './_styles/index.scss';
</style>
