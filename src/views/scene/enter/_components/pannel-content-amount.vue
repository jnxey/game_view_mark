<template>
  <gv-scene-card ref="sceneCardRef" class="pannel-content-amount">
    <div ref="tableWrapRef" class="table-wrap flex-col">
      <!--    header    -->
      <div class="table-header flex-row align-center fz-18" ref="tableHeaderRef">
        <!--     座位号     -->
        <div class="table-item tiny">{{ $t('scene.enter.label_tc_seat') }}</div>
        <!--     币种     -->
        <div class="table-item normal">{{ $t('scene.enter.label_tc_currency') }}</div>
        <!--     卡号     -->
        <div class="table-item normal">{{ $t('scene.enter.label_tc_card') }}</div>
        <!--     投注项     -->
        <template v-for="(item, index) in showKindList" :key="item.id">
          <div class="table-item normal" :style="[kindColor(item), { width: getPX(showKindWidth[item.id]) }]">
            {{ $ti(item.name) }}
            <kind-drag :kind-id="item.id" :width="showKindWidth[item.id]" @set-width="setShowKindWidth" />
          </div>
          <!--     倍数       -->
          <template v-if="isGeneral && item.sub_calc === GAME_KIND_CALC.sub">
            <div class="table-item small">{{ $t('scene.enter.label_tc_multiple') }}</div>
          </template>
        </template>
        <!--     彩金     -->
        <template v-if="!!bonusList?.length">
          <div class="table-item small">{{ $t('scene.enter.label_tc_bonus') }}</div>
          <div class="table-item small">{{ $t('scene.enter.label_tc_prize') }}</div>
        </template>
        <!--     输赢     -->
        <template v-if="isGeneral">
          <div class="table-item small">{{ $t('scene.enter.label_tc_loss') }}</div>
          <div class="table-item small">{{ $t('scene.enter.label_tc_win') }}</div>
        </template>
        <!--    现金赔码      -->
        <template v-if="tableInfo.is_cash_compensation === STATUS_VALUE.normal">
          <div class="table-item tiny cursor-pointer" @click="setPlayerCashAll">
            <gv-icon
              name="local-icon-check-icon"
              class="check-icon fz-20"
              :class="{ 'text-warning': isAllSelectCompensation, 'text-placeholder': !isAllSelectCompensation }"
            />
          </div>
        </template>
        <!--     赔码信息     -->
        <div class="table-item large fixed-right cursor-pointer">
          {{ $t('scene.enter.label_tc_compensate') }}
          <gv-icon v-show="openingLoading" name="el-icon-loading" class="loading-icon" />
        </div>
      </div>
      <!--   body     -->
      <el-scrollbar class="table-body flex-1" @scroll="handleBodyScroll">
        <template v-for="(item, index) in currentPlayer" :key="item.uuid">
          <div
            class="table-row flex-1 flex-row align-top pt-8 pb-8 fz-24 v-press-target"
            @click.right.prevent="(e) => pressCommand(e, index)"
            v-press="{ handler: (e) => pressCommand(e, index) }"
          >
            <!--      座位号        -->
            <div class="table-item tiny cursor-pointer text-warning fw-bold" @click.stop="(e) => selectSeat(e, item)">
              <div class="t-item-box">{{ item.seat }}</div>
            </div>
            <!--       币种       -->
            <div class="table-item normal cursor-pointer" @click.stop="(e) => selectCurrency(e, item, index)">
              <div class="t-item-box flex-row flex-wrap align-center justify-center">
                <el-avatar class="mr-4" :size="24" :src="getBaseImagUrl(currencyConfigMap[item.currency_config_id]?.image)" />
                <span class="text-center" :style="{ color: currencyConfigMap[item.currency_config_id]?.color }">
                  {{ $ti(currencyConfigMap[item.currency_config_id]?.name) }}
                </span>
              </div>
            </div>
            <!--       卡号       -->
            <div class="table-item normal">
              <div class="v-keyboard-wrap">
                <input
                  type="text"
                  class="amount-input t-item-box w-full fz-24"
                  :value="item.username"
                  :class="{
                    loading: !!item.check_loading,
                    error: !item.check_loading && !!item.username && item.check_user === false,
                    success: !item.check_loading && item.check_user === true
                  }"
                  @input="(e) => setPlayerUsername(e, item)"
                  @blur="checkPlayerUsername(item)"
                />
              </div>
              <div class="t-item-other">
                <div class="text-left pt-8 fz-18 text-ellipsis">
                  {{ !!item.chip_balance ? item.chip_balance : '' }}
                </div>
              </div>
            </div>
            <!--     投注项     -->
            <template v-for="_item in showKindList" :key="getMultipleKey(_item.id, item.uuid)">
              <div class="table-item t-item-box normal" :style="{ width: getPX(showKindWidth[_item.id]) }">
                <div class="v-keyboard-wrap">
                  <input
                    type="text"
                    class="amount-input w-full fz-24"
                    :class="{ error: !!item.kind_amount_check?.[_item.id] }"
                    :value="item.kind_amount?.[_item.id]"
                    @input="(e) => setKindAmount(e, item, _item)"
                    @blur="checkKindAmountBlur(item, _item)"
                    @focus="checkPlayerUsername(item, false)"
                  />
                </div>
                <div class="t-item-other" v-if="!!openResultCount.kind[item.uuid]">
                  <div class="text-left text-danger pt-8 fz-18">
                    {{ getShowCompensate(openResultCount.kind[item.uuid]?.[_item.id]) }}
                  </div>
                </div>
              </div>
              <!--         倍数       -->
              <template v-if="isGeneral && _item.sub_calc === GAME_KIND_CALC.sub">
                <div class="table-item t-item-box small">
                  <gv-resize-text
                    class="handle-normal-btn t-item-box"
                    @click="selectKind(item, _item)"
                    :content="$ti(gameKindMap[item.kind_sub[_item.id]]?.name)"
                  />
                </div>
              </template>
            </template>
            <!--        彩金      -->
            <template v-if="!!bonusList?.length">
              <div class="table-item left small">
                <div class="v-keyboard-wrap">
                  <input
                    type="text"
                    :disabled="currencyConfigMap[item.currency_config_id]?.currency_id !== bonusSetting.currency_id"
                    class="amount-input t-item-box w-full fz-24"
                    :class="{ error: item.check_bonus === false }"
                    :value="item.bonus"
                    @input="(e) => setBonusAmount(e, item)"
                    @blur="checkBonusAmount(item)"
                  />
                </div>
                <div class="t-item-other">
                  <div class="text-left text-danger pt-8 fz-18">
                    {{ openResultCount.bonus[item.uuid] ?? '' }}
                  </div>
                </div>
              </div>
              <div class="table-item small">
                <gv-resize-text
                  class="handle-normal-btn t-item-box"
                  :class="{ 'text-warning': !!item.bonus_id, disabled: !item.bonus }"
                  @click="openBonusSelect(item)"
                  :content="!item.bonus_id ? $t('common.prize_draw') : $t('common.prizes_awarded', { index: getBonusIndex(item.bonus_id) })"
                />
              </div>
            </template>
            <!--      输赢        -->
            <template v-if="isGeneral">
              <div class="table-item small">
                <div class="handle-check-btn t-item-box" @click="setPlayerLoss(item)">
                  <gv-icon v-show="item.is_nn_win === LOSS_WIN_VALUE.loss" name="local-icon-check-icon" class="check-icon text-danger fz-24" />
                </div>
              </div>
              <div class="table-item small">
                <div class="handle-check-btn t-item-box" @click="setPlayerWin(item)">
                  <gv-icon v-show="item.is_nn_win === LOSS_WIN_VALUE.win" name="local-icon-check-icon" class="check-icon text-success fz-24" />
                </div>
              </div>
            </template>
            <!--      是否是现金赔码        -->
            <template v-if="tableInfo.is_cash_compensation === STATUS_VALUE.normal">
              <div class="table-item tiny fixed-right">
                <div class="handle-check-btn t-item-box" @click="setPlayerCash(item)">
                  <gv-icon
                    v-show="item.is_cash_compensation === YES_NO_VALUE.yes"
                    name="local-icon-check-icon"
                    class="check-icon text-warning fz-20"
                  />
                </div>
              </div>
            </template>
            <!--     赔码信息     -->
            <div class="table-item large fixed-right count-box">
              <div class="t-item-box text-center text-danger bg-cover pl-4">
                {{ getShowCompensate(openResultCount.total[item.uuid]) }}
              </div>
            </div>
          </div>
        </template>
      </el-scrollbar>
    </div>
    <table-currency ref="tableCurrencyRef" :currency="currencyConfig" />
    <table-seat ref="tableSeatRef" />
    <table-bonus ref="tableBonusRef" />
    <kind-select ref="kindSelectRef" />
    <gv-command ref="commandRef" @close="commandIndex = null" :offset-y="-40">
      <div class="command-item" @click="commandAddUp">{{ $t('scene.enter.command_line_add_up') }}</div>
      <div class="command-item" @click="commandAddDown">{{ $t('scene.enter.command_line_add_down') }}</div>
      <div class="command-item text-danger" @click="commandDelete">{{ $t('scene.enter.command_line_delete') }}</div>
      <div class="command-item" @click="() => commandRef?.close()">{{ $t('common.cancel') }}</div>
    </gv-command>
  </gv-scene-card>
