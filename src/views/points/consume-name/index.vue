<template>
  <div class="page-wrap">
    <gv-table ref="tableRef" table-key="points_consume_name-list" :request="pointsConsumeNameLists" :operate-width="160" :columns="columns">
      <template #search-box="{ query, search, reset }">
        <el-input
          class="search-item"
          v-trim
          v-model="query.name"
          :placeholder="$t('points.consume_name.name')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.point.consume_name.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.point.consume_name.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.point.consume_name.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { pointsConsumeNameSet, pointsConsumeNameDel, pointsConsumeNameLists } from '@/api/points/consume-name';
import { shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('points.consume_name.name'), dataIndex: 'name', minWidth: 100 },
  { title: $t('points.consume_name.amount'), dataIndex: 'amount', minWidth: 100 },
  { title: $t('common.remark'), dataIndex: 'remark', minWidth: 150 },
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 }
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
  await pointsConsumeNameDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
