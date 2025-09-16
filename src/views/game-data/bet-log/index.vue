<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="game_data_bet_log-list"
      :request="betActionLog"
      :columns="columns"
      :default-query="defaultQuery"
      :handler-list="handlerList"
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="title" @back="backTab($router)" />
        <gv-select-user-inline
          class="search-item"
          place-top
          v-model="query.user_id"
          :placeholder="$t('common.user_no')"
          :disabled="!!defaultQuery.user_id"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.game_id"
          :placeholder="$t('common.game_no')"
          multiple
          :options="optionsData.game"
          :empty-page="{ perm: permsMap.game.list.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_id"
          :placeholder="$t('common.table_no')"
          multiple
          :request="financeTableLists"
          :empty-page="{ perm: permsMap.finance.table.view }"
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.boot_number"
          :placeholder="$t('common.boot_no')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.round_number"
          :placeholder="$t('common.round_no')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <el-select class="search-item" v-model="query.action" :placeholder="$t('common.operate_type')" clearable v-place>
          <el-option v-for="(item, index) in LOG_OPERATOR_TYPE_DICT_BET_LOG" :key="index" :label="item.name" :value="item.value" />
        </el-select>
        <el-input
          class="search-item"
          v-trim
          v-model="query.operator"
          :placeholder="$t('common.operate_person')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <br />
        <el-radio-group v-model="timeRangeActive" class="search-item auto box" @change="setTimeRange">
          <el-radio-button :label="$t('common.today')" :value="TIME_RANGE_TYPE.today" />
          <el-radio-button :label="$t('common.yesterday')" :value="TIME_RANGE_TYPE.yesterday" />
          <el-radio-button :label="$t('common.before_yesterday')" :value="TIME_RANGE_TYPE.beforeYesterday" />
          <el-radio-button :label="$t('common.this_month')" :value="TIME_RANGE_TYPE.thisMonth" />
          <el-radio-button :label="$t('common.last_month')" :value="TIME_RANGE_TYPE.lastMonth" />
          <el-radio-button :label="$t('common.ninety_day')" :value="TIME_RANGE_TYPE.ninetyDay" />
        </el-radio-group>
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.operate_time')"
          :type="dateRangeType"
          :show-format="dateRangeFormat"
          v-place
          :clearable="false"
          @click="clearTimeRangeActive"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #round_number="{ row }">
        <div class="flex-row align-center">
          <span>{{ row.old_round }}</span>
          <gv-icon v-if="row.new_round" class="text-danger ml-4 mr-4" name="el-icon-right" />
          <span v-if="row.new_round" class="text-danger fw-bold">
            {{ row.new_round }}
          </span>
        </div>
      </template>
      <template #currency="{ row }">
        <div class="flex-row align-center">
          <span>{{ $ti(currencyMap[row.old_currency]?.name) }}</span>
          <gv-icon v-if="row.new_currency" class="text-danger ml-4 mr-4" name="el-icon-right" />
          <span v-if="row.new_currency" class="text-danger fw-bold">
            {{ $ti(currencyMap[row.new_currency]?.name) }}
          </span>
        </div>
      </template>
      <template #kind="{ row }">
        <div class="flex-row align-center">
          <span>{{ $ti(row.old_kind) }}</span>
          <gv-icon v-if="row.new_kind" class="text-danger ml-4 mr-4" name="el-icon-right" />
          <span v-if="row.new_kind" class="text-danger fw-bold">
            {{ $ti(row.new_kind) }}
          </span>
        </div>
      </template>
      <template #amount="{ row }">
        <div class="flex-row align-center">
          <span>{{ row.old_amount }}</span>
          <gv-icon v-if="row.new_amount" class="text-danger ml-4 mr-4" name="el-icon-right" />
          <span v-if="row.new_amount" class="text-danger fw-bold">
            {{ row.new_amount }}
          </span>
        </div>
      </template>
      <template #bet_result="{ row }">
        <div class="flex-row align-center">
          <gv-bet-result-normal :bet-info="{ ...row, bet_result: row.old_bet_result }" :kinds-map="kindsMap" :size="40" />
          <gv-icon v-if="!!row.new_bet_result" class="text-danger ml-4 mr-4" name="el-icon-right" />
          <span v-if="!!row.new_bet_result" class="text-danger fw-bold">
            <gv-bet-result-normal :bet-info="{ ...row, bet_result: row.new_bet_result }" :kinds-map="kindsMap" :size="40" />
          </span>
        </div>
      </template>
      <template #bonus_amount="{ row }">
        <div class="flex-row align-center">
          <span>{{ row.old_bonus_amount }}</span>
          <gv-icon v-if="row.new_bonus_amount" class="text-danger ml-4 mr-4" name="el-icon-right" />
          <span v-if="row.new_bonus_amount" class="text-danger fw-bold">
            {{ row.new_bonus_amount }}
          </span>
        </div>
      </template>
      <template #bonus_profit_loss="{ row }">
        <div class="flex-row align-center">
          <span>{{ row.old_bonus_profit_loss }}</span>
          <gv-icon v-if="row.new_bonus_profit_loss" class="text-danger ml-4 mr-4" name="el-icon-right" />
          <span v-if="row.new_bonus_profit_loss" class="text-danger fw-bold">
            {{ row.new_bonus_profit_loss }}
          </span>
        </div>
      </template>
      <template #bonus_result="{ row }">
        <div class="flex-row align-center">
          <span>{{ getBonusResultName(row.old_bonus_result) }}</span>
          <gv-icon v-if="row.new_bonus_result" class="text-danger ml-4 mr-4" name="el-icon-right" />
          <span v-if="row.new_bonus_result" class="text-danger fw-bold">
            {{ getBonusResultName(row.new_bonus_result) }}
          </span>
        </div>
      </template>
      <template #operator="{ row }">
        <div class="flex-row align-center">
          <span>{{ row.old_operator }}</span>
          <gv-icon v-if="row.new_operator" class="text-danger ml-4 mr-4" name="el-icon-right" />
          <span v-if="row.new_operator" class="text-danger fw-bold">
            {{ row.new_operator }}
          </span>
        </div>
      </template>
    </gv-table>
  </div>
