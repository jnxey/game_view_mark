<template>
  <div ref="pageRef" class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="currency_config-list"
      :request="currencyConfigLists"
      :operate-width="160"
      :operate-perms="[permsMap.currency.config.edit, permsMap.currency.config.del]"
      :columns="columns"
      :default-sort="defaultSort"
      :default-query="defaultQuery"
      :is-page="false"
      delay-request
    >
      <template #handler-left>
        <el-button v-perms="[permsMap.currency.config.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
        <el-button v-perms="[permsMap.currency.base.view]" type="primary" @click="toRoutePath(permsMap.currency.base.view)">
          {{ $t('currency.config.currency') }}
        </el-button>
      </template>
      <template #status="{ row }">
        <el-switch
          :model-value="row.status"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          :disabled="!checkPerm(permsMap.currency.config.edit)"
          @click.stop="changeStatus(row)"
        />
      </template>
      <template #name="{ row }">
        <div class="name-box flex-row align-center" :data-key="row.id">
          <gv-icon name="local-icon-drag-dot" class="drag-icon text-place-color fz-16" />
          <span class="ml-4">{{ $ti(row.name) }}</span>
        </div>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.currency.config.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.currency.config.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { currencyConfigSet, currencyConfigDel, currencyConfigLists, currencyConfigStatus, currencyConfigSort } from '@/api/currency/config';
import { computed, onActivated, onBeforeMount, onMounted, shallowRef } from 'vue';
import { STATUS_VALUE_DICT, OPERATE_TYPE, STATUS_VALUE, CURRENCY_TYPE_DICT, ELEMENT_SORT, YES_NO_VALUE_DICT } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { currencyBaseLists } from '@/api/currency/base';
import { toRoutePath } from '@/router';
import { parseDict } from '@/tools';
import { getExchangeStatus } from '@/tools/status-value';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import { useDictOptions } from '@/hooks/dict';
import { useTableSort } from '@/hooks/table-sort';
import { gameKindSort } from '@/api/game/kind';
import { $ti } from '@/lang/input';
import GvIcon from '@/components/gv-icon/index.vue';

const editRef = shallowRef();
const tableRef = shallowRef();
const pageRef = shallowRef();

const defaultQuery = { virtual_status: null };

const defaultSort = [{ prop: 'sort', order: ELEMENT_SORT.ascending }];

const { optionsData, refresh } = useDictOptions({ base: { api: currencyBaseLists, params: { ...defaultQuery } } }, true);

const { initDragHandler } = useTableSort(
  () => pageRef.value,
  () => tableRef.value?.getSortParams()?.order_by,
  async (sorts) => {
    layer.loading();
    await currencyConfigSort({ dragSort: sorts });
    layer.closeLoading();
    refreshTable();
  }
);

const columns = computed(() => {
  return [
    { title: $t('currency.config.name'), dataIndex: 'name', minWidth: 100 },
    { title: $t('currency.config.currency'), dataIndex: 'currency_id', minWidth: 100, dict: parseDict(optionsData.base) },
    { title: $t('currency.config.image'), dataIndex: 'image', minWidth: 100, image: true },
    { title: $t('currency.config.icon'), dataIndex: 'icon', minWidth: 100 },
    { title: $t('currency.config.abbreviation'), dataIndex: 'abbreviation', minWidth: 100 },
    { title: $t('currency.config.type'), dataIndex: 'type', minWidth: 100, dict: parseDict(CURRENCY_TYPE_DICT) },
    { title: $t('currency.config.color'), dataIndex: 'color', minWidth: 100, color: true },
    { title: $t('currency.config.status'), dataIndex: 'status', minWidth: 100, dict: parseDict(STATUS_VALUE_DICT) },
    { title: $t('currency.base.virtual_status'), dataIndex: 'virtual_status', minWidth: 100, dict: parseDict(YES_NO_VALUE_DICT) }
  ];
});

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  const list = tableRef.value?.getTableData();
  editRef.value?.open(OPERATE_TYPE.insert, null, list);
};

const handleEdit = async (data) => {
  const list = tableRef.value?.getTableData();
  editRef.value?.open(OPERATE_TYPE.update, data, list);
};

const changeStatus = async (row) => {
  const text = row.status === STATUS_VALUE.disable ? $t('common.open') : $t('common.close');
  await layer.confirm($t('currency.config.tips_change_status', { text }));
  layer.loading();
  currencyConfigStatus({
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
  await currencyConfigDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
  refreshTable();
});

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
