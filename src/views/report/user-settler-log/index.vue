<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="report_user_settler_log-list"
      :request="reportUserIncomeSettlerLog"
      :columns="columns"
      :default-query="defaultQuery"
      @selection-change="selectionChange"
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
        <gv-daterange-picker
          class="search-item"
          v-place
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.operate_time')"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button type="primary" :disabled="!selected.length" @click="printReceipts">{{ $t('report.user_settler_log.btn_print') }}</el-button>
      </template>
      <template #settle_time="{ row }">
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
import { formatServerTime, getTimeFormat, printElement } from '@/tools';
import dayjs from 'dayjs';
import { reportUserIncomeSettlerLog } from '@/api/report/user';
import { systemState } from '@/store/system';
import { getReportUserProfitTempReceipts } from '@/views/report/user-settler-log/_models';
import { $t } from '@/lang/i18n';

const route = useRoute();
const tableRef = shallowRef();
const selected = shallowRef([]);

const title = computed(() => $t(route.query.title, route.query) || $t('common.operate_log'));

const defaultQuery = computed(() => {
  const query = { ...route.query };
  delete query.title;
  delete query.request;
  delete query.del_user;
  return query;
});

const columns = computed(() => {
  const result = [
    { title: $t('common.user_no'), dataIndex: 'username', minWidth: 100 },
    { title: $t('report.user_settler_log.total_amount'), dataIndex: 'total_amount', minWidth: 150 },
    { title: $t('report.user_settler_log.total_bet_profit_loss'), dataIndex: 'total_bet_profit_loss', minWidth: 150 },
    { title: $t('report.user_settler_log.total_code_washing'), dataIndex: 'total_code_washing', minWidth: 150 },
    { title: $t('report.user_settler_log.total_code_washing_fee'), dataIndex: 'total_code_washing_fee', minWidth: 150 },
    { title: $t('report.user_settler_log.total_user_profit_loss'), dataIndex: 'total_user_profit_loss', minWidth: 150 },
    { title: $t('report.user_settler_log.settle_time'), dataIndex: 'settle_time', minWidth: 150 },
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
  const temp = getReportUserProfitTempReceipts(
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
  border: 1px solid var(--el-border-color);
}
</style>
