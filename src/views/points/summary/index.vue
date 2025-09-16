<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      row-key="user_id"
      table-key="points_summary-list"
      :request="pointsSummaryLists"
      :operate-width="160"
      :columns="columns"
      select-single
      @selection-change="selectionChange"
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-user-inline class="search-item" place-top v-model="query.user_id" :placeholder="$t('common.user_no')" />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left="{ tableExtend }">
        <el-button v-perms="[permsMap.point.summary.log]" type="primary" @click="toRoutePath(permsMap.point.summary.log)">
          {{ $t('points.detail.title') }}
        </el-button>
        <div class="flex-row align-center mr-16" v-if="tableExtend">
          <span class="ml-12 mr-4 fz-12 text-placeholder">{{ $t('points.summary.label_users') }}</span>
          <el-statistic :value="tableExtend.count_users" />
          <span class="ml-12 mr-4 fz-12 text-placeholder">{{ $t('points.summary.label_count') }}</span>
          <el-statistic :value="tableExtend.count_points" />
        </div>
        <el-button v-perms="[permsMap.point.summary.edit]" type="primary" :disabled="!selectedNow" @click="handlerIns">
          {{ $t('points.summary.label_top_up') }}
        </el-button>
        <el-button v-perms="[permsMap.point.summary.edit]" type="primary" :disabled="!selectedNow" @click="handlerDec">
          {{ $t('points.summary.label_deduct') }}
        </el-button>
        <el-button v-perms="[permsMap.point.summary.edit]" type="primary" @click="handlerExpire">
          {{ $t('points.summary.label_invalid_set') }}
        </el-button>
      </template>
    </gv-table>
    <point-ins-popup ref="pointInsRef" @success="refreshTable" />
    <point-dec-popup ref="pointDecRef" @success="refreshTable" />
    <point-expire-popup ref="pointExpireRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { pointsSummaryDeduct, pointsSummaryLists, pointsSummarySet, pointsSummarySetExpire } from '@/api/points/summary';
import { computed, shallowRef } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import PointInsPopup from './_components/point-ins.vue';
import PointDecPopup from './_components/point-dec.vue';
import PointExpirePopup from './_components/point-expire.vue';
import { pointsDetailLists } from '@/api/points/detail';
import { toRoutePath } from '@/router';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const pointInsRef = shallowRef();
const pointDecRef = shallowRef();
const pointExpireRef = shallowRef();
const tableRef = shallowRef();
const selected = shallowRef([]);

const selectedNow = computed(() => {
  return selected.value[0];
});

const columns = shallowRef([
  { title: $t('common.user_no'), dataIndex: 'username', minWidth: 120 },
  { title: $t('points.summary.nickname'), dataIndex: 'nickname', minWidth: 120 },
  { title: $t('points.summary.total_points'), dataIndex: 'total_points', minWidth: 120 },
  { title: $t('points.summary.expire_at'), dataIndex: 'expire_at', minWidth: 120 },
  { title: $t('common.remark'), dataIndex: 'information_desc', minWidth: 100 }
]);

// 刷新表格
const refreshTable = () => tableRef.value?.refresh();

// 充值
const handlerIns = () => {
  pointInsRef.value?.open(selectedNow.value);
};

// 扣除
const handlerDec = () => {
  pointDecRef.value?.open(selectedNow.value);
};

// 失效设置
const handlerExpire = () => {
  pointExpireRef.value?.open(selectedNow.value);
};

// 选中行变更
const selectionChange = (rows) => {
  selected.value = rows;
};
</script>
