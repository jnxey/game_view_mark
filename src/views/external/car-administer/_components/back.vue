<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px">
      <el-form-item :label="$t('external.car_administer.car_end_time')" prop="car_end_time">
        <gv-date-picker v-model="formData.car_end_time" class="flex-1" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { carAdministerEnd } from '@/api/external/car-administer';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, shallowRef } from 'vue';
import { CAR_STATUS } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { resolveServerTime, syncObjectData } from '@/tools';
import GvDatePicker from '@/components/gv-date-picker/index.vue';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();

const popupTitle = computed(() => $t('external.car_administer.title_back'));

const formTemp = { id: null, status: CAR_STATUS.free, car_end_time: resolveServerTime(Date.now()), car_record_id: null };

const formData = reactive({ ...formTemp });

const rules = {
  car_end_time: [{ required: true, message: $t('external.car_administer.field_check_car_end_time'), trigger: ['blur'] }]
};

const open = async (row) => {
  syncObjectData(formData, { ...formTemp, id: row.id, car_record_id: row.car_record_id });
  popupRef.value?.open();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await carAdministerEnd(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
