<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="hotel_management-list"
      :request="hotelManagementLists"
      :operate-width="160"
      :popup-right-title="$t('common.operate_log')"
      :operate-perms="[permsMap.external.hotel_management.edit, permsMap.external.hotel_management.del]"
      :columns="columns"
      stripe
      select-single
      delay-request
      @selection-change="selectionChange"
      :handler-list="handlerList"
    >
      <template #search-box="{ query, search, reset }">
        <gv-input-memory
          class="search-item box"
          v-model="query.hotel_name"
          :placeholder="$t('external.hotel_management.name')"
          memory-key="external-hotel-name"
          place-top
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.room_number"
          :placeholder="$t('external.hotel_management.room_number')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.hotel_room_type_id"
          :placeholder="$t('external.hotel_management.room_type')"
          :options="optionsData.roomType"
          :empty-page="{ perm: permsMap.external.hotel_room_type.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.room_status"
          :placeholder="$t('external.hotel_management.room_status')"
          :options="ROOM_STATUS_DICT"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.external.hotel_management.edit]" icon="Plus" type="primary" @click="handleAdd">
          {{ $t('common.add_btn') }}
        </el-button>
        <el-button
          v-perms="[permsMap.external.hotel_management.log]"
          type="primary"
          @click="
            toRoutePath(permsMap.external.hotel_management.log, {
              request: hotelManagementLog.symbol,
              title: 'external.hotel_management.title_log',
              del_user: true
            })
          "
        >
          {{ $t('common.operate_log') }}
        </el-button>
        <el-button
          v-perms="[permsMap.external.hotel_room_type.view]"
          type="primary"
          plain
          @click="toRoutePath(permsMap.external.hotel_room_type.view)"
        >
          {{ $t('external.hotel_management.room_type') }}
        </el-button>
        <el-button
          v-perms="[permsMap.external.hotel_room_record.view]"
          type="primary"
          plain
          @click="toRoutePath(permsMap.external.hotel_room_record.view)"
        >
          {{ $t('external.hotel_room_record.title') }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button v-perms="[permsMap.external.hotel_management.start]" type="primary" :disabled="disableStart" @click="handleStart">
          {{ $t('external.hotel_management.room_check') }}
        </el-button>
        <el-button v-perms="[permsMap.external.hotel_management.continue]" type="primary" :disabled="disableEnd" @click="handleContinue">
          {{ $t('external.hotel_management.room_continue') }}
        </el-button>
        <el-button v-perms="[permsMap.external.hotel_management.end]" type="warning" :disabled="disableEnd" @click="handleEnd">
          {{ $t('external.hotel_management.room_return') }}
        </el-button>
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.external.hotel_management.log)">
        <gv-operate-record :request="hotelManagementLog" />
      </template>
      <template #record.client="{ row }">
        <template v-if="isArray(row.record?.client)">
          <guest-card class="mb-4" v-for="item in row.record.client" :key="item.id" :source="item" />
        </template>
        <template v-else><span /></template>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.external.hotel_management.edit]" @click="handleEdit(row)">
          {{ $t('common.edit_btn') }}
        </el-button>
        <el-button link type="danger" v-perms="[permsMap.external.hotel_management.del]" @click="handleDelete(row.id)">
          {{ $t('common.del_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
    <use-popup ref="useRef" @success="refreshTable" />
    <continue-popup ref="continueRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import {
  hotelManagementSet,
  hotelManagementDel,
  hotelManagementLists,
  hotelManagementCheckIn,
  hotelManagementCheckOut,
  hotelManagementCheckContinue,
  hotelManagementLog
} from '@/api/external/hotel-management';
import { computed, onActivated, onBeforeMount, shallowRef } from 'vue';
import { CAR_STATUS, OPERATE_TYPE, ROOM_STATUS_DICT } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import UsePopup from './_components/use.vue';
import ContinuePopup from './_components/continue.vue';
import layer from '@/tools/layer';
import { hotelRoomRecordLists } from '@/api/external/hotel-room-record';
import { toRoutePath } from '@/router';
import { hotelRoomTypeLists } from '@/api/external/hotel-room-type';
import { useDictOptions } from '@/hooks/dict';
import { isArray, parseDict } from '@/tools';
import GvInputMemory from '@/components/gv-input-memory/index.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import GuestCard from '@/views/external/hotel-management/_components/guest-card.vue';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import { useHotelGuestShow } from '@/hooks/print-show';

const editRef = shallowRef();
const useRef = shallowRef();
const continueRef = shallowRef();
const tableRef = shallowRef();
const selected = shallowRef([]);

const selectedNow = computed(() => {
  return selected.value[0];
});

const { optionsData, refresh } = useDictOptions({ roomType: { api: hotelRoomTypeLists } }, true);

const columns = computed(() => {
  return [
    { title: $t('external.hotel_management.name'), dataIndex: 'hotel_name', minWidth: 120 },
    { title: $t('external.hotel_management.room_number'), dataIndex: 'room_number', minWidth: 120 },
    { title: $t('external.hotel_management.room_type'), dataIndex: 'hotel_room_type_id', minWidth: 120, dict: parseDict(optionsData.roomType ?? []) },
    { title: $t('external.hotel_management.room_status'), dataIndex: 'room_status', minWidth: 120, dict: parseDict(ROOM_STATUS_DICT) }, // 0:空闲,1:使用,2:维护,3:停用
    { title: $t('external.hotel_management.room_images'), dataIndex: 'room_images', minWidth: 120, image: true },
    { title: $t('external.hotel_room_record.label_guest_info'), dataIndex: 'record.client', minWidth: 320, printShow: useHotelGuestShow() },
    { title: $t('external.hotel_room_record.label_guest_number'), dataIndex: 'record_guest_number', minWidth: 120 },
    { title: $t('external.hotel_room_record.deposit'), dataIndex: 'record_deposit', minWidth: 120 },
    { title: $t('external.hotel_room_record.room_rates_true'), dataIndex: 'record_room_rates_true', minWidth: 120 },
    { title: $t('external.hotel_room_record.label_check_in'), dataIndex: 'record_check_in_time', minWidth: 180, time: true },
    { title: $t('external.hotel_room_record.label_check_out'), dataIndex: 'record_check_out_time', minWidth: 180, time: true },
    { title: $t('common.operate_person'), dataIndex: 'record_work_no', minWidth: 120 },
    { title: $t('external.hotel_room_record.remark'), dataIndex: 'record_remark', minWidth: 120 }
  ];
});

// 处理列表数据
const handlerList = (list) => {
  list.forEach((item) => {
    const record = item.record ?? {};
    item.record_client = record.client;
    item.record_guest_number = record.guest_number;
    item.record_deposit = record.deposit;
    item.record_room_rates_true = record.room_rates_true;
    item.record_check_in_time = record.check_in_time;
    item.record_check_out_time = record.check_out_time;
    item.record_work_no = record.work_no;
    item.record_remark = record.remark;
  });
  return list;
};

const disableStart = computed(() => {
  if (!selectedNow.value) return true;
  return selectedNow.value.room_status !== CAR_STATUS.free;
});

const disableEnd = computed(() => {
  if (!selectedNow.value) return true;
  return selectedNow.value.room_status !== CAR_STATUS.use;
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

// 开房
const handleStart = async () => {
  useRef.value?.open(selectedNow.value);
};

// 退房
const handleEnd = async () => {
  await layer.confirm($t('external.hotel_management.tips_room_return', { number: selectedNow.value.room_number }));
  layer.loading();
  const params = {
    id: selectedNow.value.id,
    hotel_name: selectedNow.value.hotel_name,
    room_number: selectedNow.value.room_number,
    hotel_room_type_id: selectedNow.value.hotel_room_type_id
  };
  await hotelManagementCheckOut(params);
  layer.closeLoading();
  layer.msgSuccess($t('external.hotel_management.tips_room_return_success'));
  refreshTable();
};

// 续住
const handleContinue = async () => {
  continueRef.value?.open(selectedNow.value);
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await hotelManagementDel({ id, password: value });
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