</template>
<script setup>
import GvSceneCard from '@/views/scene/enter/_components/gv-scene-card/index.vue';
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, shallowRef, toRaw, unref, watch } from 'vue';
import {
  calcAmount,
  deepClone,
  generateUUID,
  getBaseImagUrl,
  getMultipleKey,
  getPX,
  getWindowSize,
  isArray,
  mappingArrayToObject,
  stringTrim,
  toAwait
} from '@/tools';
import { CACHE_SCENE_ENTER_PLAYER } from '@/values/cache';
import { storage } from '@/tools/storage';
import { getKindColor } from '@/views/scene/enter/_models/kind-color';
import { sceneBettingBalance } from '@/api/scene/enter';
import { getColorWithOpacity } from '@/tools/color';
import GvCommand from '@/components/gv-command/index.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import eventManager from '@/tools/event-manager';
import { EVENTS_SCENE_AI_SCAN_SET, EVENTS_SCENE_OPENING_SET } from '@/values/events';
import TableSeat from '@/views/scene/enter/_components/_components/table-seat.vue';
import { CURRENCY_TYPE, GAME_KIND_CALC, GAME_KIND_LEVEL, GAME_MODEL, LOSS_WIN_VALUE, SCENE_SEATS, STATUS_VALUE, YES_NO_VALUE } from '@/values';
import KindSelect from '@/views/scene/enter/_components/_components/kind-select.vue';
import TableBonus from '@/views/scene/enter/_components/_components/table-bonus.vue';
import { checkBonusAmountBySetting } from '@/tools/bonus';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';
import layer from '@/tools/layer';
import TableCurrency from '@/views/scene/enter/_components/_components/table-currency.vue';
import GvResizeText from '@/components/gv-resize-text/index.vue';
import { useResizeObserver } from '@vueuse/core';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import KindDrag from '@/views/scene/enter/_components/_components/kind-drag.vue';
import { NIU_CARD_TYPE_AREA } from '@/values/card';

