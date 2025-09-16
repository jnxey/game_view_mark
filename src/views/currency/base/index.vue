<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="currency_base-list"
      :request="currencyBaseLists"
      :operate-width="160"
      :operate-perms="[permsMap.currency.base.edit, permsMap.currency.base.del]"
      :columns="columns"
      :default-query="defaultQuery"
    >
      <template #search-box>
        <el-page-header class="pb-16" :content="$t('currency.base.title')" @back="backTab($router)" />
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.currency.base.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.currency.base.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.currency.base.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { currencyBaseSet, currencyBaseDel, currencyBaseLists } from '@/api/currency/base';
import { shallowRef } from 'vue';
import { OPERATE_TYPE, YES_NO_VALUE_DICT } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { backTab } from '@/store/tabs';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { parseDict } from '@/tools';

const defaultQuery = { virtual_status: null };

const editRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('currency.base.name'), dataIndex: 'name', minWidth: 100 },
  { title: $t('currency.base.image'), dataIndex: 'image', minWidth: 100, image: true },
  { title: $t('currency.base.icon'), dataIndex: 'icon', minWidth: 100 },
  { title: $t('currency.base.abbreviation'), dataIndex: 'abbreviation', minWidth: 100 },
  { title: $t('currency.base.virtual_status'), dataIndex: 'virtual_status', minWidth: 100, dict: parseDict(YES_NO_VALUE_DICT) },
  { title: $t('currency.base.color'), dataIndex: 'color', minWidth: 100, color: true }
]);

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
  await currencyBaseDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
