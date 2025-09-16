<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="game_data_close-list"
      :request="reportGameCloseList"
      :handler-list="handlerList"
      :handler-extend="handlerExtend"
      :operate-width="160"
      :columns="columns"
      :default-query="defaultQuery"
      show-summary
      :handle-summary="useSummary('table_id')"
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_id"
          :options="optionsData.table"
          :placeholder="$t('common.table_no')"
          :empty-page="{ perm: permsMap.finance.table.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_type_id"
          :placeholder="$t('common.table_type')"
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
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.game_id"
          :options="optionsData.game"
          :placeholder="$t('common.game_no')"
          :empty-page="{ perm: permsMap.game.list.view }"
        />
        <br />
        <el-radio-group v-model="timeRangeActive" class="search-item auto box" @change="setTimeRange">
          <el-radio-button :label="$t('common.today')" :value="TIME_RANGE_TYPE.today" />
          <el-radio-button :label="$t('common.yesterday')" :value="TIME_RANGE_TYPE.yesterday" />
          <el-radio-button :label="$t('common.before_yesterday')" :value="TIME_RANGE_TYPE.beforeYesterday" />
          <el-radio-button :label="$t('common.this_month')" :value="TIME_RANGE_TYPE.thisMonth" />
          <el-radio-button :label="$t('common.last_month')" :value="TIME_RANGE_TYPE.lastMonth" />
        </el-radio-group>
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.close_time_start"
          v-model:endTime="query.close_time_end"
          :placeholder="$t('report.close.close_time')"
          :type="dateRangeType"
          :show-format="dateRangeFormat"
          v-place
          :clearable="false"
          @click="clearTimeRangeActive"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="doubleExec(reset, resetTimeRangeActive)">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #uid="{ row }">
        <span class="link" @click.stop="handleDetail(row)">{{ $t('report.close.btn_check_detail') }}</span>
      </template>
    </gv-table>
    <report-close-check ref="reportCloseCheckRef" />
  </div>
</template>

<script setup>
import { computed, onActivated, onMounted, shallowRef } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { useDictOptions } from '@/hooks/dict';
import { reportGameCloseList } from '@/api/report/game-check';
import { financeTableLists } from '@/api/finance/table';
import { gameLists } from '@/api/game/list';
import { parseDict } from '@/tools';
import { financeTableTypeLists } from '@/api/finance/table-type';
import { currencyConfigLists } from '@/api/currency/config';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { getTimeRange, TIME_RANGE_TYPE } from '@/tools/date';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';
import ReportCloseCheck from '@/views/report/close/_components/report-close-check.vue';
import { permsMap } from '@/api/perms';
import { useSummary } from '@/hooks/summary';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';
import { GLOBAL_DICT } from '@/store/global-dict';

const today = getTimeRange(TIME_RANGE_TYPE.today);

const tableRef = shallowRef();
const reportCloseCheckRef = shallowRef();

const { timeRangeActive, dateRangeType, dateRangeFormat, setTimeRange, getDefaultQuery, clearTimeRangeActive, resetTimeRangeActive, doubleExec } =
  useTimeRange(() => tableRef.value, {
    start: 'close_time_start',
    end: 'close_time_end',
    defActive: TIME_RANGE_TYPE.today,
    defFilterTime: rangeTimeType.close_time
  });

const defaultQuery = { ...getDefaultQuery() };

const { optionsData, refresh } = useDictOptions(
  {
    table: { api: financeTableLists },
    tableType: { api: financeTableTypeLists },
    game: { api: gameLists },
    currencyConfig: { api: currencyConfigLists }
  },
  true
);

const columns = computed(() => {
  const config = optionsData.currencyConfig ?? [];
  const cols = [];
  config.forEach((item) => {
    cols.push({ title: `${$ti(item.name)} ${$t('report.close.sm_number')}`, dataIndex: `${item.id}_sm_number`, minWidth: 150 });
    cols.push({ title: `${$ti(item.name)} ${$t('report.close.gap')}`, dataIndex: `${item.id}_gap`, minWidth: 150 });
    cols.push({ title: `${$ti(item.name)} ${$t('report.close.code_washing')}`, dataIndex: `${item.id}_code_washing`, minWidth: 150 });
    cols.push({ title: `${$ti(item.name)} ${$t('report.close.code_washing_fee')}`, dataIndex: `${item.id}_code_washing_fee`, minWidth: 150 });
    cols.push({ title: `${$ti(item.name)} ${$t('report.close.chip_inc')}`, dataIndex: `${item.id}_inc`, minWidth: 150 });
    cols.push({ title: `${$ti(item.name)} ${$t('report.close.chip_dec')}`, dataIndex: `${item.id}_dec`, minWidth: 150 });
  });
  return [
    { title: $t('common.operate_col'), dataIndex: 'uid', minWidth: 150, fixed: 'left', noTooltip: true },
    { title: $t('common.table_no'), dataIndex: 'table_id', minWidth: 120, dict: GLOBAL_DICT.value.table.mark },
    { title: $t('common.table_type'), dataIndex: 'table_type_id', minWidth: 120, dict: parseDict(optionsData.tableType) },
    { title: $t('common.game_no'), dataIndex: 'game_id', minWidth: 120, dict: GLOBAL_DICT.value.game.mark },
    { title: $t('common.boot_no'), dataIndex: 'boot_number', minWidth: 120 },
    { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
    ...cols,
    { title: $t('report.close.work_no'), dataIndex: 'work_no', minWidth: 120 }
  ];
});

const handlerList = (list) => {
  list.forEach((item) => {
    const details = item.details ?? [];
    details.forEach((detail) => {
      item[`${detail.currency_config_id}_sm_number`] = detail.sm_number;
      item[`${detail.currency_config_id}_gap`] = detail.sm_gap;
      item[`${detail.currency_config_id}_code_washing`] = detail.code_washing;
      item[`${detail.currency_config_id}_code_washing_fee`] = detail.code_washing_fee;
      item[`${detail.currency_config_id}_inc`] = detail.inc;
      item[`${detail.currency_config_id}_dec`] = detail.dec;
    });
  });
  return list;
};

// 处理扩展数据
const handlerExtend = (extend) => {
  const countInfo = {};
  Object.keys(extend.summation ?? {}).forEach((p) => {
    const detail = extend.summation[p];
    countInfo[`${p}_sm_number`] = detail.sm_number;
    countInfo[`${p}_gap`] = detail.sm_gap;
    countInfo[`${p}_code_washing`] = detail.code_washing;
    countInfo[`${p}_code_washing_fee`] = detail.code_washing_fee;
    countInfo[`${p}_inc`] = detail.inc;
    countInfo[`${p}_dec`] = detail.dec;
  });
  return { summation: countInfo };
};

const refreshTable = () => tableRef.value?.refresh();

const handleDetail = async (row) => {
  reportCloseCheckRef.value?.open(row);
};

onActivated(() => refresh());

onMounted(async () => {
  await refresh();
});
</script>
