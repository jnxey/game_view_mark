<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="store-list"
      :request="storeLists"
      :operate-width="160"
      :operate-perms="[permsMap.goods.store.edit, permsMap.goods.store.del]"
      :columns="columns"
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="$t('goods.store.title')" @back="backTab($router)" />
        <el-input class="search-item" v-trim v-model="query.name" :placeholder="$t('goods.store.name')" clearable v-place @keyup.enter="search" />
        <el-select class="search-item" v-model="query.status" :placeholder="$t('goods.store.status')" clearable v-place>
          <el-option v-for="(item, index) in STATUS_VALUE_DICT" :key="index" :label="item.name" :value="item.value" />
        </el-select>
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.goods.store.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
      </template>
      <template #status="{ row }">
        <el-switch
          :model-value="row.status"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row)"
          :disabled="!checkPerm([permsMap.goods.store.edit])"
        />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.goods.store.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.goods.store.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { storeSet, storeDel, storeLists, storeStatus } from '@/api/goods/store';
import { shallowRef } from 'vue';
import { STATUS_VALUE_DICT, OPERATE_TYPE, STATUS_VALUE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { backTab } from '@/store/tabs';
import { getExchangeStatus } from '@/tools/status-value';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('goods.store.name'), dataIndex: 'name', minWidth: 100 },
  { title: $t('goods.store.image'), dataIndex: 'image', minWidth: 100, image: true },
  { title: $t('goods.store.desc'), dataIndex: 'desc', minWidth: 100 },
  { title: $t('goods.store.address'), dataIndex: 'address', minWidth: 100 },
  { title: $t('goods.store.status'), dataIndex: 'status', minWidth: 100 },
  { title: $t('goods.store.leader'), dataIndex: 'leader', minWidth: 100 },
  { title: $t('goods.store.contact'), dataIndex: 'contact', minWidth: 120 },
  { title: $t('common.remark'), dataIndex: 'remark', minWidth: 100 },
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 }
]);

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

const changeStatus = async (row) => {
  const text = row.status === STATUS_VALUE.disable ? $t('common.open') : $t('common.close');
  await layer.confirm($t('common.status_switch_tips', { text }));
  layer.loading();
  storeStatus({
    id: row.id,
    status: getExchangeStatus(row.status)
  }).finally(() => {
    layer.closeLoading();
    refreshTable();
  });
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await storeDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
