<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="report_day-list"
      :request="reportDayLists"
      row-key="UID"
      :operate-width="160"
      show-summary
      :handle-summary="useSummary('data_day')"
      :columns="columns"
      :default-query="defaultQuery"
      delay-request
      @table-data-change="refreshIsMerge"
      @format-columns-change="refreshSplitColumns"
      :is-extend="isMerge"
      hide-extend-button
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-user-inline class="search-item" place-top v-model="query.user_id" :placeholder="$t('common.user_no')" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.game_id"
          :placeholder="$t('common.game_no')"
          multiple
          :request="gameLists"
          :empty-page="{ perm: permsMap.game.list.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.game_kind_id"
          :placeholder="$t('common.kind_no')"
          multiple
          :request="gameKindLists"
          :group-options="{ field: 'game_model', dict: GAME_MODEL_DICT }"
          filterable
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
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_type_id"
          :placeholder="$t('common.table_type')"
          multiple
          :request="financeTableTypeLists"
          :empty-page="{ perm: permsMap.finance.table_type.view }"
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
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.currency_config_id"
          muted
          :placeholder="$t('common.currency_config_no')"
          multiple
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.user_type_id"
          :placeholder="$t('common.user_type_no')"
          multiple
          :options="optionsData.dimension?.user_type"
          :empty-page="{ perm: permsMap.user.type.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.is_shares"
          :placeholder="$t('report.search_box.is_shares')"
          :options="SHARE_REBATE_VALUE_DICT"
        />
        <br />
        <el-radio-group class="search-item auto box" v-model="query.filter_time" @change="setDateRangeType">
          <el-radio-button :label="$t('common.create_time')" :value="rangeTimeType.create_time" />
          <el-radio-button :label="$t('common.close_time')" :value="rangeTimeType.close_time" />
        </el-radio-group>
        <el-radio-group v-model="timeRangeActive" class="search-item auto box" @change="setTimeRange">
          <el-radio-button :label="$t('common.today')" :value="TIME_RANGE_TYPE.today" />
          <el-radio-button :label="$t('common.yesterday')" :value="TIME_RANGE_TYPE.yesterday" />
          <el-radio-button :label="$t('common.before_yesterday')" :value="TIME_RANGE_TYPE.beforeYesterday" />
          <el-radio-button :label="$t('common.this_month')" :value="TIME_RANGE_TYPE.thisMonth" />
          <el-radio-button :label="$t('common.last_month')" :value="TIME_RANGE_TYPE.lastMonth" />
        </el-radio-group>
        <gv-daterange-picker
          v-show="showTimeRange"
          class="search-item"
          v-model:startTime="query.time_start"
          v-model:endTime="query.time_end"
          :placeholder="$t('common.time_range')"
          type="daterange"
          :show-format="getTimeFormat('day')"
          v-place
          :clearable="false"
          @click="clearTimeRangeActive"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="doubleExec(reset, resetTimeRangeActive)">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #expand-column="{ row }">
        <report-expand :left-space="150" :row="row" :split-columns="splitColumns" :expand-value="expandValue" :extend-width="extendWidth" />
      </template>
      <template #prev-column>
        <el-table-column v-if="!!isMerge" :width="110" align="center" :show-overflow-tooltip="false" :resizable="false">
          <template #default="{ row }">
            <el-button text type="primary" @click.stop="expandCurrencyColumn(row)">
              <span class="mr-4">{{ $t('report.user.btn_expand_currency_open') }}</span>
              <gv-icon v-if="!expandCache[row.UID]" name="el-icon-arrow-right" />
              <gv-icon v-if="!!expandCache[row.UID]" name="el-icon-arrow-down" />
            </el-button>
          </template>
        </el-table-column>
      </template>
    </gv-table>
    <report-bet-details ref="reportBetDetailsRef" />
  </div>
</template>

