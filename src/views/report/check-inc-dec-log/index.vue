<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="report_check_inc_dec_log-list"
      :request="reportCheckIncDecLog"
      :columns="columns"
      :default-query="defaultQuery"
      delay-request
      show-summary
      :handle-summary="useSummary('table_id')"
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="title" @back="backTab($router)" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_id"
          :placeholder="$t('common.table_no')"
          :options="optionsData.table"
          :empty-page="{ perm: permsMap.finance.table.view }"
        />
        <gv-daterange-picker
          class="search-item"
          v-place
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.operate_time')"
        />
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.currency_config_id"
          :placeholder="$t('common.currency_config_no')"
          :options="optionsData.currencyConfig"
          multiple
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
    </gv-table>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeMount, shallowRef, watch } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { backTab } from '@/store/tabs';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { useRoute } from 'vue-router';
import { reportCheckIncDecLog } from '@/api/report/game-check';
import { financeTableLists } from '@/api/finance/table';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import { parseDict } from '@/tools';
import { NUMBER_HANDLER_DICT } from '@/values';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';
import { useSummary } from '@/hooks/summary';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import { GLOBAL_DICT } from '@/store/global-dict';

const route = useRoute();
const tableRef = shallowRef();

const title = computed(() => $t(route.query.title, route.query) || $t('common.operate_log'));

const { optionsData, refresh } = useDictOptions(
  {
    table: { api: financeTableLists },
    currencyConfig: { api: currencyConfigLists }
  },
  true
);

const defaultQuery = computed(() => {
  const query = { ...route.query };
  delete query.title;
  delete query.request;
  delete query.del_user;
  return query;
});

const columns = computed(() => {
  return [
    { title: $t('common.table_no'), dataIndex: 'table_id', minWidth: 100, dict: GLOBAL_DICT.value.table.mark },
    { title: $t('common.currency_config_no'), dataIndex: 'currency_config_id', minWidth: 100, dict: GLOBAL_DICT.value.currency_config.mark },
    { title: $t('report.check_inc_dec_log.type'), dataIndex: 'type', minWidth: 100, dict: parseDict(NUMBER_HANDLER_DICT) },
    { title: $t('report.check_inc_dec_log.number'), dataIndex: 'number', minWidth: 100 },
    { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 },
    { title: $t('common.operate_time'), dataIndex: 'create_time', minWidth: 180, time: true }
  ];
});

const refreshTable = () => tableRef.value?.refresh();

onBeforeMount(async () => {
  await refresh();
  await refreshTable();
});
</script>
<style scoped lang="scss">
.info-card {
  border-radius: var(--gv-border-radius-mid);
  border: 1px solid var(--el-border-color);
}
</style>
