<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="points_detail-list"
      :request="pointsDetailLists"
      :default-query="defaultQuery"
      :operate-width="160"
      :columns="columns"
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="$t('points.detail.title')" @back="backTab($router)" />
        <gv-select-user-inline class="search-item" place-top v-model="query.user_id" :placeholder="$t('common.user_no')" />
        <el-select class="search-item" v-model="query.type" :placeholder="$t('common.operate_type')" clearable v-place>
          <el-option v-for="(item, index) in POINTS_HANDLER_DICT" :key="index" :label="item.name" :value="item.value" />
        </el-select>
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.operate_time')"
          v-place
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
    </gv-table>
  </div>
</template>

<script setup>
import { pointsDetailLists } from '@/api/points/detail';
import { onMounted, shallowRef } from 'vue';
import { POINTS_HANDLER_DICT } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import { parseDict } from '@/tools';
import { backTab } from '@/store/tabs';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { $t } from '@/lang/i18n';

const defaultQuery = {};

const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('common.user_no'), dataIndex: 'username', minWidth: 120 },
  { title: $t('common.operate_type'), dataIndex: 'type', minWidth: 100, dict: parseDict(POINTS_HANDLER_DICT) }, //（1：新增，2：消费，3：过期，4：扣减）
  { title: $t('points.detail.points'), dataIndex: 'points', minWidth: 120 }, //（正数为增加，负数为减少）
  { title: $t('points.detail.consume_name'), dataIndex: 'consume_name', minWidth: 120 },
  // { title: '订单ID', dataIndex: 'order_id', minWidth: 120 },
  { title: $t('points.detail.remark'), dataIndex: 'remark', minWidth: 150 },
  { title: $t('common.operate_time'), dataIndex: 'create_time', minWidth: 180, time: true }
]);

const refreshTable = () => tableRef.value?.refresh();

onMounted(async () => {
  await refreshTable();
  const extend = tableRef.value?.getExtend();
  defaultQuery.create_time_start = extend.create_time_start;
  defaultQuery.create_time_end = extend.create_time_end;
  tableRef.value?.resetDefaultQuery();
});
</script>
