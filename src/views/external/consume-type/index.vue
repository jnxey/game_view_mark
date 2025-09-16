<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="external_consume_type-list"
      :request="externalConsumeTypeLists"
      :operate-width="160"
      :operate-perms="[permsMap.external.consume_type.edit, permsMap.external.consume_type.del]"
      :columns="columns"
    >
      <template #search-box>
        <el-page-header class="pb-16" :content="$t('external.consume_type.title')" @back="backTab($router)" />
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.external.consume_type.edit]" icon="Plus" type="primary" @click="handleAdd">
          {{ $t('common.add_btn') }}
        </el-button>
        <el-button
          v-perms="[permsMap.external.consume_type.log]"
          type="primary"
          @click="
            toRoutePath(permsMap.external.consume_type.log, {
              request: externalConsumeTypeLog.symbol,
              title: 'external.consume_type.title_log',
              del_user: true
            })
          "
        >
          {{ $t('common.operate_log') }}
        </el-button>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.external.consume_type.edit]" @click="handleEdit(row)">
          {{ $t('common.edit_btn') }}
        </el-button>
        <el-button link type="danger" v-perms="[permsMap.external.consume_type.edit]" @click="handleDelete(row.id)">
          {{ $t('common.del_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { externalConsumeTypeSet, externalConsumeTypeDel, externalConsumeTypeLists, externalConsumeTypeLog } from '@/api/external/consume-type';
import { shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { backTab } from '@/store/tabs';
import { toRoutePath } from '@/router';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';

const editRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('external.consume_type.name'), dataIndex: 'name', minWidth: 120 },
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 },
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
  const { value } = await layer.password();
  layer.loading();
  await externalConsumeTypeDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
