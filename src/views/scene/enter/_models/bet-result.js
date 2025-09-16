import { computed, nextTick, ref } from 'vue';
import layer from '@/tools/layer';
import { sceneBettingOpening, sceneBettingSet } from '@/api/scene/enter';
import { checkIndexArray, deepClone, findAllChildren, toAwait } from '@/tools';
import { GAME_KIND_CALC } from '@/values';
import { $t } from '@/lang/i18n';
import { useConfirm } from '@/components/gv-confirm/confirm';

export function useBetResult(
  getOpeningInfo,
  getCurrentPlayer,
  getGameInfo,
  getGameKindMap,
  getFilterCompose,
  getCurrentKindTop,
  getCurrentKindSub,
  getBonusSetting,
  getIsGeneral,
  getIsBaccarat,
  getIsRoadNiuniu,
  getNiuniuRef,
  refreshData
) {
  const { confirm } = useConfirm();

  const placeValue = 0;

  // 开牌loading
  const openingLoading = ref(false);
  // 当前开牌结果
  const currentOpenResult = ref({});

  // 格式化子项选择的计算类型，返回betResult：当前选中的结果，subCalc计算子项的映射值
  const formatCheckSubCalc = computed(() => {
    const map = getGameKindMap() ?? {};
    const compose = getFilterCompose()[getCurrentKindTop()]?.composeList ?? [];
    const subCalc = {};
    const current = [];
    let checkSub = true;
    const selected = deepClone(getCurrentKindSub() ?? []);
    selected.forEach((kid) => {
      // current.push(kid);
      if (map[kid]?.sub_calc === GAME_KIND_CALC.sub) subCalc[kid] = placeValue;
      else current.push(kid); // 子项也要传
    });
    selected.forEach((kid) => {
      compose.forEach((com) => {
        if (subCalc[com.pid] === placeValue && kid === com.id) subCalc[com.pid] = com.id;
      });
    });
    Object.keys(subCalc).forEach((p) => {
      if (subCalc[p] === placeValue) checkSub = false;
    });
    if (getCurrentKindTop()) current.unshift(getCurrentKindTop());
    return { betResult: current, subCalc, checkSub };
  });

  // 获取百家乐类开牌参数
  const formatBaccaratParams = () => {
    const { betResult, subCalc, checkSub } = formatCheckSubCalc.value;
    const player = getCurrentPlayer() ?? [];
    const filterCompose = getFilterCompose();
    const currentKindTop = getCurrentKindTop();
    const betInfo = [];
    const bonusInfo = [];
    const mapKinds = []; // 计算类型为子项
    let check = true;
    let checkBonus = true;
    let checkMapKinds = checkSub;
    player.forEach((item) => {
      if (!!item.username && !item.check_user) check = false;
      Object.keys(item.kind_amount).forEach((kindId) => {
        if (Number(item.kind_amount[kindId]) > 0) {
          if (!item.username || !item.user_id) check = false;
          const kid = Number(kindId);
          if (!!subCalc[Number(kindId)]) {
            const allKid = findAllChildren(filterCompose[currentKindTop]?.composeList ?? [], kid);
            mapKinds.push({ pid: kid, sub: allKid.map((val) => val.id) });
          }
          if (kid === placeValue) return;
          betInfo.push({
            uuid: item.uuid,
            amount: Number(item.kind_amount[kindId]),
            user_id: item.user_id,
            currency_config_id: item.currency_config_id,
            game_kind_id: kid,
            is_cash_compensation: item.is_cash_compensation
          });
        }
      });
      if (item.check_bonus === false) checkBonus = false;
      const bonus = Number(item.bonus ?? 0);
      const bonusId = item.bonus_id;
      if (bonus > 0) {
        if (!item.username || !item.user_id) check = false;
        bonusInfo.push({
          uuid: item.uuid,
          user_id: item.user_id,
          currency_config_id: item.currency_config_id,
          bonus_amount: bonus,
          bonus_result: !!bonusId ? [bonusId] : []
        });
      }
    });
    return { check, checkBonus, checkMapKinds, checkWinLoss: true, betResult, betInfo, bonusInfo, mapKinds };
  };

  // 获取通用类开牌参数
  const formatGeneralParams = () => {
    const { betResult, subCalc } = formatCheckSubCalc.value;
    const player = getCurrentPlayer() ?? [];
    const betInfo = [];
    const bonusInfo = [];
    let check = true;
    let checkBonus = true;
    let checkWinLoss = true;
    player.forEach((item) => {
      if (!!item.username && !item.check_user) check = false;
      Object.keys(item.kind_amount).forEach((kindId) => {
        if (Number(item.kind_amount[kindId]) > 0) {
          if (!item.username || !item.user_id) check = false;
          if (item.is_nn_win === null) return (checkWinLoss = false); // 直接return，拉取赔码数时不会提交
          const kindSub = item.kind_sub;
          betInfo.push({
            uuid: item.uuid,
            amount: Number(item.kind_amount[kindId]),
            user_id: item.user_id,
            currency_config_id: item.currency_config_id,
            game_kind_id: !!kindSub[kindId] ? kindSub[kindId] : Number(kindId),
            is_nn_win: item.is_nn_win,
            is_cash_compensation: item.is_cash_compensation
          });
        }
      });
      if (item.check_bonus === false) checkBonus = false;
      const bonus = Number(item.bonus ?? 0);
      const bonusId = item.bonus_id;
      if (bonus > 0) {
        if (!item.username || !item.user_id) check = false;
        bonusInfo.push({
          uuid: item.uuid,
          user_id: item.user_id,
          currency_config_id: item.currency_config_id,
          bonus_amount: bonus,
          bonus_result: !!bonusId ? [bonusId] : []
        });
      }
    });
    return { check, checkBonus, checkMapKinds: true, checkWinLoss, betResult, betInfo, bonusInfo };
  };

  // 获取开牌参数
  const formatOpenCheckParams = () => {
    if (getIsBaccarat()) {
      return formatBaccaratParams();
    } else {
      return formatGeneralParams();
    }
  };

  // 开牌动作
  const openCheck = async () => {
    await nextTick();
    if (getIsBaccarat() && !getCurrentKindTop()) return;
    const { check, checkBonus, betResult, betInfo, bonusInfo, mapKinds } = formatOpenCheckParams();
    const openInfo = getOpeningInfo();
    const gameInfo = getGameInfo();
    if (!check || !checkBonus) return; // 静默处理
    if (!betInfo.length && !bonusInfo.length) return updateCurrentOpenResult(null);
    openingLoading.value = true;
    const [res] = await toAwait(
      sceneBettingOpening({
        table_id: openInfo.table_id,
        open_id: openInfo.open_id,
        game_model: gameInfo.game_model,
        bet_result: betResult,
        bet_info: betInfo,
        bonus_info: bonusInfo,
        map_kinds: mapKinds
      })
    );
    openingLoading.value = false;
    if (!!res) updateCurrentOpenResult(res);
  };

  // 录入动作
  const openSet = async () => {
    const alertOptions = { cancelText: '', confirmText: $t('common.knew_btn') };

    const isGeneral = getIsGeneral();
    const isBaccarat = getIsBaccarat();

    const isRoadNiuniu = getIsRoadNiuniu();
    const niuniuRef = getNiuniuRef();

    const setting = getBonusSetting();
    if (isBaccarat && !getCurrentKindTop()) return confirm({ content: $t('scene.enter.tips_bet_result'), ...alertOptions });
    const { check, checkBonus, checkMapKinds, checkWinLoss, betResult, betInfo, bonusInfo, mapKinds } = formatOpenCheckParams();
    const openInfo = getOpeningInfo();
    const gameInfo = getGameInfo();
    if (!check) return confirm({ content: $t('scene.enter.tips_user_enable'), ...alertOptions });
    if (!checkBonus)
      return confirm({
        content: $t('scene.enter.tips_bonus_amount', {
          icon: setting.icon,
          min: setting.mini_amount,
          max: setting.max_multiple
        }),
        ...alertOptions
      });
    if (!checkWinLoss) return confirm({ content: $t('scene.enter.tips_win_loss'), ...alertOptions });
    if (!checkMapKinds) return confirm({ content: $t('scene.enter.tips_check_map_kinds'), ...alertOptions });

    const handleSet = async (roadResult) => {
      if (!roadResult) await confirm(!!betInfo.length ? $t('scene.enter.tips_confirm_bet') : $t('scene.enter.tips_confirm_bet_no_info'));
      layer.loading();
      await sceneBettingSet({
        table_id: openInfo.table_id,
        open_id: openInfo.open_id,
        game_model: gameInfo.game_model,
        bet_result: !!roadResult ? roadResult : betResult,
        bet_info: betInfo,
        bonus_info: bonusInfo,
        map_kinds: mapKinds
      });
      layer.closeLoading();
      layer.msgSuccess($t('scene.enter.tips_bet_success'));
      if (refreshData) refreshData();
    };

    if (isRoadNiuniu) {
      niuniuRef?.open(async (result) => {
        await handleSet(result);
      });
    } else {
      await handleSet();
    }
  };

  // 设置当前开牌结果
  const updateCurrentOpenResult = (value) => {
    currentOpenResult.value = value;
  };

  return { openingLoading, currentOpenResult, formatCheckSubCalc, openCheck, openSet, updateCurrentOpenResult };
}