const gameInfo = inject('gameInfo');
const tableInfo = inject('tableInfo');
const gameKindFilter = inject('gameKindFilter');
const gameKindMap = inject('gameKindMap');
const gameCheck = inject('gameCheck');
const currencyConfig = inject('currencyConfig');
const subCalcTypeMap = inject('subCalcTypeMap');
const updateCurrentPlayer = inject('updateCurrentPlayer');
const currentOpenResult = inject('currentOpenResult');
const openingLoading = inject('openingLoading');
const openCheckDebounce = inject('openCheckDebounce');
const bonusList = inject('bonusList');
const bonusSetting = inject('bonusSetting');
const isGeneral = inject('isGeneral');
const isBaccarat = inject('isBaccarat');

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.scene_enter_fold);

const tableCurrencyRef = shallowRef();
const sceneCardRef = shallowRef();
const commandRef = shallowRef();
const tableSeatRef = shallowRef();
const tableBonusRef = shallowRef();
const kindSelectRef = shallowRef();
const tableHeaderRef = shallowRef();
const tableWrapRef = shallowRef();
const commandIndex = ref();
const tableWrapWidth = ref(getWindowSize().width);
const showKindWidthCache = reactive({});

// 当前玩家
const currentPlayer = reactive([]);
const currencyConfigMap = computed(() => mappingArrayToObject(currencyConfig.value));