</template>
<script setup>
import { computed, nextTick, onActivated, onBeforeMount, shallowRef, unref, watch } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { backTab } from '@/store/tabs';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { useRoute } from 'vue-router';
import { areArraysEqual, deepClone, mappingArrayToObject, parseDict } from '@/tools';
import { LOG_OPERATOR_TYPE, LOG_OPERATOR_TYPE_DICT } from '@/values';
import { betActionLog } from '@/api/game-data/bet';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { useBetOpenShow } from '@/hooks/print-show';
import { $t } from '@/lang/i18n';
import { gameLists } from '@/api/game/list';
import { permsMap } from '@/api/perms';
import { financeTableLists } from '@/api/finance/table';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { useDictOptions } from '@/hooks/dict';
import { gameKindLists } from '@/api/game/kind';
import { currencyConfigLists } from '@/api/currency/config';
import { $ti } from '@/lang/input';
import { bounsConfigLists } from '@/api/bouns/config';
import GvIcon from '@/components/gv-icon/index.vue';
import GvBetResultNormal from '@/components/gv-bet-result-show/normal.vue';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';
import { TIME_RANGE_TYPE } from '@/tools/date';

const LOG_OPERATOR_TYPE_DICT_BET_LOG = deepClone(LOG_OPERATOR_TYPE_DICT);
const ADD_KEY = LOG_OPERATOR_TYPE_DICT_BET_LOG.findIndex((val) => val.value === LOG_OPERATOR_TYPE.add);
LOG_OPERATOR_TYPE_DICT_BET_LOG[ADD_KEY].name = $t('game_data.bet.title_gwm');

const route = useRoute();
const tableRef = shallowRef();

const title = computed(() => $t(route.query.title, route.query) || $t('common.operate_log'));

const refreshTable = () => tableRef.value?.refresh();

const { optionsData, refresh } = useDictOptions(
  { game: { api: gameLists }, kinds: { api: gameKindLists }, currencyConfig: { api: currencyConfigLists }, bonus: { api: bounsConfigLists } },
  true
);

const kindsMap = computed(() => mappingArrayToObject(optionsData.kinds ?? []));
const bonusMap = computed(() => mappingArrayToObject(optionsData.bonus ?? []));
const currencyMap = computed(() => mappingArrayToObject(optionsData.currencyConfig ?? []));

const getShowBetOldResult = useBetOpenShow(
  () => unref(kindsMap),
  (r) => r.old_bet_result
);

const getShowBetNewResult = useBetOpenShow(
  () => unref(kindsMap),
  (r) => r.new_bet_result
);

const { timeRangeActive, dateRangeType, dateRangeFormat, setTimeRange, getDefaultQuery, clearTimeRangeActive, resetTimeRangeActive, doubleExec } =
  useTimeRange(() => tableRef.value, {
    start: 'create_time_start',
    end: 'create_time_end',
    defActive: TIME_RANGE_TYPE.ninetyDay,
    defFilterTime: rangeTimeType.create_time
  });

const defaultQuery = computed(() => {
  const query = { ...route.query, ...getDefaultQuery() };
  delete query.title;
  delete query.request;
  delete query.del_user;
  return query;
});

