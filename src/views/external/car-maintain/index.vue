<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="car_maintain-list"
      :request="carMaintainLists"
      :default-query="defaultQuery"
      :operate-width="160"
      :popup-right-title="$t('common.operate_log')"
      :operate-perms="[permsMap.external.car_maintain.edit]"
      :columns="columns"
      show-summary
      :handle-summary="useSummary('car_type')"
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="title" @back="backTab($router)" v-place />
        <el-input
          class="search-item"
          v-trim
          v-model="query.car_number"
          :disabled="!!defaultQuery.car_number"
          :placeholder="$t('external.car_administer.car_number')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <gv-input-memory
          class="search-item box"
          v-model="query.car_type"
          :placeholder="$t('external.car_administer.car_type')"
          memory-key="external-car-type"
          :default-options="useDefCarType()"
          place-top
        />
        <gv-input-memory
          class="search-item box"
          v-model="query.maintain_type"
          :placeholder="$t('external.car_administer.maintain_type')"
          memory-key="external-car-maintain"
          :default-options="useDefCarMaintain()"
          place-top
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.status"
          :placeholder="$t('external.car_administer.status')"
          :options="CAR_MAINTAIN_STATUS_DICT"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #maintain_time_start="{ row }">
        <div class="flex-col">
          <div class="fz-12">{{ $t('common.from') }}: {{ dayjs(formatServerTime(row.maintain_time_start)).format(getTimeFormat()) }}</div>
          <div class="fz-12">{{ $t('common.to') }}: {{ dayjs(formatServerTime(row.maintain_time_end)).format(getTimeFormat()) }}</div>
        </div>
      </template>
      <template #handler-left>
        <el-button
          v-perms="[permsMap.external.car_maintain.log]"
          type="primary"
          @click="
            toRoutePath(permsMap.external.car_maintain.log, {
              request: carMaintainLog.symbol,
              title: 'external.car_administer.title_maintain_log',
              del_user: true
            })
          "
        >
          {{ $t('common.operate_log') }}
        </el-button>
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.external.car_maintain.log)">
        <gv-operate-record :request="carMaintainLog" />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.external.car_maintain.edit]" @click="handleEdit(row)">
          {{ $t('common.edit_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { carMaintainSet, carMaintainLists, carMaintainLog } from '@/api/external/car-maintain';
import { computed, shallowRef } from 'vue';
import { CAR_MAINTAIN_STATUS_DICT, OPERATE_TYPE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import { backTab } from '@/store/tabs';
import { formatServerTime, getTimeFormat, parseDict } from '@/tools';
import { useDefCarMaintain, useDefCarType } from '@/hooks/input-memory';
import GvInputMemory from '@/components/gv-input-memory/index.vue';
import dayjs from 'dayjs';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { useRoute } from 'vue-router';
import { toRoutePath } from '@/router';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import { useDateRangeShow } from '@/hooks/print-show';
import { useSummary } from '@/hooks/summary';

const editRef = shallowRef();
const tableRef = shallowRef();
const route = useRoute();
const title = computed(() => $t(route.query.title, route.query) || $t('external.car_administer.title_maintain_record'));
const defaultQuery = { car_number: route.query.car_number };

const columns = shallowRef([
  { title: $t('external.car_administer.car_type'), dataIndex: 'car_type', minWidth: 100 },
  { title: $t('external.car_administer.car_number'), dataIndex: 'car_number', minWidth: 120 },
  { title: $t('external.car_administer.status'), dataIndex: 'status', minWidth: 120, dict: parseDict(CAR_MAINTAIN_STATUS_DICT) },
  { title: $t('external.car_administer.maintain_contact_person'), dataIndex: 'contact_person', minWidth: 100 },
  { title: $t('external.car_administer.maintain_type'), dataIndex: 'maintain_type', minWidth: 150 },
  { title: $t('external.car_administer.maintain_money'), dataIndex: 'maintain_money', minWidth: 100 },
  {
    title: $t('external.car_administer.maintain_time_end'),
    dataIndex: 'maintain_time_start',
    minWidth: 180,
    printShow: useDateRangeShow('maintain_time_start', 'maintain_time_end')
  },
  { title: $t('external.car_administer.maintain_address'), dataIndex: 'maintain_address', minWidth: 150 },
  { title: $t('external.car_administer.maintain_shop_contact_details'), dataIndex: 'shop_contact_details', minWidth: 120 },
  { title: $t('external.car_administer.maintain_images'), dataIndex: 'images', minWidth: 100, image: true },
  { title: $t('external.car_administer.maintain_remark'), dataIndex: 'remark', minWidth: 100 },
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 },
  { title: $t('common.operate_time'), dataIndex: 'update_time', minWidth: 180, time: true }
]);

const refreshTable = () => tableRef.value?.refresh();

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};
</script>
