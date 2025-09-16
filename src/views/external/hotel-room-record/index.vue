<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="hotel_room_record-list"
      :request="hotelRoomRecordLists"
      :operate-width="160"
      :popup-right-title="$t('common.operate_log')"
      :operate-perms="[permsMap.external.hotel_room_record.edit, permsMap.external.hotel_room_record.del]"
      :columns="columns"
      show-summary
      :handle-summary="useSummary('hotel_name')"
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="$t('external.hotel_room_record.title')" @back="backTab($router)" />
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
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.type"
          :placeholder="$t('external.hotel_room_record.label_status')"
          :options="ROOM_CHECK_STATUS_DICT"
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.guest_username"
          :placeholder="$t('external.hotel_room_record.label_user')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.guest_nickname"
          :placeholder="$t('external.hotel_room_record.label_nickname')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.guest_id_number"
          :placeholder="$t('external.hotel_room_record.label_id_number')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.guest_telephone"
          :placeholder="$t('external.hotel_room_record.label_telephone')"
          clearable
          @keyup.enter="search"
          v-place
        />
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.check_in_time_start"
          v-model:endTime="query.check_in_time_end"
          :placeholder="$t('external.hotel_room_record.label_check_in')"
          v-place
        />
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.check_out_time_start"
          v-model:endTime="query.check_out_time_end"
          :placeholder="$t('external.hotel_room_record.label_check_out')"
          v-place
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button
          v-perms="[permsMap.external.hotel_room_record.log]"
          type="primary"
          @click="
            toRoutePath(permsMap.external.hotel_room_record.log, {
              request: hotelRoomRecordLog.symbol,
              title: 'external.hotel_room_record.title_log',
              del_user: true
            })
          "
        >
          {{ $t('common.operate_log') }}
        </el-button>
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.external.hotel_room_record.log)">
        <gv-operate-record :request="hotelRoomRecordLog" />
      </template>
      <template #client="{ row }">
        <template v-if="isArray(row.client)">
          <guest-card class="mb-4" v-for="item in row.client" :key="item.id" :source="item" />
        </template>
        <template v-else><span /></template>
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.external.hotel_room_record.edit]" @click="handleEdit(row)">
          {{ $t('common.edit_btn') }}
        </el-button>
        <el-button link type="danger" v-perms="[permsMap.external.hotel_room_record.del]" @click="handleDelete(row.id)">
          {{ $t('common.del_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { hotelRoomRecordSet, hotelRoomRecordDel, hotelRoomRecordLists, hotelRoomRecordLog } from '@/api/external/hotel-room-record';
import { shallowRef } from 'vue';
import { ROOM_CHECK_STATUS_DICT } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { backTab } from '@/store/tabs';
import { isArray, parseDict } from '@/tools';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { useDictOptions } from '@/hooks/dict';
import { hotelRoomTypeLists } from '@/api/external/hotel-room-type';
import GvInputMemory from '@/components/gv-input-memory/index.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import GuestCard from '@/views/external/hotel-management/_components/guest-card.vue';
import { toRoutePath } from '@/router';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import { useHotelGuestShow } from '@/hooks/print-show';
import { useSummary } from '@/hooks/summary';

const editRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('external.hotel_management.name'), dataIndex: 'hotel_name', minWidth: 120 },
  { title: $t('external.hotel_management.room_number'), dataIndex: 'room_number', minWidth: 100 },
  { title: $t('external.hotel_management.room_type'), dataIndex: 'hotel_room_type', minWidth: 100 },
  { title: $t('external.hotel_room_record.label_guest_info'), dataIndex: 'client', minWidth: 320, printShow: useHotelGuestShow() },
  { title: $t('external.hotel_room_record.label_guest_number'), dataIndex: 'guest_number', minWidth: 100 },
  { title: $t('external.hotel_room_record.deposit'), dataIndex: 'deposit', minWidth: 100 },
  { title: $t('external.hotel_room_record.room_rates_true'), dataIndex: 'room_rates_true', minWidth: 100 },
  { title: $t('external.hotel_room_record.label_check_in'), dataIndex: 'check_in_time', minWidth: 180, time: true },
  { title: $t('external.hotel_room_record.label_check_out'), dataIndex: 'check_out_time', minWidth: 180, time: true },
  { title: $t('external.hotel_room_record.label_status'), dataIndex: 'type', minWidth: 100, dict: parseDict(ROOM_CHECK_STATUS_DICT) }, // 0:在住,1:已退房
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 },
  { title: $t('external.hotel_room_record.remark'), dataIndex: 'remark', minWidth: 100 }
]);

const { optionsData } = useDictOptions({
  roomType: { api: hotelRoomTypeLists }
});

const refreshTable = () => tableRef.value?.refresh();

const handleEdit = async (data) => {
  editRef.value?.open(data);
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await hotelRoomRecordDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
