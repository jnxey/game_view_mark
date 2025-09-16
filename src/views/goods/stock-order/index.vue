<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="stock_order-list"
      :request="stockOrderLists"
      :operate-width="160"
      :columns="columns"
      select-single
      :default-query="defaultQuery"
      @selection-change="selectionChange"
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-options
          class="search-item"
          v-model="query.status"
          :placeholder="$t('goods.stock_order.status')"
          place-top
          :options="STOCK_ORDER_STATUS_DICT"
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.unique_number"
          :placeholder="$t('goods.stock_order.unique_number')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.username"
          :placeholder="$t('goods.stock_order.username')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.stock_name"
          :placeholder="$t('goods.stock_order.stock_name')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <!--        <gv-select-options-->
        <!--          class="search-item"-->
        <!--          place-top-->
        <!--          v-model="query.price_status"-->
        <!--          :placeholder="$t('goods.stock_order.price_status')"-->
        <!--          :options="STOCK_ORDER_TYPE_DICT"-->
        <!--        />-->
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button
          v-perms="[permsMap.goods.order.log]"
          type="primary"
          @click="toRoutePath(permsMap.goods.order.log, { request: stockOrderLog.symbol, title: 'goods.stock_order.title_log', del_user: true })"
        >
          {{ $t('common.operate_log') }}
        </el-button>
        <el-button v-perms="[permsMap.goods.order.status]" :disabled="disableOrder" type="success" @click="handleFinish">
          {{ $t('common.complete_btn') }}
        </el-button>
        <el-button v-perms="[permsMap.goods.order.status]" :disabled="disableOrder" type="danger" @click="handleDelete">
          {{ $t('common.cancel') }}
        </el-button>
      </template>
    </gv-table>
  </div>
</template>

<script setup>
import { stockOrderDel, stockOrderLists, stockOrderLog, stockOrderStatus } from '@/api/goods/stock-order';
import { computed, shallowRef } from 'vue';
import { STOCK_ORDER_STATUS_DICT, STOCK_ORDER_STATUS, STOCK_ORDER_TYPE_DICT } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import layer from '@/tools/layer';
import { parseDict } from '@/tools';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { useRoute } from 'vue-router';
import { hotelRoomRecordLog } from '@/api/external/hotel-room-record';
import { toRoutePath } from '@/router';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const route = useRoute();
const editRef = shallowRef();
const tableRef = shallowRef();

const selected = shallowRef([]);

const defaultQuery = { status: !!route.query.status ? Number(route.query.status) : null };

const selectedNow = computed(() => {
  return selected.value[0];
});

const disableOrder = computed(() => {
  return !selectedNow.value || selectedNow.value?.status === STOCK_ORDER_STATUS.success;
});

const columns = shallowRef([
  { title: $t('goods.stock_order.unique_number'), dataIndex: 'unique_number', minWidth: 220 },
  { title: $t('goods.stock_order.username'), dataIndex: 'username', minWidth: 120 },
  { title: $t('goods.stock_order.address'), dataIndex: 'address', minWidth: 120 },
  { title: $t('goods.stock_order.stock_name'), dataIndex: 'stock_name', minWidth: 120 },
  { title: $t('goods.stock_order.stock_image'), dataIndex: 'stock_image', minWidth: 120, image: true },
  { title: $t('goods.stock_order.unit'), dataIndex: 'unit', minWidth: 100 },
  { title: $t('goods.stock_order.number'), dataIndex: 'number', minWidth: 100 },
  { title: $t('goods.stock_order.price'), dataIndex: 'price', minWidth: 100 },
  // { title: $t('goods.stock_order.price_status'), dataIndex: 'price_status', minWidth: 100, dict: parseDict(STOCK_ORDER_TYPE_DICT) },
  { title: $t('goods.stock_order.remark'), dataIndex: 'remark', minWidth: 120 },
  { title: $t('goods.stock_order.status'), dataIndex: 'status', minWidth: 100, dict: parseDict(STOCK_ORDER_STATUS_DICT) },
  { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
  { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true }
]);

const refreshTable = () => tableRef.value?.refresh();

// 完成
const handleFinish = async () => {
  const current = selectedNow.value;
  await layer.confirm($t('goods.stock_order.tips_confirm_complete'));
  layer.loading();
  await stockOrderStatus({ id: current.id, status: STOCK_ORDER_STATUS.success });
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  refreshTable();
};

// 取消
const handleDelete = async () => {
  const current = selectedNow.value;
  await layer.confirm($t('goods.stock_order.tips_confirm_cancel'));
  layer.loading();
  await stockOrderStatus({ id: current.id, status: STOCK_ORDER_STATUS.cancel });
  layer.closeLoading();
  layer.msgSuccess($t('goods.stock_order.cancel_success'));
  refreshTable();
};

// 选中行变更
const selectionChange = (rows) => {
  selected.value = rows;
};
</script>
