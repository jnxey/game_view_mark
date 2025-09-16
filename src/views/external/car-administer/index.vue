<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="car_administer-list"
      :request="carAdministerLists"
      :operate-width="160"
      :operate-perms="[permsMap.external.car_administer.edit, permsMap.external.car_administer.del]"
      select-single
      :popup-right-title="$t('common.operate_log')"
      :columns="columns"
      @selection-change="selectionChange"
      :handler-list="handlerList"
    >
      <template #search-box="{ query, search, reset }">
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
          v-model="query.car_number"
          :placeholder="$t('external.car_administer.car_number')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.seating_capacity"
          :placeholder="$t('external.car_administer.seating_capacity')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.status"
          :placeholder="$t('external.car_administer.status')"
          :options="CAR_STATUS_DICT"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.external.car_administer.edit]" icon="Plus" type="primary" @click="handleAdd">
          {{ $t('common.add_btn') }}
        </el-button>
        <el-button
          v-perms="[permsMap.external.car_administer.log]"
          type="primary"
          @click="
            toRoutePath(permsMap.external.car_administer.log, {
              request: carAdministerLog.symbol,
              title: 'external.car_administer.title_log',
              del_user: true
            })
          "
        >
          {{ $t('common.operate_log') }}
        </el-button>
        <el-button v-perms="[permsMap.external.car_record.view]" type="primary" plain @click="toUseRecord">
          {{ $t('external.car_administer.btn_use_record') }}
        </el-button>
        <el-button v-perms="[permsMap.external.car_maintain.view]" type="primary" plain @click="toMaintain">
          {{ $t('external.car_administer.btn_maintain_record') }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button v-perms="[permsMap.external.car_administer.start]" type="primary" :disabled="disableStart" @click="handleStart">
          {{ $t('external.car_administer.btn_use') }}
        </el-button>
        <el-button v-perms="[permsMap.external.car_administer.end]" type="warning" :disabled="disableEnd" @click="handleEnd">
          {{ $t('external.car_administer.btn_back') }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button v-perms="[permsMap.external.car_administer.maintain]" type="primary" :disabled="disableMaintainStart" @click="handleMaintainStart">
          {{ $t('external.car_administer.btn_maintain') }}
        </el-button>
        <el-button v-perms="[permsMap.external.car_administer.maintain]" type="warning" :disabled="disableMaintainEnd" @click="handleMaintainEnd">
          {{ $t('external.car_administer.btn_maintain_end') }}
        </el-button>
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.external.car_administer.log)">
        <gv-operate-record :request="carAdministerLog" />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.external.car_administer.edit]" @click="handleEdit(row)">
          {{ $t('common.edit_btn') }}
        </el-button>
        <el-button link type="danger" v-perms="[permsMap.external.car_administer.del]" @click="handleDelete(row.id)">
          {{ $t('common.del_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
    <use-popup ref="useRef" @success="refreshTable" />
    <back-popup ref="backRef" @success="refreshTable" />
    <maintain-popup ref="maintainRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import {
  carAdministerSet,
  carAdministerDel,
  carAdministerLists,
  carAdministerStart,
  carAdministerEnd,
  carAdministerLog
} from '@/api/external/car-administer';
import { computed, shallowRef } from 'vue';
import { OPERATE_TYPE, CAR_STATUS_DICT, CAR_STATUS } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import UsePopup from './_components/use.vue';
import BackPopup from './_components/back.vue';
import MaintainPopup from './_components/maintain.vue';
import layer from '@/tools/layer';
import { toRoutePath } from '@/router';
import { carRecordLists } from '@/api/external/car-record';
import { carMaintainCreate, carMaintainLists } from '@/api/external/car-maintain';
import { parseDict } from '@/tools';
import GvInputMemory from '@/components/gv-input-memory/index.vue';
import { useDefCarType } from '@/hooks/input-memory';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';

const editRef = shallowRef();
const useRef = shallowRef();
const backRef = shallowRef();
const maintainRef = shallowRef();
const tableRef = shallowRef();
const selected = shallowRef([]);

const selectedNow = computed(() => {
  return selected.value[0];
});

const columns = shallowRef([
  { title: $t('external.car_administer.car_type'), dataIndex: 'car_type', minWidth: 100 },
  { title: $t('external.car_administer.car_number'), dataIndex: 'car_number', minWidth: 100 },
  { title: $t('external.car_administer.seating_capacity'), dataIndex: 'seating_capacity', minWidth: 100 },
  { title: $t('external.car_administer.status'), dataIndex: 'status', minWidth: 100, dict: parseDict(CAR_STATUS_DICT) }, // 0:空闲,1:使用,2:维护,3:停用
  { title: $t('external.car_administer.use_passenger'), dataIndex: 'record_passenger', minWidth: 120 },
  { title: $t('external.car_administer.use_cause'), dataIndex: 'record_cause', minWidth: 150 },
  { title: $t('external.car_administer.use_companion'), dataIndex: 'record_companion', minWidth: 100 },
  { title: $t('external.car_administer.use_route'), dataIndex: 'record_route', minWidth: 100 },
  { title: $t('external.car_administer.use_distance'), dataIndex: 'record_distance', minWidth: 100 },
  { title: $t('external.car_administer.use_driver'), dataIndex: 'record_driver', minWidth: 100 },
  { title: $t('external.car_administer.use_car_start_time'), dataIndex: 'record_car_start_time', minWidth: 180, time: true },
  { title: $t('external.car_administer.use_remark'), dataIndex: 'record_remark', minWidth: 100 }
]);

// 处理列表数据
const handlerList = (list) => {
  list.forEach((item) => {
    const record = item.record ?? {};
    item.record_passenger = record.passenger;
    item.record_cause = record.cause;
    item.record_companion = record.companion;
    item.record_route = record.route;
    item.record_distance = record.distance;
    item.record_driver = record.driver;
    item.record_car_start_time = record.car_start_time;
    item.record_remark = record.remark;
  });
  return list;
};

const disableStart = computed(() => {
  if (!selectedNow.value) return true;
  return selectedNow.value.status !== CAR_STATUS.free;
});

const disableEnd = computed(() => {
  if (!selectedNow.value) return true;
  return selectedNow.value.status !== CAR_STATUS.use;
});

const disableMaintainStart = computed(() => {
  if (!selectedNow.value) return true;
  return selectedNow.value.status !== CAR_STATUS.free;
});

const disableMaintainEnd = computed(() => {
  if (!selectedNow.value) return true;
  return selectedNow.value.status !== CAR_STATUS.upkeep;
});

const refreshTable = () => {
  tableRef.value?.refresh();
  tableRef.value?.clearSelected();
};

// 新增
const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

// 编辑
const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

// 派车
const handleStart = async () => {
  useRef.value?.open(selectedNow.value);
};

// 回库
const handleEnd = async () => {
  backRef.value?.open(selectedNow.value);
};

// 保养
const handleMaintainStart = async () => {
  maintainRef.value?.open(selectedNow.value);
};

// 结束保养
const handleMaintainEnd = async () => {
  await layer.confirm($t('external.car_administer.tips_maintain_end'));
  layer.loading();
  const { id, car_maintain_id } = selectedNow.value;
  const params = { id, car_maintain_id, status: CAR_STATUS.free };
  await carMaintainCreate(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  refreshTable();
};

// 选中行变更
const selectionChange = (rows) => {
  selected.value = rows;
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await carAdministerDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};

// 前往用车记录
const toUseRecord = () => {
  const now = selectedNow.value;
  if (!!now) {
    toRoutePath(permsMap.external.car_record.view, {
      car_number: now.car_number,
      title: 'external.car_administer.title_use_record',
      suffix: '-' + now.car_number
    });
  } else {
    toRoutePath(permsMap.external.car_record.view);
  }
};

// 前往用车保养
const toMaintain = () => {
  const now = selectedNow.value;
  if (!!now) {
    toRoutePath(permsMap.external.car_maintain.view, {
      car_number: now.car_number,
      title: 'external.car_administer.title_maintain_record',
      suffix: '-' + now.car_number
    });
  } else {
    toRoutePath(permsMap.external.car_maintain.view);
  }
};
</script>
