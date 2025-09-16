<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px">
      <el-form-item :label="$t('external.car_administer.maintain_contact_person')" prop="contact_person">
        <el-input v-model="formData.contact_person" :placeholder="$t('external.car_administer.placeholder_maintain_contact_person')" clearable />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.maintain_type')" prop="maintain_type">
        <gv-input-memory
          v-model="formData.maintain_type"
          :placeholder="$t('external.car_administer.placeholder_maintain_type')"
          memory-key="external-car-maintain"
          :default-options="useDefCarMaintain()"
        />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.maintain_money')" prop="maintain_money">
        <el-input-number
          v-model="formData.maintain_money"
          :placeholder="$t('external.car_administer.placeholder_maintain_money')"
          clearable
          class="w-full"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.maintain_time_end')" prop="maintain_time_end">
        <gv-daterange-picker v-model:start-time="formData.maintain_time_start" v-model:end-time="formData.maintain_time_end" class="flex-1" big />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.maintain_address')" prop="maintain_address">
        <el-input
          v-model="formData.maintain_address"
          :placeholder="$t('external.car_administer.placeholder_maintain_address')"
          clearable
          type="textarea"
        />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.maintain_shop_contact_details')" prop="shop_contact_details">
        <el-input
          v-model="formData.shop_contact_details"
          :placeholder="$t('external.car_administer.placeholder_maintain_shop_contact_details')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.maintain_remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('external.car_administer.placeholder_maintain_remark')" clearable type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('external.car_administer.maintain_images')" prop="images">
        <gv-material-picker custom-class="w-full" v-model="formData.images" :limit="6" />
        <div class="text-tips">{{ $t('external.car_administer.tips_maintain_images') }}</div>
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { carMaintainCreate } from '@/api/external/car-maintain';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { CAR_STATUS } from '@/values';
import { useDefCarMaintain } from '@/hooks/input-memory';
import GvInputMemory from '@/components/gv-input-memory/index.vue';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();

const popupTitle = computed(() => $t('external.car_administer.title_maintain_add'));

const formTemp = {
  id: null,
  car_type: '',
  car_number: '',
  contact_person: '',
  maintain_type: '',
  maintain_money: null,
  maintain_time_start: null,
  maintain_time_end: null,
  maintain_address: '',
  shop_contact_details: '',
  images: '',
  remark: '',
  status: CAR_STATUS.upkeep
};

const formData = reactive({ ...formTemp });

const rules = {
  contact_person: [{ required: true, message: $t('external.car_administer.field_check_maintain_contact_person'), trigger: ['blur'] }],
  maintain_type: [{ required: true, message: $t('external.car_administer.field_check_maintain_type'), trigger: ['blur'] }],
  maintain_money: [{ required: true, message: $t('external.car_administer.field_check_maintain_money'), trigger: ['blur'] }],
  maintain_time_end: [{ required: true, message: $t('external.car_administer.field_check_maintain_time_end'), trigger: ['blur'] }],
  maintain_address: [{ required: true, message: $t('external.car_administer.field_check_maintain_address'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (row) => {
  syncObjectData(formData, { id: row.id, car_type: row.car_type, car_number: row.car_number, images: [] });
  clearValidate();
  popupRef.value?.open();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  const params = { ...formData, images: JSON.stringify(formData.images) };
  await carMaintainCreate(params);
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
