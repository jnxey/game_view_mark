<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px">
      <el-form-item :label="$t('external.car_administer.car_type')" prop="car_type">
        <gv-input-memory
          v-model="formData.car_type"
          :placeholder="$t('external.car_administer.placeholder_car_type')"
          memory-key="external-car-type"
          :default-options="useDefCarType()"
        />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.car_number')" prop="car_number">
        <el-input v-model="formData.car_number" :placeholder="$t('external.car_administer.placeholder_car_number')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.seating_capacity')" prop="seating_capacity">
        <el-input-number
          v-model="formData.seating_capacity"
          :placeholder="$t('external.car_administer.placeholder_seating_capacity')"
          class="w-full"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.status')" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio class="custom-radio mb-4" v-for="item in CAR_STATUS_DICT" :value="item.value" :disabled="getDisable(item)">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { carAdministerSet } from '@/api/external/car-administer';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { CAR_STATUS, CAR_STATUS_DICT, OPERATE_TYPE, STATUS_VALUE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import { useDefCarType } from '@/hooks/input-memory';
import GvInputMemory from '@/components/gv-input-memory/index.vue';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() =>
  mode.value === OPERATE_TYPE.update ? $t('external.car_administer.title_edit') : $t('external.car_administer.title_add')
);

const formTemp = {
  id: null,
  car_type: '',
  car_number: '',
  seating_capacity: null,
  status: STATUS_VALUE.normal
};

const formData = reactive({ ...formTemp });

const rules = {
  car_type: [{ required: true, message: $t('external.car_administer.field_check_car_type'), trigger: ['blur'] }],
  car_number: [{ required: true, message: $t('external.car_administer.field_check_car_number'), trigger: ['blur'] }],
  seating_capacity: [{ required: true, message: $t('external.car_administer.field_check_seating_capacity'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, row);
  else syncObjectData(formData, { ...formTemp });
  popupRef.value?.open();
  clearValidate();
};

const getDisable = (item) => {
  if (mode.value === OPERATE_TYPE.insert) {
    return item.value === CAR_STATUS.use;
  } else {
    return formData.status === CAR_STATUS.use || item.value === CAR_STATUS.use;
  }
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await carAdministerSet(formData);
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
