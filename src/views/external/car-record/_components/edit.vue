<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px">
      <el-form-item :label="$t('external.car_administer.car_type')" prop="car_type">
        <el-input v-model="formData.car_type" :placeholder="$t('external.car_administer.placeholder_car_type')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.car_number')" prop="car_number">
        <el-input v-model="formData.car_number" :placeholder="$t('external.car_administer.placeholder_car_number')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_passenger')" prop="passenger">
        <el-input v-model="formData.passenger" :placeholder="$t('external.car_administer.placeholder_use_passenger')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_cause')" prop="cause">
        <el-input v-model="formData.cause" :placeholder="$t('external.car_administer.placeholder_use_cause')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_companion')" prop="companion">
        <el-input v-model="formData.companion" :placeholder="$t('external.car_administer.placeholder_use_companion')" clearable />
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
      <el-form-item :label="$t('external.car_administer.car_end_time')" prop="car_end_time">
        <gv-date-picker v-model="formData.car_end_time" class="flex-1" />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.use_remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('external.car_administer.placeholder_use_remark')" clearable type="textarea" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { carRecordSet } from '@/api/external/car-record';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import GvDatePicker from '@/components/gv-date-picker/index.vue';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() =>
  mode.value === OPERATE_TYPE.update ? $t('external.car_administer.title_use_edit') : $t('external.car_administer.title_use_add')
);

const formTemp = {
  id: null,
  car_type: '',
  car_number: '',
  passenger: '',
  cause: '',
  companion: '',
  route: '',
  distance: null,
  driver: '',
  car_start_time: null,
  car_end_time: null,
  remark: ''
};

const formData = reactive({ ...formTemp });

const rules = {
  car_number: [{ required: true, message: $t('external.car_administer.field_check_car_number'), trigger: ['blur'] }],
  passenger: [{ required: true, message: $t('external.car_administer.field_check_use_passenger'), trigger: ['blur'] }],
  cause: [{ required: true, message: $t('external.car_administer.field_check_use_cause'), trigger: ['blur'] }],
  route: [{ required: true, message: $t('external.car_administer.field_check_use_route'), trigger: ['blur'] }],
  distance: [{ required: true, message: $t('external.car_administer.field_check_use_distance'), trigger: ['blur'] }],
  driver: [{ required: true, message: $t('external.car_administer.field_check_use_driver'), trigger: ['blur'] }],
  car_start_time: [{ required: true, message: $t('external.car_administer.field_check_car_start_time'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, row);
  else syncObjectData(formData, { ...formTemp });
  popupRef.value?.open();
  clearValidate();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await carRecordSet(formData);
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
