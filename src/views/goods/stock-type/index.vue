<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="stock_type-list"
      :request="stockTypeLists"
      :operate-width="160"
      :operate-perms="[permsMap.goods.type.edit, permsMap.goods.type.del]"
      :columns="columns"
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="$t('goods.stock_type.title')" @back="backTab($router)" />
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.goods.type.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.goods.type.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.goods.type.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { stockTypeSet, stockTypeDel, stockTypeLists } from '@/api/goods/stock-type';
import { shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { backTab } from '@/store/tabs';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('goods.stock_type.name'), dataIndex: 'name', minWidth: 100 },
  { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true }
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
  await stockTypeDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
