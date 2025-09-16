<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="perms_role-list"
      :request="roleLists"
      :operate-width="200"
      :operate-perms="[permsMap.perms.role.edit, permsMap.perms.role.del]"
      :columns="columns"
    >
      <template #handler-left>
        <el-button v-perms="[permsMap.perms.role.edit]" type="primary" icon="Plus" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
        <el-button v-perms="[permsMap.perms.data.view]" type="primary" @click="toRoutePath(permsMap.perms.data.view)">
          {{ $t('perms.data.title') }}
        </el-button>
      </template>
      <template #operate-cell="{ row }">
        <div class="flex-row align-center justify-end">
          <el-button link type="primary" v-perms="[permsMap.perms.role.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
          <el-button link type="primary" v-perms="[permsMap.perms.role.edit]" @click="handleAuth(row)">{{ $t('perms.role.assign_perms') }}</el-button>
          <el-dropdown>
            <el-button link type="info" class="ml-12">
              {{ $t('common.more') }}
              <gv-icon name="el-icon-arrow-down" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="checkPerm([permsMap.perms.role.del]) && row.root !== 1" @click="handleDelete(row.id)">
                  <span class="text-danger">{{ $t('common.del_btn') }}</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="checkPerm([permsMap.perms.role.edit])" @click="handleAssign(row)">
                  {{ $t('perms.role.assign_data_perms') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
    <auth-popup ref="authRef" @success="refreshTable" />
    <assign-popup ref="assignRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { roleAdd, roleDelete, roleEdit, roleLists } from '@/api/perms/role';
import { shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import layer from '@/tools/layer.js';
import GvTable from '@/components/gv-table/index.vue';
import AuthPopup from './_components/auth.vue';
import EditPopup from './_components/edit.vue';
import AssignPopup from './_components/assign.vue';
import { permsMap } from '@/api/perms';
import { toRoutePath } from '@/router';
import { checkPerm } from '@/directives/perms';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const authRef = shallowRef();
const assignRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('perms.role.name'), dataIndex: 'name', minWidth: 280 },
  { title: $t('common.remark'), dataIndex: 'desc', minWidth: 300 },
  { title: $t('common.sort'), dataIndex: 'sort', minWidth: 100 },
  { title: $t('perms.role.num'), dataIndex: 'num', minWidth: 100 },
  { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true }
]);

const refreshTable = () => tableRef.value?.refresh();

// 新增角色
const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

// 编辑角色
const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

// 分配权限
const handleAuth = async (data) => {
  authRef.value?.open(data);
};

// 编辑数据权限
const handleAssign = async (row) => {
  assignRef.value?.open(row);
};

// 删除角色
const handleDelete = async (id) => {
  await layer.confirm($t('common.del_confirm'));
  layer.loading();
  await roleDelete({ id });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