// 获取顶级选项
const gameKindTop = computed(() => {
  return gameKindFilter.value?.filter((val) => val.is_top === GAME_KIND_LEVEL.top);
});

// 当前要使用的配置项
const gameKindUse = computed(() => {
  return isBaccarat.value ? gameKindFilter.value : gameKindTop.value;
});

// 显示的投注项
const showKindList = computed(() => {
  return gameKindUse.value?.filter((val) => !subCalcTypeMap.value[val.id]);
});

// 显示的投注项宽度
const showKindWidth = computed(() => {
  const result = {};
  const kinds = showKindList.value;
  kinds.forEach((item) => {
    result[item.id] = showKindWidthCache[item.id] ?? 100;
  });
  return result;
});

// 当前赔码数统计
const openResultCount = computed(() => {
  const result1 = {};
  const result2 = {};
  const result3 = {};
  const betInfo = currentOpenResult.value?.bet_info ?? [];
  const bonusInfo = currentOpenResult.value?.bonus_info ?? [];
  betInfo.forEach((item) => {
    if (!result1[item.uuid]) result1[item.uuid] = 0;
    if (!result3[item.uuid]) result3[item.uuid] = {};
    if (item.compensate < 0) return;
    result1[item.uuid] = calcAmount(result1[item.uuid] + item.compensate);
    result3[item.uuid][item.game_kind_id] = item.compensate;
  });
  bonusInfo.forEach((item) => {
    if (!result2[item.uuid]) result2[item.uuid] = 0;
    result2[item.uuid] = calcAmount(result2[item.uuid] + item.bonus_profit_loss);
  });
  return { total: result1, bonus: result2, kind: result3 };
});

// 当前现金理赔是否全选
const isAllSelectCompensation = computed(() => {
  let result = true;
  currentPlayer.forEach((item) => {
    if (item.is_cash_compensation !== YES_NO_VALUE.yes) result = false;
  });
  return result;
});

// 初始化玩家信息
const initPlayer = async () => {
  const emptyPlayer = await initPlayerMin();
  const cachePlayer = getCachePlayer();
  if (!!cachePlayer.length) {
    currentPlayer.push(...cachePlayer);
  } else {
    currentPlayer.push(...emptyPlayer);
  }
  if (isGeneral.value) openCheckDebounce();
};

// 初始化最少玩家数量
const initPlayerMin = async () => {
  const players = [];
  const defCurrency = getCurrencyDefault();
  const seatNumber = getWindowSize().height > 1080 ? 1 : 1;
  SCENE_SEATS.forEach((no) => {
    for (let i = 0; i < seatNumber; i++) {
      players.push(getGeneratePlayer(no, defCurrency));
    }
  });
  return players;
};

// 获取生成的空玩家
const getGeneratePlayer = (seat, currency) => {
  return {
    uuid: generateUUID(),
    user_id: null,
    username: null,
    check_user: null,
    check_loading: false,
    chip_balance: null,
    currency_config_id: currency ?? getCurrencyDefault(),
    bonus: null,
    bonus_id: null,
    seat: seat,
    check_bonus: null,
    kind_amount: {},
    kind_amount_check: {},
    is_nn_win: null,
    is_cash_compensation: YES_NO_VALUE.no,
    kind_sub: isBaccarat.value ? {} : getDefKindSub()
  };
};

// 获取默认选中的倍数
const getDefKindSub = () => {
  const kindSub = {};
  const useList = gameKindUse.value;
  const filterList = gameKindFilter.value;
  useList.forEach((item) => {
    if (item.sub_calc === GAME_KIND_CALC.sub) {
      const key = filterList.findIndex((val) => val.sub_main_id === item.id);
      kindSub[item.id] = filterList[key].id;
    }
  });
  return kindSub;
};

