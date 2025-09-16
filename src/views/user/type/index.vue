<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="user-type-list"
      :request="userTypeLists"
      :operate-width="200"
      :operate-perms="[permsMap.user.type.edit, permsMap.user.type.del]"
      :columns="columns"
    >
      <template #search-box>
        <el-page-header class="pb-16" :content="$t('user.type.title')" @back="backTab($router)" />
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.user.type.edit]" type="primary" icon="Plus" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.user.type.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.user.type.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { userTypeAdd, userTypeDel, userTypeLists } from '@/api/user/type';
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
  { title: $t('user.type.name'), dataIndex: 'name', minWidth: 180 },
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
  await layer.confirm($t('common.del_confirm'));
  layer.loading();
  await userTypeDel({ id });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
