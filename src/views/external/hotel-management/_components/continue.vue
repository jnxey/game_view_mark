<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px">
      <el-form-item :label="$t('external.hotel_management.room_continue_amount')" prop="room_rates_true">
        <el-input-number
          class="flex-1"
          v-model="formData.room_rates_true"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
          :placeholder="$t('external.hotel_management.placeholder_room_continue_amount')"
        />
      </el-form-item>
      <el-form-item :label="$t('external.hotel_room_record.label_check_out')" prop="check_out_time">
        <gv-date-picker v-model="formData.check_out_time" class="flex-1" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import GvDatePicker from '@/components/gv-date-picker/index.vue';
import { hotelManagementCheckContinue } from '@/api/external/hotel-management';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();

const popupTitle = computed(() => $t('external.hotel_management.room_continue'));

const formTemp = { id: null, room_rates_true: null, check_out_time: null };

const formData = reactive({ ...formTemp });

const rules = {
  room_rates_true: [{ required: true, message: $t('external.hotel_management.field_check_room_continue_amount'), trigger: ['blur'] }],
  check_out_time: [{ required: true, message: $t('external.hotel_management.field_check_room_return'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (row) => {
  syncObjectData(formData, { ...formTemp, id: row.id });
  popupRef.value?.open();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await hotelManagementCheckContinue(formData);
  layer.closeLoading();
  layer.msgSuccess($t('external.hotel_management.tips_room_continue_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
