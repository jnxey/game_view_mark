<template>
  <el-button type="primary" v-perms="[staffApartmentAdminGetStaff.perm]" @click="getStaff">{{ $t('staff.components.title_find_room') }}</el-button>
  <gv-popup ref="popupRef" :title="$t('staff.components.label_room_info')" :cancel-button-text="null" :confirm-button-text="null">
    <el-result icon="success" :title="$t('staff.components.label_query_success')" :sub-title="buildName + ' - ' + apartmentCode">
      <template #extra>
        <el-button type="primary" @click="copy">{{ $t('staff.components.label_copy_room') }}</el-button>
      </template>
    </el-result>
  </gv-popup>
</template>
<script setup>
import { staffApartmentAdminGetStaff } from '@/api/staff/apartment-admin';

import layer from '@/tools/layer';
import GvPopup from '@/components/gv-popup/index.vue';
import { ref, shallowRef } from 'vue';
import { copyText } from '@/tools';
import { $t } from '@/lang/i18n';

const popupRef = shallowRef();
const buildName = ref('');
const apartmentCode = ref('');

// 编辑备注
const getStaff = async () => {
  const { value } = await layer.prompt('', $t('staff.components.label_work_no'), {
    inputPlaceholder: $t('staff.components.placeholder_work_no'),
    inputPattern: /^(?=.*\S).+$/,
    inputErrorMessage: $t('staff.components.placeholder_work_no')
  });
  layer.loading();
  const res = await staffApartmentAdminGetStaff({ staff_work_no: value });
  layer.closeLoading();
  buildName.value = res?.building_name;
  apartmentCode.value = res?.apartment_code;
  popupRef.value?.open();
};

// 复制
const copy = () => {
  copyText(apartmentCode.value);
  layer.msgSuccess($t('staff.components.tips_copy_success'));
  popupRef.value?.close();
};
</script>
