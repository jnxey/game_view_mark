<template>
  <div class="department">
    <gv-table
      ref="tableRef"
      table-key="org_department-list"
      :request="deptLists"
      :columns="columns"
      :default-query="defaultQuery"
      delay-request
      is-tree
      :show-select="false"
      :operate-perms="[permsMap.org.department.edit, permsMap.org.department.del]"
    >
      <template #search-box="{ query, search, reset }">
        <el-input class="search-item" v-trim v-model="query.name" :placeholder="$t('org.department.name')" clearable @keyup.enter="search" v-place />
        <gv-select-options class="search-item" place-top v-model="query.status" :placeholder="$t('common.status')" :options="STATUS_VALUE_DICT" />
        <el-button class="search-button" type="primary" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button v-perms="['dept.dept/add']" type="primary" @click="handleAdd()">
          <template #icon><gv-icon name="el-icon-Plus" /></template>
          {{ $t('common.add_btn') }}
        </el-button>
        <el-button @click="toggleExpand">{{ $t('common.expand') }}/{{ $t('common.fold') }}</el-button>
      </template>
      <template #operate-cell="{ row }">
        <el-button
          v-perms="[permsMap.org.department.edit]"
          type="primary"
          link
          :disabled="row.status === STATUS_VALUE.disable"
          @click="handleAdd(row.id)"
        >
          {{ $t('common.add_btn') }}
        </el-button>
        <el-button v-perms="[permsMap.org.department.edit]" type="primary" link @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button v-perms="[permsMap.org.department.del]" type="danger" link :disabled="row.pid === SYSTEM_PARENT_TOP" @click="handleDelete(row.id)">
          {{ $t('common.del_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>
<script setup>
import { deptAdd, deptDelete, deptEdit, deptLists } from '@/api/org/department';
import EditPopup from './_components/edit.vue';
import { nextTick, onMounted, shallowRef } from 'vue';
import GvIcon from '@/components/gv-icon/index.vue';
import layer from '@/tools/layer.js';
import GvTable from '@/components/gv-table/index.vue';
import { parseDict } from '@/tools';
import { OPERATE_TYPE, STATUS_VALUE, STATUS_VALUE_DICT, SYSTEM_PARENT_TOP } from '@/values';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const tableRef = shallowRef();
const editRef = shallowRef();

const defaultQuery = { status: '', name: '' };

const columns = shallowRef([
  { title: $t('org.department.name'), dataIndex: 'name', minWidth: 150 },
  { title: $t('common.status'), dataIndex: 'status', minWidth: 80, dict: parseDict(STATUS_VALUE_DICT) },
  { title: $t('common.sort'), dataIndex: 'sort', minWidth: 150 },
  { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true }
]);

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async (id) => {
  editRef.value?.open(OPERATE_TYPE.insert, id ? { pid: id } : undefined);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

const handleDelete = async (id) => {
  await layer.confirm($t('common.del_confirm'));
  layer.loading();
  await deptDelete({ id });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

const toggleExpand = () => {
  tableRef.value?.handleExpand();
};

onMounted(async () => {
  await refreshTable();
  await nextTick();
  toggleExpand();
});
</script>
