<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="staff_apartment_admin-list"
      :request="staffApartmentAdminLists"
      :operate-width="160"
      :operate-perms="[permsMap.staff.apartment_admin.bind]"
      :columns="columns"
    >
      <template #search-box="{ query, search, reset }">
        <el-input
          class="search-item"
          v-trim
          v-model="query.staff_work_no"
          :placeholder="$t('staff.apartment_admin.staff_work_no')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #remark="{ row }">
        <div class="flex-row align-center">
          <span v-if="!!row.remark" class="mr-8">{{ row.remark }}</span>
          <gv-icon v-perms="[permsMap.staff.apartment_admin.bind]" name="local-icon-remark" class="link fz-16" @click="editRemark(row)" />
        </div>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="danger" v-perms="[permsMap.staff.apartment_admin.bind]" @click="handleDelete(row.id)">
          {{ $t('staff.components.label_unbind_btn') }}
        </el-button>
      </template>
    </gv-table>
  </div>
</template>

<script setup>
import { staffApartmentAdminDel, staffApartmentAdminSet, staffApartmentAdminLists } from '@/api/staff/apartment-admin';
import { shallowRef } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import layer from '@/tools/layer';
import GvIcon from '@/components/gv-icon/index.vue';
import { getTimeFormat } from '@/tools';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('staff.apartment_admin.staff_work_no'), dataIndex: 'staff_work_no', minWidth: 100 },
  { title: $t('staff.apartment_admin.building_name'), dataIndex: 'building_name', minWidth: 100 },
  { title: $t('staff.apartment_admin.apartment_code'), dataIndex: 'apartment_code', minWidth: 100 },
  { title: $t('staff.apartment_admin.create_time'), dataIndex: 'create_time', minWidth: 100, time: getTimeFormat('day') },
  { title: $t('common.remark'), dataIndex: 'remark', minWidth: 150 },
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 }
]);

const refreshTable = () => tableRef.value?.refresh();

// 删除
const handleDelete = async (id) => {
  await layer.confirm($t('staff.components.tips_confirm_unbind'));
  layer.loading();
  await staffApartmentAdminDel({ id });
  layer.closeLoading();
  layer.msgSuccess($t('staff.components.tips_unbind_success'));
  refreshTable();
};

// 编辑备注
const editRemark = async (row) => {
  const { value } = await layer.prompt('', $t('common.remark'), {
    inputValue: row.remark,
    inputPlaceholder: $t('common.remark_placeholder'),
    inputType: 'textarea'
  });
  layer.loading();
  await staffApartmentAdminSet({ id: row.id, remark: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  refreshTable();
};
</script>
