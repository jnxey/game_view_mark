<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="finance_table_type-list"
      :request="financeBetCodeWashingLogs"
      :columns="columns"
      :default-query="defaultQuery"
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="title" @back="backTab($router)" />
        <gv-select-user-inline class="search-item" place-top v-model="query.user_id" :placeholder="$t('common.user_no')" />
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.currency_config_id"
          :placeholder="$t('common.currency_config_no')"
          multiple
          :options="optionsData.currencyConfig"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.is_modify"
          :placeholder="$t('finance.bet_separate_log.change_type')"
          :options="CODE_WASH_CHANGE_TYPE_DICT"
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
      <template #need_settle_amount="{ row }">
        <gv-profit :value="calcAmount(Number(row.change_amount) + Number(row.settlement_amount), false)" />
      </template>
      <template #change_source="{ row }">
        <!--   结算     -->
        <template v-if="row.is_modify === CODE_WASH_CHANGE_TYPE.settle && !!row.settlement_log">
          <bet-separate-settler :info-obj="row" />
        </template>
        <template v-else-if="row.is_modify === CODE_WASH_CHANGE_TYPE.modify">
          <bet-separate-modify :info-obj="row" :kinds-map="kindsMap" :currency-config-map="currencyConfigMap" />
        </template>
        <template v-else-if="row.is_modify === CODE_WASH_CHANGE_TYPE.enter || row.is_modify === CODE_WASH_CHANGE_TYPE.gwm">
          <bet-separate-enter :info-obj="row" :kinds-map="kindsMap" :currency-config-map="currencyConfigMap" />
        </template>
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
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { financeBetCodeWashingLogs } from '@/api/finance/code-washing';
import { $t } from '@/lang/i18n';
import { calcAmount, formatServerTime, getTimeFormat, isString, mappingArrayToObject, parseDict } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import { gameKindLists } from '@/api/game/kind';
import { CODE_WASH_CHANGE_TYPE, CODE_WASH_CHANGE_TYPE_DICT } from '@/values';
import { useBetOpenShow } from '@/hooks/print-show';
import { TIME_RANGE_TYPE } from '@/tools/date';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';
import { GLOBAL_DICT } from '@/store/global-dict';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import GvBetResultNormal from '@/components/gv-bet-result-show/normal.vue';
import GvProfit from '@/components/gv-profit/index.vue';
import dayjs from 'dayjs';
import { $ti } from '@/lang/input';
import GvIcon from '@/components/gv-icon/index.vue';
import BetSeparateSettler from '@/views/finance/bet-separate-log/_components/bet-separate-settler.vue';
import BetSeparateEnter from '@/views/finance/bet-separate-log/_components/bet-separate-enter.vue';
import BetSeparateModify from '@/views/finance/bet-separate-log/_components/bet-separate-modify.vue';
import { currencyConfigLists } from '@/api/currency/config';

const route = useRoute();
const tableRef = shallowRef();

const codeWashChangeTypeMap = parseDict(CODE_WASH_CHANGE_TYPE_DICT);

const title = computed(() => $t(route.query.title, route.query) || $t('common.operate_log'));

const { optionsData, refresh } = useDictOptions({ kinds: { api: gameKindLists }, currencyConfig: { api: currencyConfigLists } }, true);

const kindsMap = computed(() => mappingArrayToObject(optionsData.kinds ?? []));
const currencyConfigMap = computed(() => mappingArrayToObject(optionsData.currencyConfig ?? []));

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
    { title: $t('finance.bet_separate_log.username'), dataIndex: 'username', minWidth: 100 },
    { title: $t('finance.bet_separate_log.change_type'), dataIndex: 'is_modify', minWidth: 100, dict: codeWashChangeTypeMap },
    { title: $t('common.currency_config_no'), dataIndex: 'currency_config_id', minWidth: 100, dict: GLOBAL_DICT.value.currency_config.mark },
    { title: $t('finance.bet_separate_log.change_amount'), dataIndex: 'change_amount', minWidth: 100, profit: true },
    { title: $t('finance.bet_separate_log.need_settle_amount'), dataIndex: 'need_settle_amount', minWidth: 100 },
    { title: $t('finance.bet_separate_log.change_source'), dataIndex: 'change_source', minWidth: 360 },
    { title: $t('common.operate_time'), dataIndex: 'create_time', minWidth: 180, time: true }
  ];
  if (route.query.del_user) {
    result.splice(1, 1);
  }
  return result;
});

const refreshTable = () => tableRef.value?.refresh();

const getPercent = (val) => {
  return (Number(val) * 100).toFixed(2, false) + '%';
};

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
});
</script>
