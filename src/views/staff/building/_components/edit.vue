<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="100px">
      <el-form-item :label="$t('staff.building.name')" prop="name">
        <el-input v-trim v-model="formData.name" :placeholder="$t('staff.building.placeholder_name')" clearable />
      </el-form-item>
      <el-form-item :label="$t('staff.building.leader')" prop="leader">
        <el-input v-trim v-model="formData.leader" :placeholder="$t('staff.building.placeholder_leader')" clearable />
      </el-form-item>
      <el-form-item :label="$t('staff.building.mobile')" prop="mobile">
        <el-input v-trim v-model="formData.mobile" :placeholder="$t('staff.building.placeholder_mobile')" clearable />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { staffBuildingSet } from '@/api/staff/building';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('staff.building.title_edit') : $t('staff.building.title_add')));

const formTemp = { id: null, name: '', code: '', leader: '', mobile: '' };

const formData = reactive({ ...formTemp });

const rules = {
  name: [{ required: true, message: $t('staff.building.field_check_name'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
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
  await staffBuildingSet(formData);
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