// 获取缓存Key
const getCachePLayerKey = () => {
  return getMultipleKey(CACHE_SCENE_ENTER_PLAYER, tableInfo.value.id);
};

// 获取缓存的玩家列表
const getCachePlayer = () => {
  const cache = storage.get(getCachePLayerKey());
  if (!cache) return [];
  if (Date.now() - cache.time > 10 * 60 * 1000) return [];
  return isArray(cache.content) ? cache.content : [];
};

// 获取赔码显示
const getShowCompensate = (amount) => (!!amount ? amount : '');

// 缓存玩家信息
const setCachePlayer = () => {
  storage.set(getCachePLayerKey(), { time: Date.now(), content: currentPlayer });
  updateCurrentPlayer(deepClone(toRaw(currentPlayer)));
  console.log(currentPlayer, '-------------player');
};

// 获取配置项颜色
const kindColor = (item) => {
  const opacity = getColorWithOpacity(getKindColor(item.icon), 0.3);
  return { backgroundImage: `linear-gradient(#021e33, ${opacity})` };
};

// 默认币种
const getCurrencyDefault = () => {
  const currency = currencyConfig.value;
  if (!currency.length) return null;
  return currency[0]?.id;
};

// 选择币种
const selectCurrency = (e, item) => {
  tableCurrencyRef.value?.open(e.currentTarget, (cid) => {
    item.currency_config_id = cid;
    checkPlayerUsername(item);
    clearBonusAmount(item);
  });
};

// 选择座位号
const selectSeat = (e, item) => {
  tableSeatRef.value?.open(e.currentTarget, (seat) => {
    item.seat = seat;
  });
};

// 选择倍数
const selectKind = (item, kind) => {
  const list = gameKindFilter.value.filter((val) => val.sub_main_id === kind.id);
  kindSelectRef.value?.open((row) => {
    item.kind_sub[kind.id] = row.id;
    openCheckDebounce();
  }, list);
};

// 设置玩家会员号
const setPlayerUsername = (e, item) => {
  item.username = stringTrim(e.target.value);
};

// 设置配置项金额
const setKindAmount = (e, item, kind) => {
  item.kind_amount[kind.id] = stringTrim(e.target.value.replace(/[^0-9.]/g, ''));
  e.target.value = item.kind_amount[kind.id];
};

// 投注项金额失去焦点处理
const checkKindAmountBlur = (item, kind) => {
  openCheckDebounce();
  // 检测余额
  const cAmount = Number(item.kind_amount[kind.id]);
  const cInfo = currencyConfigMap.value[item.currency_config_id];
  if (!item.kind_amount_check) item.kind_amount_check = {};
  item.kind_amount_check[kind.id] = false;
  if (!!cAmount && gameCheck.value?.is_balance_match === STATUS_VALUE.normal && cInfo.type === CURRENCY_TYPE.chips) {
    const balance = item.chip_balance ?? 0;
    item.kind_amount_check[kind.id] = balance <= cAmount;
  }
};

// 设置彩金金额
const setBonusAmount = (e, item) => {
  item.bonus = stringTrim(e.target.value.replace(/[^0-9.]/g, ''));
  e.target.value = item.bonus;
};

// 打开彩金选中
const openBonusSelect = (item) => {
  if (!item.bonus) return;
  tableBonusRef.value?.open(item.bonus_id, (rowId) => {
    item.bonus_id = rowId;
    openCheckDebounce();
  });
};

// 获取彩金ID索引
const getBonusIndex = (id) => {
  if (!id) return '';
  const index = bonusList.value?.findIndex((val) => val.id === id) ?? 0;
  return index + 1;
};

// 设置玩家输
const setPlayerLoss = (item) => {
  if (item.is_nn_win !== LOSS_WIN_VALUE.loss) item.is_nn_win = LOSS_WIN_VALUE.loss;
  else if (item.is_nn_win === LOSS_WIN_VALUE.loss) item.is_nn_win = null;
  openCheckDebounce();
};

