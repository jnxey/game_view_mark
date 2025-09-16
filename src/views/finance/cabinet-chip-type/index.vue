<template>
  <div ref="pageRef" class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="finance_cabinet_chip_type-list"
      :request="financeCabinetChipTypeLists"
      :operate-width="160"
      :operate-perms="[permsMap.finance.cabinet_type.edit, permsMap.finance.cabinet_type.del]"
      :columns="columns"
      :is-page="false"
    >
      <template #search-box>
        <el-page-header class="pb-16" :content="$t('finance.cabinet_chip_type.title')" @back="backTab($router)" />
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.finance.cabinet_type.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
      </template>
      <template #name="{ row }">
        <div class="name-box flex-row align-center" :data-key="row.id">
          <gv-icon name="local-icon-drag-dot" class="drag-icon text-place-color fz-16" />
          <span class="ml-4">{{ $ti(row.name) }}</span>
        </div>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.finance.cabinet_type.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button
          link
          type="danger"
          v-perms="[permsMap.finance.cabinet_type.del]"
          v-if="row.is_allow_delete === YES_NO_VALUE.yes"
          @click="handleDelete(row.id)"
        >
          {{ $t('common.del_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import {
  financeCabinetChipTypeSet,
  financeCabinetChipTypeDel,
  financeCabinetChipTypeLists,
  financeCabinetChipTypeSort
} from '@/api/finance/cabinet-chip-type';
import { onMounted, shallowRef } from 'vue';
import { OPERATE_TYPE, YES_NO_VALUE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { backTab } from '@/store/tabs';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { $ti } from '@/lang/input';
import GvIcon from '@/components/gv-icon/index.vue';
import { useTableSort } from '@/hooks/table-sort';

const editRef = shallowRef();
const tableRef = shallowRef();
const pageRef = shallowRef();

const { initDragHandler } = useTableSort(
  () => pageRef.value,
  () => tableRef.value?.getSortParams()?.order_by,
  async (sorts) => {
    layer.loading();
    await financeCabinetChipTypeSort({ dragSort: sorts });
    layer.closeLoading();
    refreshTable();
  }
);

const columns = shallowRef([
  { title: $t('finance.cabinet_chip_type.name'), dataIndex: 'name', minWidth: 100 },
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
  await financeCabinetChipTypeDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

onMounted(() => {
  initDragHandler();
});
</script>
<style scoped lang="scss">
.name-box {
  user-select: none;

  .drag-icon {
    cursor: move;
  }
}
</style>
