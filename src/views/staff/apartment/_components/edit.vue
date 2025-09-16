<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="160px">
      <el-form-item :label="$t('staff.apartment.code')" prop="code">
        <el-input v-trim v-model="formData.code" :placeholder="$t('staff.apartment.placeholder_code')" clearable />
      </el-form-item>
      <el-form-item :label="$t('staff.apartment.building_name')" prop="building_id">
        <gv-select-options
          ref="buildingRef"
          v-model="formData.building_id"
          :placeholder="$t('staff.apartment.placeholder_building')"
          :request="staffBuildingLists"
          :empty-page="{ perm: permsMap.staff.building.view, title: $t('staff.apartment.building_name') }"
        />
      </el-form-item>
      <el-form-item :label="$t('staff.apartment.max_number')" prop="max_number">
        <el-input-number
          v-model="formData.max_number"
          :placeholder="$t('staff.apartment.placeholder_max_number')"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
          class="w-full"
        />
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('common.remark_placeholder')" clearable type="textarea" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { staffApartmentSet } from '@/api/staff/apartment';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { staffBuildingLists } from '@/api/staff/building';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const buildingRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('staff.apartment.title_edit') : $t('staff.apartment.title_add')));

const formTemp = {
  id: null,
  code: '',
  building_id: null,
  max_number: null,
  remark: ''
};

const formData = reactive({ ...formTemp });

const rules = {
  code: [{ required: true, message: $t('staff.apartment.field_check_code'), trigger: ['blur'] }],
  building_id: [{ required: true, message: $t('staff.apartment.field_check_building'), trigger: ['blur'] }],
  max_number: [{ required: true, message: $t('staff.apartment.field_check_max_number'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  buildingRef.value?.refresh();
  mode.value = type;
  if (type === OPERATE_TYPE.update) {
    syncObjectData(formData, row);
  } else {
    syncObjectData(formData, { ...formTemp });
  }
  popupRef.value?.open();
  clearValidate();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await staffApartmentSet(formData);
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