// 设置玩家赢
const setPlayerWin = (item) => {
  if (item.is_nn_win !== LOSS_WIN_VALUE.win) item.is_nn_win = LOSS_WIN_VALUE.win;
  else if (item.is_nn_win === LOSS_WIN_VALUE.win) item.is_nn_win = null;
  openCheckDebounce();
};

// 设置现金赔码
const setPlayerCash = (item) => {
  if (item.is_cash_compensation === YES_NO_VALUE.yes) {
    item.is_cash_compensation = YES_NO_VALUE.no;
  } else {
    item.is_cash_compensation = YES_NO_VALUE.yes;
  }
};

// 设置现金赔码
const setPlayerCashAll = () => {
  const isAll = isAllSelectCompensation.value;
  if (isAll) layer.msgSuccess($t('scene.enter.tips_compensation_close'));
  else layer.msgSuccess($t('scene.enter.tips_compensation_open'));
  currentPlayer.forEach((item) => {
    item.is_cash_compensation = isAll ? YES_NO_VALUE.no : YES_NO_VALUE.yes;
  });
};

// 清空彩金投注金额
const clearBonusAmount = (item) => {
  item.bonus = null;
  item.check_bonus = null;
  item.bonus_id = null;
};

// 检查彩金投注金额
const checkBonusAmount = (item) => {
  if (!item.bonus) {
    clearBonusAmount(item);
  } else {
    item.check_bonus = checkBonusAmountBySetting(Number(item.bonus), unref(bonusSetting));
  }
  openCheckDebounce();
};

// 检查会员号是否合法
const checkPlayerUsername = async (item, opening = true) => {
  function errSet() {
    item.user_id = null;
    item.chip_balance = null;
  }
  if (!item.username) {
    item.check_user = null;
    errSet();
  } else {
    item.check_loading = true;
    const [res] = await toAwait(sceneBettingBalance({ username: item.username, currency_config_id: item.currency_config_id }));
    item.check_loading = false;
    const cInfo = currencyConfigMap.value[item.currency_config_id];
    if (!res) {
      item.check_user = false;
      errSet();
    } else {
      item.check_user = true;
      item.user_id = res.user_id;
      item.chip_balance = cInfo.type === CURRENCY_TYPE.chips ? res.chip_balance : null;
      // 判断底部并加1行
      checkUserLastLine(item.uuid);
    }
  }
  if (opening) openCheckDebounce(); // 尝试获取开牌结果
};

// 确认会员余额-所有
const checkPlayerBalance = async () => {
  currentPlayer.forEach(async (item) => {
    if (item.check_user === false || !item.username) return;
    item.check_loading = true;
    const [res] = await toAwait(sceneBettingBalance({ username: item.username, currency_config_id: item.currency_config_id }));
    item.check_loading = false;
    item.chip_balance = res.chip_balance;
  });
};

// 判断底部并加1行
const checkUserLastLine = (uuid) => {
  const key = currentPlayer.findIndex((item) => item.uuid === uuid);
  if (key === currentPlayer.length - 1) {
    currentPlayer.push(getGeneratePlayer(currentPlayer[key].seat, currentPlayer[key].currency_config_id));
  }
};

// 长按弹出指令弹窗
const pressCommand = (e, index) => {
  commandIndex.value = index;
  commandRef.value?.open(e);
};

// 指令-向上添加一行
const commandAddUp = () => {
  const seat = currentPlayer[commandIndex.value].seat;
  currentPlayer.splice(commandIndex.value, 0, getGeneratePlayer(seat));
  commandRef.value?.close();
};

// 指令-向下添加一行
const commandAddDown = () => {
  const seat = currentPlayer[commandIndex.value].seat;
  currentPlayer.splice(commandIndex.value + 1, 0, getGeneratePlayer(seat));
  commandRef.value?.close();
};

// 指令-删除本行
const commandDelete = () => {
  currentPlayer.splice(commandIndex.value, 1);
  commandRef.value?.close();
};

