<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="car_record-list"
      :request="carRecordLists"
      :default-query="defaultQuery"
      :operate-width="120"
      :popup-right-title="$t('common.operate_log')"
      :operate-perms="[permsMap.external.car_record.edit]"
      :columns="columns"
      show-summary
      :handle-summary="useSummary('car_type')"
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="title" @back="backTab($router)" />
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
        <el-input
          class="search-item"
          v-trim
          v-model="query.passenger"
          :placeholder="$t('external.car_administer.use_passenger')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.driver"
          :placeholder="$t('external.car_administer.use_driver')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.status"
          :placeholder="$t('common.status')"
          :options="CAR_RECORD_STATUS_DICT"
        />
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.car_start_time_start"
          v-model:endTime="query.car_start_time_end"
          :placeholder="$t('external.car_administer.use_car_start_time')"
          v-place
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button
          v-perms="[permsMap.external.car_record.log]"
          type="primary"
          @click="
            toRoutePath(permsMap.external.car_record.log, {
              request: carRecordLog.symbol,
              title: 'external.car_administer.title_use_log',
              del_user: true
            })
          "
        >
          {{ $t('common.operate_log') }}
        </el-button>
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.external.car_record.log)">
        <gv-operate-record :request="carRecordLog" />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.external.car_record.edit]" @click="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>
<script setup>
import { carRecordSet, carRecordLists, carRecordLog } from '@/api/external/car-record';
import { computed, shallowRef } from 'vue';
import { CAR_RECORD_STATUS_DICT, OPERATE_TYPE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import { backTab } from '@/store/tabs';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { useDefCarType } from '@/hooks/input-memory';
import GvInputMemory from '@/components/gv-input-memory/index.vue';
import { parseDict } from '@/tools';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { useRoute } from 'vue-router';
import { toRoutePath } from '@/router';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import { $t } from '@/lang/i18n';
import { useSummary } from '@/hooks/summary';

const editRef = shallowRef();
const tableRef = shallowRef();
const route = useRoute();
const title = computed(() => $t(route.query.title, route.query) || $t('external.car_administer.title_use_record'));
const defaultQuery = { car_number: route.query.car_number };

const columns = shallowRef([
  { title: $t('external.car_administer.car_type'), dataIndex: 'car_type', minWidth: 100 },
  { title: $t('external.car_administer.car_number'), dataIndex: 'car_number', minWidth: 120 },
  { title: $t('external.car_administer.use_passenger'), dataIndex: 'passenger', minWidth: 150 },
  { title: $t('external.car_administer.use_cause'), dataIndex: 'cause', minWidth: 150 },
  { title: $t('external.car_administer.use_companion'), dataIndex: 'companion', minWidth: 150 },
  { title: $t('external.car_administer.use_route'), dataIndex: 'route', minWidth: 150 },
  { title: $t('external.car_administer.use_distance'), dataIndex: 'distance', minWidth: 100 },
  { title: $t('external.car_administer.use_driver'), dataIndex: 'driver', minWidth: 100 },
  { title: $t('common.status'), dataIndex: 'status', minWidth: 150, dict: parseDict(CAR_RECORD_STATUS_DICT) },
  { title: $t('external.car_administer.use_car_start_time'), dataIndex: 'car_start_time', minWidth: 180, time: true },
  { title: $t('external.car_administer.car_end_time'), dataIndex: 'car_end_time', minWidth: 180, time: true },
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 },
  { title: $t('common.operate_time'), dataIndex: 'update_time', minWidth: 180, time: true },
  { title: $t('common.remark'), dataIndex: 'remark', minWidth: 150 }
]);

const refreshTable = () => tableRef.value?.refresh();

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};
</script>