<script setup>
import { onMounted, shallowRef } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import { useDictOptions } from '@/hooks/dict';
import { userDimension } from '@/api/user/list';
import { reportDayDetail, reportDayLists } from '@/api/report/day';
import { financeTableLists } from '@/api/finance/table';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { gameLists } from '@/api/game/list';
import { financeTableTypeLists } from '@/api/finance/table-type';
import { GAME_MODEL_DICT, SHARE_REBATE_VALUE_DICT, STATUS_VALUE_DICT, YES_NO_VALUE, YES_NO_VALUE_DICT } from '@/values';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { getTimeRange, TIME_RANGE_TYPE } from '@/tools/date';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';
import { userTypeLists } from '@/api/user/type';
import { userLevelLists } from '@/api/user/level';
import { gameKindLists } from '@/api/game/kind';
import { permsMap } from '@/api/perms';
import { useSummary } from '@/hooks/summary';
import { $t } from '@/lang/i18n';
import ReportBetDetails from '@/views/report/_components/report-bet-details.vue';
import { getMultipleKey, getTimeFormat } from '@/tools';
import { $ti } from '@/lang/input';
import { useCurrencyExtend } from '@/views/report/_hooks/column-extend';
import ReportExpand from '@/views/report/_components/report-expand.vue';
import GvIcon from '@/components/gv-icon/index.vue';

const {
  timeRangeActive,
  dateRangeType,
  dateRangeFormat,
  showTimeRange,
  setTimeRange,
  setDateRangeType,
  getDefaultQuery,
  clearTimeRangeActive,
  resetTimeRangeActive,
  doubleExec
} = useTimeRange(() => tableRef.value, { defActive: TIME_RANGE_TYPE.today }, true);

const defaultQuery = { ...getDefaultQuery() };

const tableRef = shallowRef();
const reportBetDetailsRef = shallowRef();

const { optionsData } = useDictOptions({ dimension: { api: userDimension } });

const columns = shallowRef([
  { title: $t('report.table_col.date'), dataIndex: 'data_day', minWidth: 120, click: (row) => handleBetDetails(row), subHide: true },
  { title: $t('common.currency_config_no'), dataIndex: 'currency_config_name', minWidth: 100 },
  { title: $t('report.table_col.total_amount'), dataIndex: 'total_amount', minWidth: 100 },
  { title: $t('report.table_col.total_rake'), dataIndex: 'total_rake', minWidth: 100 },
  { title: $t('report.table_col.total_code_washing'), dataIndex: 'total_code_washing', minWidth: 100 },
  { title: $t('report.table_col.total_code_washing_fee'), dataIndex: 'total_code_washing_fee', minWidth: 100 },
  { title: $t('report.table_col.total_bet_profit_loss'), dataIndex: 'total_bet_profit_loss', minWidth: 100 },
  { title: $t('report.table_col.total_code_washing_profit_loss'), dataIndex: 'total_code_washing_profit_loss', minWidth: 120 },
  { title: $t('report.table_col.total_cost'), dataIndex: 'total_cost', minWidth: 100 },
  { title: $t('report.table_col.total_code_washing_profit_loss_cost'), dataIndex: 'total_code_washing_profit_loss_cost', minWidth: 180 },
  { title: $t('report.table_col.total_user_profit_loss'), dataIndex: 'total_user_profit_loss', minWidth: 160 },
  { title: $t('report.table_col.total_company_profit_loss'), dataIndex: 'total_company_profit_loss', minWidth: 160 },
  { title: $t('report.table_col.total_bonus_profit_loss'), dataIndex: 'total_bonus_profit_loss', minWidth: 100 },
  { title: $t('report.table_col.total_net_earning'), dataIndex: 'total_net_earning', minWidth: 150 },
  { title: $t('report.table_col.total_shareholder_net_earning'), dataIndex: 'total_shareholder_net_earning', minWidth: 150 },
  { title: $t('report.table_col.total_company_net_earning'), dataIndex: 'total_company_net_earning', minWidth: 150 }
]);

// 展开功能
const { splitColumns, isMerge, expandValue, extendWidth, expandCache, refreshIsMerge, refreshSplitColumns, toggleRowExpansion, refreshExpandChange } =
  useCurrencyExtend(() => tableRef.value, reportDayDetail, { key: 'data_day', value: 'data_day' });

const expandCurrencyColumn = (row) => {
  toggleRowExpansion(row);
  refreshExpandChange(row);
};

// 查看注单详情
const handleBetDetails = async (row) => {
  const query = tableRef.value?.getQuery();
  reportBetDetailsRef.value?.open(
    {
      user_id: query.user_id,
      username: query.username,
      filter_time: query.filter_time,
      time_start: row.create_time_start,
      time_end: row.create_time_end,
      table_id: query.table_id,
      game_id: query.game_id,
      table_type_id: query.table_type_id,
      currency_config_id: query.currency_config_id
    },
    timeRangeActive.value
  );
};

onMounted(() => {
  refreshSplitColumns();
});
</script>
