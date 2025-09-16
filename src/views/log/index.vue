<template>
  <div class="page-wrap">
    <gv-table ref="tableRef" table-key="log-list" :request="requestTable" :columns="columns" :default-query="defaultQuery" delay-request>
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="title" @back="backTab($router)" />
        <gv-select-user-inline v-if="!delUser" class="search-item" place-top v-model="query.user_id" :placeholder="$t('common.user_no')" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.action"
          :placeholder="$t('common.operate_type')"
          clearable
          :options="LOG_OPERATOR_TYPE_DICT"
        />
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
      <template #before_value="{ row }">
        <span>{{ $ti(row.before_value) }}</span>
      </template>
      <template #after_value="{ row }">
        <span>{{ $ti(row.after_value) }}</span>
      </template>
    </gv-table>
  </div>
</template>
<script setup>
import { computed, nextTick, onActivated, onBeforeMount, reactive, shallowRef, watch } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { backTab } from '@/store/tabs';
import { financeUserLog } from '@/api/finance/user-chip';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { useRoute } from 'vue-router';
import { parseDict } from '@/tools';
import { CURRENCY_TYPE_DICT, LOG_OPERATOR_TYPE_DICT } from '@/values';
import { betOpenLog } from '@/api/game-data/bet-open';
import { gameLastLog } from '@/api/game/list';
import { userLastLog } from '@/api/user/list';
import { financeTableLastLog } from '@/api/finance/table';
import { betActionLog } from '@/api/game-data/bet';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { financeCodeWashingSettlerLog } from '@/api/finance/code-washing';
import { carAdministerLog } from '@/api/external/car-administer';
import { carRecordLog } from '@/api/external/car-record';
import { carMaintainLog } from '@/api/external/car-maintain';
import { externalCostsLog } from '@/api/external/costs';
import { externalConsumeTypeLog } from '@/api/external/consume-type';
import { hotelManagementLog } from '@/api/external/hotel-management';
import { hotelRoomTypeLog } from '@/api/external/hotel-room-type';
import { hotelRoomRecordLog } from '@/api/external/hotel-room-record';
import { stockOrderLog } from '@/api/goods/stock-order';
import { financeTipLog } from '@/api/finance/tip';
import { $t } from '@/lang/i18n';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import { permsMap } from '@/api/perms';
import { $ti } from '@/lang/input';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { gameKindLastLog } from '@/api/game/kind';
import { TIME_RANGE_TYPE } from '@/tools/date';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';

const route = useRoute();
const tableRef = shallowRef();

const request = computed(() => route.query.request);

const title = computed(() => $t(route.query.title, route.query) || $t('common.operate_log'));

const delUser = computed(() => !!route.query.del_user);

const { optionsData, refresh } = useDictOptions({ currencyConfig: { api: currencyConfigLists } }, true);

const requestTable = computed(() => {
  if (request.value === financeUserLog.symbol) {
    return financeUserLog;
  } else if (request.value === betOpenLog.symbol) {
    return betOpenLog;
  } else if (request.value === gameLastLog.symbol) {
    return gameLastLog;
  } else if (request.value === userLastLog.symbol) {
    return userLastLog;
  } else if (request.value === financeTableLastLog.symbol) {
    return financeTableLastLog;
  } else if (request.value === betActionLog.symbol) {
    return betActionLog;
  } else if (request.value === financeCodeWashingSettlerLog.symbol) {
    return financeCodeWashingSettlerLog;
  } else if (request.value === carAdministerLog.symbol) {
    return carAdministerLog;
  } else if (request.value === carRecordLog.symbol) {
    return carRecordLog;
  } else if (request.value === carMaintainLog.symbol) {
    return carMaintainLog;
  } else if (request.value === externalCostsLog.symbol) {
    return externalCostsLog;
  } else if (request.value === externalConsumeTypeLog.symbol) {
    return externalConsumeTypeLog;
  } else if (request.value === hotelManagementLog.symbol) {
    return hotelManagementLog;
  } else if (request.value === hotelRoomTypeLog.symbol) {
    return hotelRoomTypeLog;
  } else if (request.value === hotelRoomRecordLog.symbol) {
    return hotelRoomRecordLog;
  } else if (request.value === stockOrderLog.symbol) {
    return stockOrderLog;
  } else if (request.value === financeTipLog.symbol) {
    return financeTipLog;
  } else if (request.value === gameKindLastLog.symbol) {
    return gameKindLastLog;
  }
});

const { timeRangeActive, dateRangeType, dateRangeFormat, setTimeRange, getDefaultQuery, clearTimeRangeActive, resetTimeRangeActive, doubleExec } =
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
  return [
    { title: $t('common.user_no'), dataIndex: 'username', minWidth: 100, hide: !!delUser.value },
    { title: $t('log.change_name'), dataIndex: 'change_field_name', minWidth: 100 },
    { title: $t('common.log_before_value'), dataIndex: 'before_value', minWidth: 150 },
    { title: $t('common.log_after_value'), dataIndex: 'after_value', minWidth: 150 },
    { title: $t('common.operate_type'), dataIndex: 'action', minWidth: 150, dict: parseDict(LOG_OPERATOR_TYPE_DICT) },
    { title: $t('common.operate_person'), dataIndex: 'operator', minWidth: 150 },
    { title: $t('common.operate_time'), dataIndex: 'create_time', minWidth: 180, time: true }
  ];
});

const refreshTable = () => tableRef.value?.refresh();

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
});
</script>
