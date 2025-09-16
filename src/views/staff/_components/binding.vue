<template>
  <gv-popup
    ref="popupRef"
    :title="$t('staff.components.title_bind')"
    :async="true"
    width="800px"
    :click-modal-close="true"
    :confirm-button-text="null"
    :cancel-button-text="null"
  >
    <div class="handler-wrap flex-row align-center mb-16">
      <div class="flex-1 text-main">
        <span>{{ $t('staff.components.label_room') }}：</span>
        <span class="fz-20 fw-bold">{{ currentRoom && currentRoom.code }}</span>
        <span class="ml-16">{{ $t('staff.components.label_max_number') }}：</span>
        <span class="fz-20 fw-bold">{{ currentRoom && currentRoom.max_number }}</span>
      </div>
      <div class="flex-row justify-end">
        <el-button type="primary" @click="openSelect">{{ $t('staff.components.label_bind_btn') }}</el-button>
      </div>
    </div>
    <el-table :data="tableList" height="30vh">
      <el-table-column prop="staff_work_no" :label="$t('staff.components.label_work_no')" min-width="100">
        <template #default="{ row }">
          <span class="link" @click="copyWorkNo(row.staff_work_no)">
            {{ row.staff_work_no }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" :label="$t('staff.components.label_bind_time')" min-width="100">
        <template #default="{ row }">{{ row.create_time && dayjs(formatServerTime(row.create_time)).format(getTimeFormat('day')) }}</template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('common.remark')" min-width="100" show-overflow-tooltip>
        <template #default="{ row }">
          <span class="link" @click="editRemark(row)">{{ row.remark }}</span>
          <gv-icon v-if="!row.remark" name="local-icon-remark" class="link fz-16" @click="editRemark(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="work_no" :label="$t('common.operate_person')" min-width="100" />
      <el-table-column :label="$t('common.operate_col')" fixed="right" min-width="100">
        <template #default="{ row }">
          <el-button link type="danger" @click="handleDelete(row.id)">{{ $t('staff.components.label_unbind_btn') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </gv-popup>
  <gv-select-admin ref="selectAdminRef" :selected="tableAdminMap" @success="selectAdmin" />
</template>
<script setup>
import { staffApartmentAdminSet, staffApartmentAdminDel, staffApartmentAdminLists } from '@/api/staff/apartment-admin';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, ref, shallowRef, unref } from 'vue';
import layer from '@/tools/layer';
import { QUERY_LIST_TYPE } from '@/values';
import dayjs from 'dayjs';
import { toRoutePath } from '@/router';
import { adminLists } from '@/api/staff/admin';
import GvSelectAdmin from '@/components/gv-select-admin/index.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import { formatServerTime, mappingArrayToObject, getTimeFormat, copyText } from '@/tools';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['refresh', 'close']);
const popupRef = shallowRef();
const selectAdminRef = shallowRef();
const currentRoom = ref();
const tableList = shallowRef([]);

const tableAdminMap = computed(() => mappingArrayToObject(tableList.value ?? [], 'staff_id'));

const open = async (row) => {
  currentRoom.value = unref(row);
  await getTableData(row.id);
  popupRef.value?.open();
};

// 获取列表数据
const getTableData = async (id) => {
  layer.loading();
  const { lists } = await staffApartmentAdminLists({ page_type: QUERY_LIST_TYPE.all, apartment_id: id });
  layer.closeLoading();
  tableList.value = lists ?? [];
};

// 打开员工选中
const openSelect = () => {
  selectAdminRef.value?.open();
};

// 选中员工
const selectAdmin = async (row) => {
  layer.loading();
  await staffApartmentAdminSet({ apartment_id: currentRoom.value?.id, staff_id: row.id });
  layer.closeLoading();
  getTableData(currentRoom.value?.id);
  emit('refresh');
};

// 删除
const handleDelete = async (id) => {
  await layer.confirm($t('staff.components.tips_confirm_unbind'));
  layer.loading();
  await staffApartmentAdminDel({ id });
  layer.closeLoading();
  layer.msgSuccess($t('staff.components.tips_unbind_success'));
  getTableData(currentRoom.value?.id);
  emit('refresh');
};

// 编辑备注
const editRemark = async (row) => {
  const { value } = await layer.prompt('', $t('common.remark'), {
    inputValue: row.remark,
    inputPlaceholder: $t('common.remark_placeholder'),
    inputType: 'textarea'
  });
  layer.loading();
  await staffApartmentAdminSet({ id: row.id, remark: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  getTableData(currentRoom.value?.id);
};

// 复制
const copyWorkNo = (content) => {
  copyText(content);
  layer.msgSuccess($t('staff.components.tips_copy_success'));
};

defineExpose({ open });
</script>
