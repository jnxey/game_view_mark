<template>
  <div class="admin">
    <gv-table
      ref="tableRef"
      table-key="perms_admin-list"
      :request="adminLists"
      :columns="columns"
      :operate-width="140"
      :operate-perms="[permsMap.staff.admin.edit, permsMap.staff.admin.del]"
      :default-query="defaultQuery"
    >
      <!--      -->
      <template #search-box="{ query, search, reset }">
        <el-input
          class="search-item"
          v-trim
          v-model="query.account"
          :placeholder="$t('staff.admin.account')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <el-input class="search-item" v-trim v-model="query.name" :placeholder="$t('staff.admin.name')" clearable @keyup.enter="search" v-place />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.role_id"
          :placeholder="$t('staff.admin.role_name')"
          :options="optionsData.role"
          :empty-page="{ perm: permsMap.perms.role.view }"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <!--      -->
      <template #handler-left>
        <el-button v-perms="[permsMap.staff.admin.edit]" type="primary" icon="Plus" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
      </template>
      <!--      -->
      <template #disabled="{ row }">
        <el-switch
          v-if="row.root !== SYSTEM_SUPER_ROOT"
          :model-value="row.disable"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row)"
          :disabled="!checkPerm(permsMap.staff.admin.edit)"
        />
        <span v-else class="text-placeholder">ROOT</span>
      </template>
      <!--      -->
      <template #operate-cell="{ row }">
        <div class="flex-row align-center justify-end">
          <el-button v-perms="[permsMap.staff.admin.edit]" type="primary" link @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
          <el-dropdown>
            <el-button link type="info" class="ml-12">
              {{ $t('common.more') }}
              <gv-icon name="el-icon-arrow-down" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="checkPerm([permsMap.staff.admin.del]) && row.root !== 1" @click="handleDelete(row.id)">
                  <span class="text-danger">{{ $t('common.del_btn') }}</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="checkPerm([permsMap.staff.admin.edit])" @click="handlePassword(row)">
                  {{ $t('staff.admin.btn_edit_pwd') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { adminAdd, adminDelete, adminEdit, adminLists, adminSetPassword } from '@/api/staff/admin';
import { roleAll, roleLists } from '@/api/perms/role';
import { useDictOptions } from '@/hooks/dict';
import EditPopup from './_components/edit.vue';
import { shallowRef } from 'vue';
import { OPERATE_TYPE, SYSTEM_SUPER_ROOT, STATUS_VALUE, STATUS_VALUE_DICT, SEX_VALUE_DICT } from '@/values';
import layer from '@/tools/layer.js';
import GvTable from '@/components/gv-table/index.vue';
import { getTimeFormat, parseDict } from '@/tools';
import { checkPerm } from '@/directives/perms';
import GvIcon from '@/components/gv-icon/index.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { useRoute } from 'vue-router';
import { getExchangeStatus } from '@/tools/status-value';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';
import { $tis } from '@/lang/input';

const editRef = shallowRef();
const tableRef = shallowRef();

const route = useRoute();

const defaultQuery = { account: route.query.account, name: '', role_id: '' };

const { optionsData } = useDictOptions({ role: { api: roleAll } });

const getShowNames = (name) => {
  return !!name ? $tis(name.split('/')).join('/') : '';
};

const columns = shallowRef([
  { title: $t('staff.admin.account'), dataIndex: 'account', minWidth: 100 },
  { title: $t('staff.admin.name'), dataIndex: 'name', minWidth: 100 },
  { title: $t('staff.admin.avatar'), dataIndex: 'avatar', minWidth: 100, image: true },
  { title: $t('staff.admin.dept_name'), dataIndex: 'dept_name', minWidth: 120, func: (_, val) => getShowNames(val.dept_name) },
  { title: $t('staff.admin.jobs_name'), dataIndex: 'jobs_name', minWidth: 120, func: (_, val) => getShowNames(val.jobs_name) },
  { title: $t('staff.admin.role_name'), dataIndex: 'role_name', minWidth: 120, func: (_, val) => getShowNames(val.role_name) },
  { title: $t('staff.admin.contact'), dataIndex: 'contact', minWidth: 120 },
  { title: $t('staff.admin.gender'), dataIndex: 'gender', minWidth: 100, dict: parseDict(SEX_VALUE_DICT) },
  { title: $t('staff.admin.birthday'), dataIndex: 'birthday', minWidth: 120 },
  { title: $t('staff.admin.education'), dataIndex: 'education', minWidth: 100 },
  { title: $t('staff.admin.referrer'), dataIndex: 'referrer', minWidth: 100 },
  { title: $t('staff.admin.disabled'), dataIndex: 'disabled', perms: ['auth.admin/edit'], minWidth: 100, dict: parseDict(STATUS_VALUE_DICT) },
  { title: $t('staff.admin.time_joining'), dataIndex: 'time_joining', minWidth: 120, time: getTimeFormat('day') },
  { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true },
  { title: $t('staff.admin.login_failed'), dataIndex: 'login_failed', minWidth: 120 }
]);

const refreshTable = () => tableRef.value?.refresh();

const changeStatus = async (row) => {
  const text = row.status === STATUS_VALUE.disable ? $t('common.open') : $t('common.close');
  await layer.confirm($t('common.status_switch_tips', { text }));
  layer.loading();
  adminEdit({
    ...row,
    disable: getExchangeStatus(row.disable)
  }).finally(() => {
    refreshTable();
    layer.closeLoading();
  });
};

const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

const handleDelete = async (id) => {
  await layer.confirm($t('common.del_confirm'));
  layer.loading();
  await adminDelete({ id });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

const handlePassword = async (row) => {
  const { value } = await layer.password('', $t('staff.admin.tips_confirm_edit_pwd', { account: row.account }), { strict: true });
  layer.loading();
  await adminSetPassword({ id: row.id, staff_password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
};
</script>
