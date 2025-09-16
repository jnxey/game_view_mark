<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="perms_data-list"
      :request="roleDataPerms"
      :operate-width="200"
      :operate-perms="[permsMap.perms.data.edit, permsMap.perms.data.del]"
      :columns="columns"
    >
      <template #search-box>
        <el-page-header class="pb-16" :content="$t('perms.data.title')" @back="backTab($router)" />
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.perms.data.edit]" type="primary" icon="Plus" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.perms.data.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.perms.data.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { shallowRef } from 'vue';
import { OPERATE_TYPE, PERMS_DATA_CUSTOM, PERMS_DATA_RANGE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { permsMap } from '@/api/perms';
import { roleDataPerms, roleDataPermsDel } from '@/api/perms/role';
import { parseDict } from '@/tools';
import { DATA_PAGE_LIST } from '@/views/perms/data/_models';
import { backTab } from '@/store/tabs';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const tableRef = shallowRef();

const dateRangeMap = parseDict(PERMS_DATA_RANGE);

const columns = shallowRef([
  { title: $t('perms.data.apply_page'), dataIndex: 'apply_page', minWidth: 120, dict: parseDict(DATA_PAGE_LIST) },
  { title: $t('perms.data.name'), dataIndex: 'name', minWidth: 120 },
  {
    title: $t('common.time_range'),
    dataIndex: 'date_range_type',
    minWidth: 120,
    func: (_, row) => (row.date_range_type === PERMS_DATA_CUSTOM ? row.custom_days : dateRangeMap[row.date_range_type]?.name)
  },
  { title: $t('perms.data.description'), dataIndex: 'description', minWidth: 180 },
  { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
  { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true }
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
  await layer.confirm($t('common.del_confirm'));
  layer.loading();
  await roleDataPermsDel({ id });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
