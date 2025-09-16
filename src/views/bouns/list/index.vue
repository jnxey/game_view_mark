<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="bonus_list-list"
      :request="bonusListLists"
      :operate-width="180"
      :operate-perms="[permsMap.bonus.list.edit, permsMap.bonus.list.del]"
      :columns="columns"
      delay-request
    >
      <template #search-box>
        <el-page-header class="pb-16" :content="$t('bonus.list.name')" @back="backTab($router)" />
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.bonus.list.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
      </template>
      <template #status="{ row }">
        <el-switch
          :model-value="row.status"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          :disabled="!checkPerm([permsMap.bonus.list.edit])"
          @click="changeStatus(row)"
        />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.bonus.list.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button
          link
          type="primary"
          v-perms="[permsMap.bonus.desk.view]"
          @click="toRoutePath(permsMap.bonus.desk.view, { id: row.id, title: 'bonus.desk.title', name: $ti(row.name) })"
        >
          {{ $t('bonus.list.btn_desk') }}
        </el-button>
        <el-button link type="danger" v-perms="[permsMap.bonus.list.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { bonusListSet, bonusListDel, bonusListLists, bonusListStatus } from '@/api/bouns/list';
import { computed, onActivated, onBeforeMount, shallowRef } from 'vue';
import { OPERATE_TYPE, STATUS_VALUE, STATUS_VALUE_DICT } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { backTab } from '@/store/tabs';
import { getExchangeStatus } from '@/tools/status-value';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import { parseDict } from '@/tools';
import { toRoutePath } from '@/router';
import { useDictOptions } from '@/hooks/dict';
import { currencyBaseLists } from '@/api/currency/base';

const editRef = shallowRef();
const tableRef = shallowRef();

const { optionsData, refresh } = useDictOptions({ base: { api: currencyBaseLists } }, true);

const columns = computed(() => {
  return [
    { title: $t('bonus.list.name'), dataIndex: 'name', minWidth: 120 },
    { title: $t('bonus.list.currency'), dataIndex: 'currency_id', minWidth: 100, dict: parseDict(optionsData.base) },
    { title: $t('bonus.list.mini_amount'), dataIndex: 'mini_amount', minWidth: 100 },
    { title: $t('bonus.list.max_multiple'), dataIndex: 'max_multiple', minWidth: 100 },
    { title: $t('bonus.list.status'), dataIndex: 'status', minWidth: 100, dict: parseDict(STATUS_VALUE_DICT) }
  ];
});

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

const changeStatus = async (row) => {
  layer.loading();
  bonusListStatus({
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
  await bonusListDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
  refreshTable();
});
</script>
