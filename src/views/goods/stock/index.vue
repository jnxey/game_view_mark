<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="stock-list"
      :request="stockLists"
      :operate-width="160"
      :operate-perms="[permsMap.goods.stock.edit, permsMap.goods.stock.del]"
      :columns="columns"
      @selection-change="selectionChange"
      select-single
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.store_id"
          :placeholder="$t('goods.stock.store')"
          :options="optionsData.storeList"
          :empty-page="{ perm: permsMap.goods.store.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.stock_type_id"
          :placeholder="$t('goods.stock_type.title')"
          :options="optionsData.typeList"
          :empty-page="{ perm: permsMap.goods.type.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.exchange_status"
          :placeholder="$t('goods.stock.exchange_status')"
          :options="STATUS_VALUE_DICT"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.status"
          :placeholder="$t('goods.stock.status')"
          :options="STATUS_VALUE_DICT"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.goods.stock.edit]" icon="Plus" type="primary" @click="handleAdd">{{ $t('common.add_btn') }}</el-button>
        <el-button v-perms="[permsMap.goods.store.view]" type="primary" @click="toRoutePath(permsMap.goods.store.view)">
          {{ $t('goods.store.title') }}
        </el-button>
        <el-button v-perms="[permsMap.goods.type.view]" type="primary" @click="toRoutePath(permsMap.goods.type.view)">
          {{ $t('goods.stock_type.title') }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button v-perms="[permsMap.goods.stock.edit]" :disabled="!selectedNow" type="success" @click="handleSetNumber(NUMBER_HANDLER.inc)">
          {{ $t('goods.stock.in') }}
        </el-button>
        <el-button v-perms="[permsMap.goods.stock.edit]" :disabled="!selectedNow" type="warning" @click="handleSetNumber(NUMBER_HANDLER.dec)">
          {{ $t('goods.stock.out') }}
        </el-button>
      </template>
      <template #exchange_status="{ row }">
        <el-switch
          :model-value="row.exchange_status"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeExchangeStatus(row)"
          :disabled="!checkPerm([permsMap.goods.stock.edit])"
        />
      </template>
      <template #status="{ row }">
        <el-switch
          :model-value="row.status"
          :active-value="STATUS_VALUE.normal"
          :inactive-value="STATUS_VALUE.disabled"
          @click.stop="changeStatus(row)"
          :disabled="!checkPerm([permsMap.goods.stock.edit])"
        />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.goods.stock.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="danger" v-perms="[permsMap.goods.stock.del]" @click="handleDelete(row.id)">{{ $t('common.del_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
    <set-number ref="setNumberRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { stockSet, stockDel, stockLists, stockStatus, stockExchangeStatus } from '@/api/goods/stock';
import { computed, onActivated, onBeforeMount, shallowRef } from 'vue';
import { STATUS_VALUE_DICT, OPERATE_TYPE, STATUS_VALUE, NUMBER_HANDLER } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { storeLists } from '@/api/goods/store';
import { toRoutePath } from '@/router';
import { useDictOptions } from '@/hooks/dict';
import { parseDict } from '@/tools';
import { stockSetNumber, stockTypeLists } from '@/api/goods/stock-type';
import SetNumber from '@/views/goods/stock/_components/set-number.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { getExchangeStatus } from '@/tools/status-value';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const setNumberRef = shallowRef();
const tableRef = shallowRef();

const selected = shallowRef([]);

const selectedNow = computed(() => {
  return selected.value[0];
});

const { optionsData, refresh } = useDictOptions({ storeList: { api: storeLists }, typeList: { api: stockTypeLists } }, true);

const columns = computed(() => {
  return [
    { title: $t('goods.stock.store'), dataIndex: 'store_id', minWidth: 120, dict: parseDict(optionsData.storeList) },
    { title: $t('goods.stock.name'), dataIndex: 'name', minWidth: 120 },
    { title: $t('goods.stock.type'), dataIndex: 'stock_type_id', minWidth: 120, dict: parseDict(optionsData.typeList) },
    { title: $t('goods.stock.image'), dataIndex: 'image', minWidth: 100, image: true },
    { title: $t('goods.stock.purchase_price'), dataIndex: 'purchase_price', minWidth: 120 },
    { title: $t('goods.stock.price'), dataIndex: 'price', minWidth: 100 },
    { title: $t('goods.stock.points'), dataIndex: 'points', minWidth: 100 },
    { title: $t('goods.stock.exchange_status'), dataIndex: 'exchange_status', minWidth: 100, dict: parseDict(STATUS_VALUE_DICT) },
    { title: $t('goods.stock.unit'), dataIndex: 'unit', minWidth: 100 },
    { title: $t('goods.stock.number'), dataIndex: 'number', minWidth: 100 },
    { title: $t('goods.stock.total_residual_price'), dataIndex: 'total_residual_price', minWidth: 100 },
    { title: $t('goods.stock.price_amount'), dataIndex: 'price_amount', minWidth: 100 },
    { title: $t('goods.stock.points_amount'), dataIndex: 'points_amount', minWidth: 120 },
    { title: $t('goods.stock.status'), dataIndex: 'status', minWidth: 100, dict: parseDict(STATUS_VALUE_DICT) },
    { title: $t('common.remark'), dataIndex: 'remark', minWidth: 100 },
    { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 },
    { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true }
  ];
});

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

const handleSetNumber = async (type) => {
  const current = selectedNow.value;
  const text = current?.status === NUMBER_HANDLER.inc ? $t('goods.stock.in') : $t('goods.stock.out');
  const title = `【${current?.name}】${text}`;
  const unit = current?.unit;
  const row = { id: current?.id, number: null, dec_inc: type };
  setNumberRef.value.open(title, unit, row);
};

const changeStatus = async (row) => {
  const text = row.status === STATUS_VALUE.disable ? $t('common.open') : $t('common.close');
  await layer.confirm($t('common.status_switch_tips', { text }));
  layer.loading();
  stockStatus({
    id: row.id,
    status: getExchangeStatus(row.status)
  }).finally(() => {
    layer.closeLoading();
    refreshTable();
  });
};

const changeExchangeStatus = async (row) => {
  const text = row.status === STATUS_VALUE.disable ? $t('common.open') : $t('common.close');
  await layer.confirm($t('goods.stock.tips_switch_points', { text }));
  layer.loading();
  stockExchangeStatus({
    id: row.id,
    exchange_status: getExchangeStatus(row.exchange_status)
  }).finally(() => {
    layer.closeLoading();
    refreshTable();
  });
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await stockDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

// 选中行变更
const selectionChange = (rows) => {
  selected.value = rows;
};

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
  refreshTable();
});
</script>
