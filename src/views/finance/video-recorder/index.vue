<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="finance_table_type-list"
      :request="financeCameraLists"
      :operate-width="160"
      :operate-perms="[permsMap.finance.video_recorder.edit, permsMap.finance.video_recorder.del]"
      :columns="columns"
    >
      <template #search-box>
        <el-page-header class="pb-16" :content="$t('finance.video_recorder.title')" @back="backTab($router)" />
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.finance.video_recorder.edit]" icon="Plus" type="primary" @click="handleAdd">
          {{ $t('common.add_btn') }}
        </el-button>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.finance.video_recorder.edit]" @click="handleEdit(row)">
          {{ $t('common.edit_btn') }}
        </el-button>
        <el-button link type="danger" v-perms="[permsMap.finance.video_recorder.del]" @click="handleDelete(row.id)">
          {{ $t('common.del_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { backTab } from '@/store/tabs';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';
import { financeCameraDel, financeCameraLists } from '@/api/finance/video-recorder';

const editRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('finance.video_recorder.brand'), dataIndex: 'brand', minWidth: 100 },
  { title: $t('finance.video_recorder.name'), dataIndex: 'model_number', minWidth: 100 },
  { title: $t('finance.video_recorder.ip'), dataIndex: 'ip', minWidth: 100 },
  { title: $t('finance.video_recorder.port'), dataIndex: 'port', minWidth: 100 },
  { title: $t('finance.video_recorder.account'), dataIndex: 'account', minWidth: 100 },
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
  await financeCameraDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
