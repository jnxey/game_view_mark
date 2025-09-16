import { computed, shallowRef } from 'vue';
import { financeTableAmount, financeTableGet, financeTableListBonus } from '@/api/finance/table';
import { betBootProfit, betOpenBootNumber, sceneBettingOpening } from '@/api/scene/enter';
import { gameConfigGetDetection, gameConfigLists, gameGet } from '@/api/game/list';
import { QUERY_LIST_TYPE, STATUS_VALUE } from '@/values';
import { gameKindComposeGet, gameKindLists } from '@/api/game/kind';
import { getJSON } from '@/tools';
import { currencyConfigLists } from '@/api/currency/config';
import { currencyBaseLists } from '@/api/currency/base';
import { gameChipLists } from '@/api/game/chip';

export function useBetBase(getTableId) {
  const tableInfo = shallowRef(); // 台面信息
  const gameInfo = shallowRef(); // 游戏信息
  const openingInfo = shallowRef(); // 本靴信息
  const gameConfig = shallowRef(); // 游戏配置信息
  const gameKind = shallowRef(); // 投注项
  const gameCompose = shallowRef(); // 投注项-组合配置
  const gameCheck = shallowRef(); // 游戏余额检测
  const currencyConfig = shallowRef(); // 币种
  const currencyBase = shallowRef(); // 基础货币
  const faceConfig = shallowRef(); // 面值
  const bonusList = shallowRef(); // 彩金
  const currentBootRecord = shallowRef([]); // 本靴开牌记录
  const currentBootProfit = shallowRef([]); // 本靴输赢
  const currentTableBase = shallowRef({}); // 当前台面余额

  // 彩金配置信息
  const bonusSetting = computed(() => {
    const { icon, mini_amount, max_multiple, abbreviation, currency_id } = bonusList.value?.[0] ?? {};
    return { icon, mini_amount: Number(mini_amount ?? 0), max_multiple: Number(max_multiple ?? 0), abbreviation, currency_id };
  });

  // 更新台信息
  const refreshTableInfo = async () => {
    tableInfo.value = await financeTableGet({ id: getTableId() });
  };

  // 更新游戏信息
  const refreshGameInfo = async () => {
    gameInfo.value = await gameGet({ id: tableInfo.value.game_id });
  };

  // 获取靴号、局号
  const refreshOpeningInfo = async () => {
    openingInfo.value = await sceneBettingOpening({ table_id: getTableId(), game_model: gameInfo.value?.game_model });
  };

  // 游戏配置
  const refreshGameConfig = async () => {
    const { lists } = await gameConfigLists({ game_id: tableInfo.value.game_id, page_type: QUERY_LIST_TYPE.all });
    gameConfig.value = lists;
  };

  // 游戏余额检测
  const refreshGameCheck = async () => {
    gameCheck.value = await gameConfigGetDetection();
  };

  // 投注项
  const refreshGameKind = async () => {
    const { lists } = await gameKindLists({ page_type: QUERY_LIST_TYPE.all });
    gameKind.value = lists;
  };

  // 投注项-组合配置
  const refreshKindCompose = async () => {
    const { lists } = await gameKindComposeGet({ page_type: QUERY_LIST_TYPE.all });
    const info = lists?.[0] ?? {};
    info.content = getJSON(info.content, {});
    gameCompose.value = info.content;
  };

  // 币种配置
  const refreshCurrencyConfig = async () => {
    const { lists } = await currencyConfigLists({ page_type: QUERY_LIST_TYPE.all, status: STATUS_VALUE.normal });
    currencyConfig.value = lists;
  };

  // 基础货币
  const refreshCurrencyBase = async () => {
    const { lists } = await currencyBaseLists({ page_type: QUERY_LIST_TYPE.all, status: STATUS_VALUE.normal });
    currencyBase.value = lists;
  };

  // 面值拉取
  const refreshFaceConfig = async () => {
    const { lists } = await gameChipLists({ page_type: QUERY_LIST_TYPE.all, status: STATUS_VALUE.normal });
    faceConfig.value = lists;
  };

  // 更新本靴开牌记录
  const refreshCurrentBoot = async () => {
    const info = tableInfo.value;
    const opening = openingInfo.value;
    const lists = await betOpenBootNumber({ table_id: info.id, game_id: info.game_id, boot_number: opening.boot_number });
    currentBootRecord.value = lists.filter((val) => !!val.bet_result).reverse();
  };

  // 更新本靴输赢
  const refreshCurrentProfit = async () => {
    const opening = openingInfo.value;
    currentBootProfit.value = await betBootProfit({ boot_id: opening.boot_id });
  };

  // 更新本台面实时余额
  const refreshCurrentTableBase = async () => {
    const info = tableInfo.value;
    currentTableBase.value = await financeTableAmount({ id: info.id });
  };

  // 获取彩金列表
  const refreshBonusList = async () => {
    const info = tableInfo.value;
    bonusList.value = await financeTableListBonus({ id: info.id });
  };

  return {
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
  };
}