// 清空玩家投注内容
const clearAmount = () => {
  checkPlayerBalance();
  currentPlayer.forEach((item) => {
    item.kind_amount = {};
    item.kind_amount_check = {};
    item.is_nn_win = null;
    item.kind_sub = isBaccarat.value ? {} : getDefKindSub();
    clearBonusAmount(item);
  });
};

// 处理body横向滚动
const handleBodyScroll = (e) => {
  if (tableHeaderRef.value) tableHeaderRef.value.scrollLeft = e.scrollLeft;
};

// 处理body宽度变化
const watchBodyResize = () => {
  useResizeObserver(tableWrapRef.value, (entries) => {
    const entry = entries[0];
    tableWrapWidth.value = entry.contentRect.width;
  });
};

// 设置投注项宽度
const setShowKindWidth = ({ id, width }) => {
  showKindWidthCache[id] = width;
};

// AI识牌选中
const aiScanSet = (hits) => {
  if (gameInfo.value?.game_model === GAME_MODEL.niu_niu) {
    const sMap = {};
    const subs = [];
    const kinds = showKindList.value ?? [];
    SCENE_SEATS.forEach((num) => (sMap[num] = hits['s' + num]));
    kinds.forEach((kind) => {
      if (kind.sub_calc === GAME_KIND_CALC.sub) subs.push({ id: kind.id, list: [] });
    });
    subs.forEach((item) => {
      item.list = gameKindFilter.value?.filter((val) => val.sub_main_id === item.id);
    });
    currentPlayer.forEach((item) => {
      if (!sMap[item.seat]) return;
      const poker = sMap[item.seat].poker.type;
      item.is_nn_win = sMap[item.seat].winner === 'p' ? LOSS_WIN_VALUE.win : LOSS_WIN_VALUE.loss;
      subs.forEach((_item) => {
        _item.list.forEach((__item) => {
          if (isArray(NIU_CARD_TYPE_AREA[__item.card_pattern])) {
            if (NIU_CARD_TYPE_AREA[__item.card_pattern]?.includes(poker)) item.kind_sub[_item.id] = __item.id;
          }
          if (__item.card_pattern === poker) item.kind_sub[_item.id] = __item.id;
        });
      });
    });
    console.log(currentPlayer, '-------------player');
    updateCurrentPlayer(deepClone(toRaw(currentPlayer)));
  }
};

watch(
  () => currentPlayer,
  () => setCachePlayer(),
  { deep: true }
);

onMounted(async () => {
  if (!!tableWrapRef.value) watchBodyResize();
  await initPlayer();
  await checkPlayerBalance();
  // 监听录入操作
  eventManager.on(EVENTS_SCENE_OPENING_SET, clearAmount);
  eventManager.on(EVENTS_SCENE_AI_SCAN_SET, aiScanSet);
});

