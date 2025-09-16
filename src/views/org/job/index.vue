<template>
  <div class="post-lists">
    <gv-table
      ref="tableRef"
      table-key="org_post-list"
      :request="jobsLists"
      :columns="columns"
      :default-query="defaultQuery"
      :operate-perms="[permsMap.org.job.edit, permsMap.org.job.del]"
    >
      <!--      -->
      <template #search-box="{ query, search, reset }">
        <el-input class="search-item" v-trim v-model="query.code" :placeholder="$t('org.job.code')" clearable @keyup.enter="search" v-place />
        <el-input class="search-item" v-trim v-model="query.name" :placeholder="$t('org.job.name')" clearable @keyup.enter="search" v-place />
        <gv-select-options class="search-item" place-top v-model="query.status" :placeholder="$t('common.status')" :options="STATUS_VALUE_DICT" />
        <el-button class="search-button" type="primary" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <!--      -->
      <template #handler-left>
        <el-button v-perms="[permsMap.org.job.edit]" type="primary" @click="handleAdd()">
          <template #icon><gv-icon name="el-icon-Plus" /></template>
          {{ $t('common.add_btn') }}
        </el-button>
      </template>
      <!--      -->
      <template #operate-cell="{ row }">
        <el-button v-perms="[permsMap.org.job.edit]" type="primary" link @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button v-perms="[permsMap.org.job.del]" type="danger" link @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>
<script setup>
import { jobsAdd, jobsDelete, jobsEdit, jobsLists } from '@/api/org/job';
import EditPopup from './_components/edit.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import { shallowRef } from 'vue';
import layer from '@/tools/layer.js';
import GvTable from '@/components/gv-table/index.vue';
import { OPERATE_TYPE, STATUS_VALUE_DICT } from '@/values';
import { parseDict } from '@/tools';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const tableRef = shallowRef();

const defaultQuery = { code: '', name: '', status: '' };

const columns = shallowRef([
  { title: $t('org.job.code'), dataIndex: 'code', minWidth: 100 },
  { title: $t('org.job.name'), dataIndex: 'name', minWidth: 100 },
  { title: $t('common.status'), dataIndex: 'status', minWidth: 80, dict: parseDict(STATUS_VALUE_DICT) },
  { title: $t('common.sort'), dataIndex: 'sort', minWidth: 100 },
  { title: $t('common.remark'), dataIndex: 'remark', minWidth: 150 },
  { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true }
]);

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

const handleDelete = async (id) => {
  await layer.confirm($t('common.del_confirm'));
  layer.loading();
  await jobsDelete({ id });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