const columns = computed(() => {
  const result = [
    { title: $t('common.user_no'), dataIndex: 'username', minWidth: 100 },
    { title: $t('common.game_no'), dataIndex: 'game_id', minWidth: 100, dict: parseDict(optionsData.game) },
    { title: $t('common.table_no'), dataIndex: 'table_name', minWidth: 100 },
    { title: $t('common.boot_no'), dataIndex: 'boot_number', minWidth: 100 },
    { title: $t('common.round_no'), dataIndex: 'round_number', minWidth: 100, func: (_, val) => getTwoResult(val.old_round, val.new_round, val) },
    {
      title: $t('game_data.bet_log.currency'),
      dataIndex: 'currency',
      minWidth: 160,
      func: (_, val) => getTwoResult(val.old_currency, val.new_currency, val, 'name')
    },
    { title: $t('common.kind_no'), dataIndex: 'kind', minWidth: 160, func: (_, val) => getTwoResult(val.old_kind, val.new_kind, val, 'name') },
    {
      title: $t('game_data.bet_log.amount'),
      dataIndex: 'amount',
      minWidth: 160,
      func: (_, val) => getTwoResult(val.old_amount, val.new_amount, val)
    },
    {
      title: $t('game_data.bet_log.bet_result'),
      dataIndex: 'bet_result',
      minWidth: 160,
      func: (_, val) => getTwoResult(val.old_bet_result, val.new_bet_result, val, 'bet_result')
    },
    {
      title: $t('game_data.bet_log.bonus_amount'),
      dataIndex: 'bonus_amount',
      minWidth: 160,
      func: (_, val) => getTwoResult(val.old_bonus_amount, val.new_bonus_amount, val)
    },
    {
      title: $t('game_data.bet_log.bonus_profit'),
      dataIndex: 'bonus_profit_loss',
      minWidth: 160,
      func: (_, val) => getTwoResult(val.old_bonus_profit_loss, val.new_bonus_profit_loss, val)
    },
    {
      title: $t('game_data.bet_log.bonus_result'),
      dataIndex: 'bonus_result',
      minWidth: 160,
      func: (_, val) => getTwoResult(val.old_bonus_result, val.new_bonus_result, val, 'bonus_result')
    },
    { title: $t('game_data.bet_log.bet_time'), dataIndex: 'bet_time', minWidth: 180, time: true },
    { title: $t('common.operate_type'), dataIndex: 'action', minWidth: 150, dict: parseDict(LOG_OPERATOR_TYPE_DICT_BET_LOG) },
    { title: $t('common.operate_person'), dataIndex: 'operator', minWidth: 150 },
    { title: $t('common.operate_time'), dataIndex: 'create_time', minWidth: 180, time: true }
  ];
  if (route.query.del_user) {
    result.splice(1, 1);
  }
  return result;
});

const handlerList = (list) => {
  list.forEach((item) => {
    // 补记处理
    if (item.action === LOG_OPERATOR_TYPE.add) {
      item.old_bet_info = item.bet_info;
      item.old_bonus_info = item.bonus_info;
      item.old_bet_result = item.bet_result;
      item.old_bet_info.work_no = item.operator;
      item.old_bet_info.round_number = item.round_number;
    }
    // 局号
    item.old_round = item.old_bet_info?.round_number;
    item.new_round = item.old_round === item.round_number ? null : item.round_number;
    // 投注项
    item.old_kind = item.old_bet_info?.game_kind_name;
    item.new_kind = item.old_kind === item.bet_info?.game_kind_name ? null : item.bet_info?.game_kind_name;
    // 投注金额
    item.old_amount = item.old_bet_info?.amount;
    item.new_amount = item.old_amount === item.bet_info?.amount ? null : item.bet_info?.amount;
    // 币种
    item.old_currency = item.old_bet_info?.currency_config_id;
    item.new_currency = item.old_currency === item.bet_info?.currency_config_id ? null : item.bet_info?.currency_config_id;
    // 彩金投注金额
    item.old_bonus_amount = item.old_bonus_info?.bonus_amount;
    item.new_bonus_amount = item.old_bonus_amount === item.bonus_info?.bonus_amount ? null : item.bonus_info?.bonus_amount;
    // 彩金投注收益
    item.old_bonus_profit_loss = item.old_bonus_info?.bonus_profit_loss;
    item.new_bonus_profit_loss = item.old_bonus_profit_loss === item.bonus_info?.bonus_profit_loss ? null : item.bonus_info?.bonus_profit_loss;
    // 彩金开奖
    item.old_bonus_result = item.old_bonus_info?.bonus_result;
    item.new_bonus_result = areArraysEqual(item.old_bonus_result, item.bonus_info?.bonus_result) ? null : item.bonus_info?.bonus_result;
    // 开牌结果
    // item.old_bet_result = item?.old_bet_result;
    item.new_bet_result = areArraysEqual(item.old_bet_result, item.bet_result) ? null : item.bet_result;
    // 操作人
    item.old_operator = item.old_bet_info?.work_no;
    item.new_operator = item.old_operator === item.operator ? null : item.operator;
  });

  console.log(list, '---------------1');
  return list;
};

const getBonusResultName = (value) => {
  return !!value?.[0] ? $ti(unref(bonusMap)[value[0]]?.name) : $t('common.prize_draw_no');
};

const getTwoResult = (old, now, row, type = 'normal') => {
  if (type === 'normal') {
    return (old ?? '') + (!!now ? '->' + now : '');
  } else if (type === 'name') {
    return $ti(old) + (!!now ? '->' + $ti(now) : '');
  } else if (type === 'bet_result') {
    return getShowBetOldResult(null, row) + (!!now ? '->' + getShowBetNewResult(null, row) : '');
  } else if (type === 'bonus_result') {
    const os = getBonusResultName(old);
    const ns = getBonusResultName(now);
    return os + (!!now ? '->' + ns : '');
  }
};

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
  await refreshTable();
});
</script>
