<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="hotel_room_type-list"
      :request="hotelRoomTypeLists"
      :operate-width="160"
      :popup-right-title="$t('common.operate_log')"
      :operate-perms="[permsMap.external.hotel_room_type.edit, permsMap.external.hotel_room_type.del]"
      :columns="columns"
    >
      <template #search-box>
        <el-page-header class="pb-16" :content="$t('external.hotel_room_type.title')" @back="backTab($router)" />
      </template>
      <template #handler-left>
        <el-button v-perms="[permsMap.external.hotel_room_type.edit]" icon="Plus" type="primary" @click="handleAdd">
          {{ $t('common.add_btn') }}
        </el-button>
        <el-button
          v-perms="[permsMap.external.hotel_room_type.log]"
          type="primary"
          @click="
            toRoutePath(permsMap.external.hotel_room_type.log, {
              request: hotelRoomTypeLog.symbol,
              title: 'external.hotel_room_type.title_log',
              del_user: true
            })
          "
        >
          {{ $t('common.operate_log') }}
        </el-button>
      </template>
      <!--      -->
      <template #popup-right v-if="checkPerm(permsMap.external.hotel_room_type.log)">
        <gv-operate-record :request="hotelRoomTypeLog" />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" v-perms="[permsMap.external.hotel_room_type.edit]" @click="handleEdit(row)">
          {{ $t('common.edit_btn') }}
        </el-button>
        <el-button link type="danger" v-perms="[permsMap.external.hotel_room_type.del]" @click="handleDelete(row.id)">
          {{ $t('common.del_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-popup ref="editRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { hotelRoomTypeSet, hotelRoomTypeDel, hotelRoomTypeLists, hotelRoomTypeLog } from '@/api/external/hotel-room-type';
import { shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditPopup from './_components/edit.vue';
import layer from '@/tools/layer';
import { backTab } from '@/store/tabs';
import { toRoutePath } from '@/router';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';

const editRef = shallowRef();
const tableRef = shallowRef();

const columns = shallowRef([
  { title: $t('external.hotel_room_type.name'), dataIndex: 'name', minWidth: 100 },
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 },
  { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
  { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true }
]);

const refreshTable = () => tableRef.value?.refresh();

const handleAdd = async () => {
  editRef.value?.open(OPERATE_TYPE.insert);
};

const handleEdit = async (data) => {
  editRef.value?.open(OPERATE_TYPE.update, data);
};

// 删除
const handleDelete = async (id) => {
  const { value } = await layer.password();
  layer.loading();
  await hotelRoomTypeDel({ id, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  refreshTable();
};
</script>
