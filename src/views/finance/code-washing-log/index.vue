<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="finance_code_washing_log-list"
      :request="financeCodeWashingSettlerLog"
      :columns="columns"
      :default-query="defaultQuery"
      @selection-change="selectionChange"
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="title" @back="backTab($router)" />
        <gv-select-user-inline
          class="search-item"
          place-top
          v-model="query.user_ids"
          :placeholder="$t('common.user_no')"
          :disabled="!!defaultQuery.user_ids"
        />
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.currency_config_id"
          muted
          :placeholder="$t('finance.code_washing_log.settler_currency')"
          multiple
        />
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.actual_currency_config_id"
          muted
          :placeholder="$t('finance.code_washing_log.settler_after_currency')"
          multiple
        />
        <el-input-number
          v-place
          v-model="query.actual_settle_amount_start"
          :placeholder="$t('finance.code_washing_log.actual_settle_amount_start')"
          clearable
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          :controls="false"
          class="search-item"
        />
        <el-input-number
          v-place
          v-model="query.actual_settle_amount_end"
          :placeholder="$t('finance.code_washing_log.actual_settle_amount_end')"
          clearable
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          :controls="false"
          class="search-item"
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
          v-place
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.operate_time')"
          :type="dateRangeType"
          :show-format="dateRangeFormat"
          @click="clearTimeRangeActive"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="doubleExec(reset, resetTimeRangeActive)">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button type="primary" :disabled="!selected.length" @click="printReceipts">{{ $t('finance.code_washing_log.btn_print') }}</el-button>
      </template>
      <template #before_balance_code_washing_fee="{ row }">
        <div class="info-card flex-row flex-wrap align-top p-4">
          <div class="bet-info ml-4 fz-12 text-line-1_5">
            <div class="info-row">
              <span class="info-label">{{ $t('finance.code_washing_log.balance_code_washing_fee') }}：</span>
              <span class="info-content">{{ row.before_balance_code_washing_fee }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('finance.code_washing_log.mistake_code_washing_fee') }}：</span>
              <span class="info-content">{{ row.before_mistake_code_washing_fee }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">{{ $t('finance.code_washing_log.total_code_washing_fee') }}：</span>
              <span class="info-content">{{ row.settle_amount }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #after_balance_code_washing_fee="{ row }">
        <div class="info-card flex-row flex-wrap align-top p-4">
          <div class="bet-info ml-4 fz-12 text-line-1_5">
            <div class="info-row">
              <span class="info-label">{{ $t('finance.code_washing_log.balance_code_washing_fee') }}：</span>
              <span class="info-content">{{ row.after_balance_code_washing_fee }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #settler_start_time="{ row }">
        <div class="flex-col">
          <div class="fz-12">{{ $t('common.from') }}: {{ dayjs(formatServerTime(row.settler_start_time)).format(getTimeFormat()) }}</div>
          <div class="fz-12">{{ $t('common.to') }}: {{ dayjs(formatServerTime(row.settler_end_time)).format(getTimeFormat()) }}</div>
        </div>
      </template>
    </gv-table>
  </div>
</template>
<script setup>
import { computed, nextTick, shallowRef, watch } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { backTab } from '@/store/tabs';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { useRoute } from 'vue-router';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { financeCodeWashingSettlerLog } from '@/api/finance/code-washing';
import { formatServerTime, getTimeFormat, printElement } from '@/tools';
import dayjs from 'dayjs';
import { getCodeWashingTempReceipts } from '@/views/finance/code-washing-log/_models';
import { systemState } from '@/store/system';
import { useDateRangeShow, useJointShow } from '@/hooks/print-show';
import { $t } from '@/lang/i18n';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import { GLOBAL_DICT } from '@/store/global-dict';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';
import { TIME_RANGE_TYPE } from '@/tools/date';

const route = useRoute();
const tableRef = shallowRef();
const selected = shallowRef([]);

const title = computed(() => $t(route.query.title, route.query) || $t('common.operate_log'));

const { timeRangeActive, dateRangeType, dateRangeFormat, setTimeRange, getDefaultQuery, clearTimeRangeActive, doubleExec, resetTimeRangeActive } =
  useTimeRange(() => tableRef.value, {
    start: 'create_time_start',
    end: 'create_time_end',
    defActive: TIME_RANGE_TYPE.today,
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
    {
      title: $t('finance.code_washing_log.settler_currency'),
      dataIndex: 'currency_config_id',
      minWidth: 100,
      dict: GLOBAL_DICT.value.currency_config.mark
    },
    { title: $t('finance.code_washing_log.settler_amount'), dataIndex: 'actual_settle_amount', minWidth: 150 },
    {
      title: $t('finance.code_washing_log.settler_after_currency'),
      dataIndex: 'actual_currency_config_id',
      minWidth: 100,
      dict: GLOBAL_DICT.value.currency_config.mark
    },
    {
      title: $t('finance.code_washing_log.settler_before'),
      dataIndex: 'before_balance_code_washing_fee',
      minWidth: 150,
      printShow: useJointShow('before_balance_code_washing_fee', 'before_mistake_code_washing_fee')
    },
    {
      title: $t('finance.code_washing_log.settler_after'),
      dataIndex: 'after_balance_code_washing_fee',
      minWidth: 150,
      printShow: useJointShow('after_balance_code_washing_fee', 'after_mistake_code_washing_fee')
    },
    {
      title: $t('finance.code_washing_log.settler_time'),
      dataIndex: 'settler_start_time',
      minWidth: 150,
      printShow: useDateRangeShow('settler_start_time', 'settler_end_time')
    },
    { title: $t('common.remark'), dataIndex: 'remark', minWidth: 150 },
    { title: $t('common.operate_person'), dataIndex: 'operator', minWidth: 150 },
    { title: $t('common.operate_time'), dataIndex: 'create_time', minWidth: 180, time: true }
  ];
  if (route.query.del_user) {
    result.splice(1, 1);
  }
  return result;
});

// 打印小票
const printReceipts = async () => {
  const list = selected.value ?? [];
  const temp = getCodeWashingTempReceipts(
    list.map((row) => ({
      ...row,
      web_name: systemState.config.web_name,
      start_time: dayjs(formatServerTime(row.settler_start_time)).format(getTimeFormat()),
      end_time: dayjs(formatServerTime(row.settler_end_time)).format(getTimeFormat())
    }))
  );
  printElement(temp);
};

// 选中行变更
const selectionChange = (rows) => {
  selected.value = rows;
};
</script>
<style scoped lang="scss">
.info-card {
  border-radius: var(--gv-border-radius-mid);
}
</style>
