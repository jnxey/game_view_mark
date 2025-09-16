<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="staff_apartment-list"
      :request="staffApartmentLists"
      :operate-width="160"
      :operate-perms="[permsMap.staff.apartment.edit, permsMap.staff.apartment.del]"
      :columns="columns"
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-options
          class="search-item"
          v-model="query.building_id"
          place-top
          :placeholder="$t('staff.apartment.building_name')"
          :request="staffBuildingLists"
          :empty-page="{ perm: permsMap.staff.building.view }"
        />
        <el-input class="search-item" v-trim v-model="query.code" :placeholder="$t('staff.apartment.code')" clearable @keyup.enter="search" v-place />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.staff.apartment.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
        <el-button v-perms="[permsMap.staff.building.view]" type="primary" @click="toRoutePath(permsMap.staff.building.view)">
          {{ $t('staff.building.title') }}
        </el-button>
        <work-apartment />
      </template>
      <template #code="{ row }">
        <el-button type="primary" @click.stop="handleBinding(row)" :disabled="!checkPerm([permsMap.staff.apartment_admin.bind])">
          <template #icon><gv-icon name="local-icon-setting-line" /></template>
          {{ row.code }}
        </el-button>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.staff.apartment.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.staff.apartment.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
    <binding-popup ref="bindingRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { staffApartmentSet, staffApartmentDel, staffApartmentLists } from '@/api/staff/apartment';
import { shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import BindingPopup from '@/views/staff/_components/binding.vue';
import layer from '@/tools/layer';
import { staffBuildingLists } from '@/api/staff/building';
import { toRoutePath } from '@/router';
import GvIcon from '@/components/gv-icon/index.vue';
import WorkApartment from '@/views/staff/_components/work-apartment.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const bindingRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('staff.apartment.code'), dataIndex: 'code', minWidth: 100 },
  { title: $t('staff.apartment.building_name'), dataIndex: 'building_name', minWidth: 100 },
  { title: $t('staff.apartment.staff_total'), dataIndex: 'staff_total', minWidth: 120 },
  { title: $t('staff.apartment.max_number'), dataIndex: 'max_number', minWidth: 120 },
  { title: $t('common.remark'), dataIndex: 'remark', minWidth: 150 },
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

const handleBinding = (row) => {
  bindingRef.value?.open(row);
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await staffApartmentDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