onBeforeUnmount(() => {
  eventManager.off(EVENTS_SCENE_OPENING_SET, clearAmount);
  eventManager.off(EVENTS_SCENE_AI_SCAN_SET, aiScanSet);
});
</script>
<style lang="scss" scoped>
.pannel-content-amount {
  width: 100%;
  min-height: 300px;
  overflow: auto;

  .table-wrap {
    position: absolute;
    top: 15px;
    bottom: 15px;
    left: 15px;
    right: 15px;
    color: var(--scene-enter-amount-title-text-color);

    ::v-deep(.el-scrollbar__view) {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    .table-header {
      --pannel-border-color: var(--scene-enter-amount-title-border-color);
      --pannel-bg-image: var(--scene-enter-amount-title-bg-1);
      width: 100%;
      height: 44px;
      overflow: hidden;
      z-index: 10;

      .table-item {
        position: relative;
        height: 42px;
        padding: 10px 2px;
        background-color: var(--scene-enter-amount-title-bg-2);

        .fold-wrap {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 10px;
          opacity: 1;
          background-color: var(--scene-enter-amount-title-border-color);

          &:hover {
            opacity: 0.6;
          }

          .fold-more {
            transform: rotate(-90deg);

            &.close {
              transform: rotate(90deg);
            }
          }
        }
      }
    }

    .table-row {
      --pannel-border-color: transparent;
      --pannel-bg-image: none;
      min-width: min-content;
      background-color: var(--scene-enter-amount-row-bg-1);

      &:nth-child(odd) {
        background-color: var(--scene-enter-amount-row-bg-2);
      }

      &.current,
      &:hover {
        background-color: var(--scene-enter-amount-row-bg-3);
      }

      .table-item {
        padding: 5px 2px;
      }
    }

    .table-header,
    .table-row {
      .table-item {
        flex-shrink: 0;
        position: relative;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        word-break: keep-all;
        border-top: 1px solid var(--pannel-border-color);
        border-left: 1px solid var(--pannel-border-color);
        border-bottom: 1px solid var(--pannel-border-color);
        background-image: var(--pannel-bg-image);

        &:last-child {
          border-right: 1px solid var(--pannel-border-color);
        }

        &.left {
          justify-content: start;
        }

        .loading-icon {
          position: absolute;
          top: 10px;
          right: 5px;
          animation: loop-turn 2s infinite linear;
        }

        .username {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          word-break: keep-all;
          text-align: center;
          text-overflow: ellipsis;
        }

        .v-keyboard-wrap {
          transform-origin: left;
          transition: transform 0.3s linear;

          &.v-keyboard-focus {
            transform: scale(1.4);
            z-index: 10;
          }
        }

        .t-item-box {
          height: 48px;
          line-height: 24px;
          padding: 10px 4px;
        }

        .t-item-other {
          height: 36px;
        }

        .amount-input {
          position: relative;
          padding: 10px 4px;
          color: var(--scene-enter-main-text-color);
          background-color: var(--scene-enter-amount-input-bg-1);
          border: none;
          outline: none;
          box-shadow: var(--scene-enter-amount-input-box-shadow-1);
          border-radius: 0;
          text-align: left;
          text-decoration: none;

          &:focus {
            background-color: var(--scene-enter-amount-input-bg-2);
          }

          &.error {
            box-shadow: 0 0 0 1px var(--scene-enter-amount-error);
            animation: error-border 1s infinite;
          }

          &.success {
            box-shadow: 0 0 0 1px var(--scene-enter-amount-success);
          }

          &.loading {
            animation: loading-border 1s infinite;
          }

          &:disabled {
            opacity: 0.4;
          }
        }

        &.fixed-right {
          position: sticky;
          right: 0;
          z-index: 20;
        }

        &.tiny {
          width: 50px;
        }

        &.small {
          width: 80px;
        }

        &.normal {
          width: 100px;
        }

        &.large {
          width: 120px;
        }
      }
    }
  }

  .handle-normal-btn {
    width: 100%;
    padding: 12px 4px;
    text-align: center;
    cursor: pointer;
    background-color: var(--scene-enter-amount-normal-btn-bg-1);
    box-shadow: var(--scene-enter-amount-normal-btn-box-shadow);
    &:hover {
      background-color: var(--scene-enter-amount-normal-btn-bg-2);
    }
    &.disabled {
      opacity: 0.4;
    }
  }

  .handle-check-btn {
    position: relative;
    width: 100%;
    text-align: center;
    cursor: pointer;
    background-color: var(--scene-enter-amount-check-btn-bg-1);
    box-shadow: var(--scene-enter-amount-check-btn-box-shadow);
    &:hover {
      background-color: var(--scene-enter-amount-check-btn-bg-2);
    }

    .check-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .bg-cover {
    box-shadow: 0 0 0 1px #054159;
    background-image: linear-gradient(#14517f, #446e7f);
  }
}

@keyframes loading-border {
  0% {
    box-shadow: var(--scene-enter-amount-input-box-shadow-1);
  }
  50% {
    box-shadow: var(--scene-enter-amount-input-box-shadow-2);
  }
  100% {
    box-shadow: var(--scene-enter-amount-input-box-shadow-1);
  }
}

@keyframes error-border {
  0% {
    box-shadow: var(--scene-enter-amount-input-box-shadow-1);
  }
  50% {
    box-shadow: 0 0 0 1px var(--scene-enter-amount-error);
  }
  100% {
    box-shadow: var(--scene-enter-amount-input-box-shadow-1);
  }
}
</style>
