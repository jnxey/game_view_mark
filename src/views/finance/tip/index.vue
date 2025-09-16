<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="finance_table_tip-list"
      :request="financeTipLists"
      :operate-width="160"
      :popup-right-title="$t('common.operate_log')"
      :operate-perms="[permsMap.finance.tip.edit, permsMap.finance.tip.del]"
      delay-request
      :columns="columns"
      show-summary
      :handle-summary="useSummary('table_id')"
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-admin-inline class="search-item" place-top v-model="query.admin_id" :placeholder="$t('common.admin_no')" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_id"
          :placeholder="$t('common.table_no')"
          multiple
          :options="optionsData.table"
          :empty-page="{ perm: permsMap.finance.table.view }"
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
      <template #handler-left>
        <el-button
          v-perms="[permsMap.finance.tip.log]"
          type="primary"
          @click="toRoutePath(permsMap.finance.tip.log, { request: financeTipLog.symbol, title: 'finance.tip.title_log', del_user: true })"
        >
          {{ $t('common.operate_log') }}
        </el-button>
        <el-button v-perms="[permsMap.finance.tip.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
      </template>
      <!--        -->
      <template #popup-right>
        <gv-operate-record :request="financeTipLog" />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.finance.tip.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.finance.tip.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { computed, onActivated, onBeforeMount, shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { financeTipDel, financeTipLists, financeTipLog, financeTipSet } from '@/api/finance/tip';
import { financeTableLists } from '@/api/finance/table';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { useDictOptions } from '@/hooks/dict';
import { parseDict } from '@/tools';
import { currencyConfigLists } from '@/api/currency/config';
import GvSelectAdminInline from '@/components/gv-select-admin/inline.vue';
import { permsMap } from '@/api/perms';
import { toRoutePath } from '@/router';
import { $t } from '@/lang/i18n';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import { useSummary } from '@/hooks/summary';
import { GLOBAL_DICT } from '@/store/global-dict';

const editRef = shallowRef();
const tableRef = shallowRef();

const { optionsData, refresh } = useDictOptions({ table: { api: financeTableLists }, currencyConfig: { api: currencyConfigLists } }, true);

const columns = computed(() => {
  return [
    { title: $t('finance.tip.table'), dataIndex: 'table_id', minWidth: 100, dict: GLOBAL_DICT.value.table.mark },
    { title: $t('common.admin_no'), dataIndex: 'admin_name', minWidth: 100 },
    { title: $t('common.user_no'), dataIndex: 'username', minWidth: 100 },
    { title: $t('common.currency_config_no'), dataIndex: 'currency_config_id', minWidth: 100, dict: GLOBAL_DICT.value.currency_config.mark },
    { title: $t('finance.tip.amount'), dataIndex: 'amount', minWidth: 100 },
    { title: $t('common.remark'), dataIndex: 'remark', minWidth: 120 },
    { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 },
    { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
    { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true }
  ];
});

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await financeTipDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
  refreshTable();
});
</script>
