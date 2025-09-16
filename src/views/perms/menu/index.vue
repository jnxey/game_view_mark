<template>
  <div class="menu-lists">
    <gv-table
      ref="tableRef"
      table-key="perms_menu-list"
      :request="menuLists"
      :columns="columns"
      is-tree
      :show-select="false"
      :operate-perms="[permsMap.perms.menu.edit, permsMap.perms.menu.del]"
    >
      <template #handler-left>
        <el-button v-perms="[permsMap.perms.menu.edit]" type="primary" icon="Plus" @click="handleAdd()">{{ $t('common.add_btn') }}</el-button>
        <el-button @click="toggleExpand">{{ $t('common.expand') }}/{{ $t('common.fold') }}</el-button>
      </template>
      <!--        -->
      <template #icon="{ row }">
        <gv-icon v-if="row.icon" :name="row.icon" class="fz-20" />
      </template>
      <!--        -->
      <template #operate-cell="{ row }">
        <el-button v-if="row.type !== MENU_ENUM_TYPE.BUTTON" v-perms="[permsMap.perms.menu.edit]" type="primary" link @click="handleAdd(row.id)">
          {{ $t('common.add_btn') }}
        </el-button>
        <el-button v-perms="[permsMap.perms.menu.edit]" type="primary" link @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button v-perms="[permsMap.perms.menu.del]" type="danger" link @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>
<script setup>
import { menuAdd, menuDelete, menuEdit, menuLists } from '@/api/perms/menu';
import EditPopup from './_components/edit.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import { MENU_ENUM_TYPE, MENU_ENUM_TYPE_DICT } from '@/values/menu';
import { shallowRef } from 'vue';
import layer from '@/tools/layer.js';
import { OPERATE_TYPE, STATUS_VALUE_DICT } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import { parseDict } from '@/tools';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const tableRef = shallowRef();
const editRef = shallowRef();

const columns = shallowRef([
  { title: $t('perms.menu.name'), dataIndex: 'name', minWidth: 150, func: (_, val) => $t(val.name) },
  { title: $t('perms.menu.type'), dataIndex: 'type', minWidth: 100, dict: parseDict(MENU_ENUM_TYPE_DICT) },
  { title: $t('perms.menu.icon'), dataIndex: 'icon', minWidth: 100 },
  { title: $t('perms.menu.perms'), dataIndex: 'perms', minWidth: 160 },
  { title: $t('common.status'), dataIndex: 'is_disable', minWidth: 100, dict: parseDict(STATUS_VALUE_DICT) },
  { title: $t('common.sort'), dataIndex: 'sort', v: 100 },
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
  await menuDelete({ id });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

const toggleExpand = () => {
  tableRef.value?.handleExpand();
};
</script>
