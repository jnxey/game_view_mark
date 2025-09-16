<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px">
      <el-form-item :label="$t('external.car_administer.use_passenger')" prop="passenger">
        <el-input v-model="formData.passenger" :placeholder="$t('external.car_administer.placeholder_use_passenger')" clearable type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_cause')" prop="cause">
        <el-input v-model="formData.cause" :placeholder="$t('external.car_administer.placeholder_use_cause')" clearable type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_companion')" prop="companion">
        <el-input v-model="formData.companion" :placeholder="$t('external.car_administer.placeholder_use_companion')" clearable type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_route')" prop="route">
        <el-input v-model="formData.route" :placeholder="$t('external.car_administer.placeholder_use_route')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_distance')" prop="distance">
        <el-input-number
          v-model="formData.distance"
          :placeholder="$t('external.car_administer.placeholder_use_distance')"
          clearable
          class="w-full"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_driver')" prop="driver">
        <el-input v-model="formData.driver" :placeholder="$t('external.car_administer.placeholder_use_driver')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_car_start_time')" prop="car_start_time">
        <gv-date-picker v-model="formData.car_start_time" class="flex-1" />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('external.car_administer.placeholder_use_remark')" clearable type="textarea" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { carAdministerStart } from '@/api/external/car-administer';
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

const popupTitle = computed(() => $t('external.car_administer.title_use'));

const formTemp = {
  id: null,
  car_type: '',
  car_number: '',
  seating_capacity: '',
  status: CAR_STATUS.use,
  passenger: '',
  cause: '',
  companion: '',
  route: '',
  distance: null,
  driver: '',
  remark: '',
  car_start_time: resolveServerTime(Date.now())
};

const formData = reactive({ ...formTemp });

const rules = {
  passenger: [{ required: true, message: $t('external.car_administer.field_check_use_passenger'), trigger: ['blur'] }],
  cause: [{ required: true, message: $t('external.car_administer.field_check_use_cause'), trigger: ['blur'] }],
  route: [{ required: true, message: $t('external.car_administer.field_check_use_route'), trigger: ['blur'] }],
  distance: [{ required: true, message: $t('external.car_administer.field_check_use_distance'), trigger: ['blur'] }],
  driver: [{ required: true, message: $t('external.car_administer.field_check_use_driver'), trigger: ['blur'] }],
  car_start_time: [{ required: true, message: $t('external.car_administer.field_check_car_start_time'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (row) => {
  syncObjectData(formData, { ...formTemp, id: row.id, car_type: row.car_type, car_number: row.car_number, seating_capacity: row.seating_capacity });
  clearValidate();
  popupRef.value?.open();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await carAdministerStart(formData);
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
