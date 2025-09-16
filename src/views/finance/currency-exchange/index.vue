<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="finance_currency_exchange-list"
      :request="financeCurrencyExchangeLists"
      delay-request
      :default-query="defaultQuery"
      :columns="columns"
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="$t('finance.currency_exchange.title')" @back="backTab($router)" />
        <el-input
          class="search-item"
          v-trim
          v-model="query.username"
          :placeholder="$t('finance.currency_exchange.username')"
          clearable
          @keyup.enter="search"
        />
        <gv-select-options
          class="search-item"
          v-model="query.account_type"
          place-top
          :options="IS_MEMBER_DICT"
          :placeholder="$t('finance.user_chip_log.is_member')"
        />
        <el-input class="search-item" v-trim v-model="query.work_no" :placeholder="$t('common.operate_person')" clearable @keyup.enter="search" />
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
    </gv-table>
  </div>
</template>

<script setup>
import { financeCurrencyExchangeLists } from '@/api/finance/currency-exchange';
import { shallowRef } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { backTab } from '@/store/tabs';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';
import { IS_MEMBER, IS_MEMBER_DICT } from '@/values';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { TIME_RANGE_TYPE } from '@/tools/date';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';

const { timeRangeActive, dateRangeType, dateRangeFormat, setTimeRange, getDefaultQuery, clearTimeRangeActive, resetTimeRangeActive, doubleExec } =
  useTimeRange(() => tableRef.value, {
    start: 'create_time_start',
    end: 'create_time_end',
    defActive: TIME_RANGE_TYPE.today,
    defFilterTime: rangeTimeType.create_time
  });

const defaultQuery = { ...getDefaultQuery() };

const columns = shallowRef([
  { title: $t('finance.currency_exchange.username'), dataIndex: 'username', minWidth: 100 },
  {
    title: $t('finance.user_chip_log.is_member'),
    dataIndex: 'account_type',
    minWidth: 100,
    func: (_, val) => {
      if (!val.account_type) return null;
      return IS_MEMBER.inset === val.account_type ? $t('other.values.yes_no_value_yes') : $t('other.values.yes_no_value_no');
    }
  },
  {
    title: $t('finance.currency_exchange.exchange_type'),
    dataIndex: 'from_currency_config_id',
    minWidth: 100,
    func: (_, val) => $ti(val.from_currency_config?.currency_name) + ' -> ' + $ti(val.to_currency_config?.currency_name)
  },
  { title: $t('finance.currency_exchange.rate'), dataIndex: 'rate', minWidth: 100, func: (_, val) => Number(_).toFixed(4, false) },
  { title: $t('finance.currency_exchange.exchange_amount'), dataIndex: 'exchange_amount', minWidth: 100 },
  { title: $t('finance.currency_exchange.total_amount'), dataIndex: 'total_amount', minWidth: 100 },
  { title: $t('common.remark'), dataIndex: 'remark', minWidth: 100 },
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 },
  { title: $t('common.operate_time'), dataIndex: 'create_time', minWidth: 180, time: true }
]);
</script>
