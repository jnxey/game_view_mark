<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px" @submit.prevent>
      <el-form-item :label="$t('perms.data.name')" prop="name">
        <gv-input-language
          custom-class="ls-input"
          v-model="formData.name"
          :placeholder="$t('perms.data.placeholder_name')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.perms_data_name"
        />
      </el-form-item>
      <el-form-item :label="$t('perms.data.apply_page')" prop="apply_page">
        <gv-select-options
          class="w-full"
          v-model="formData.apply_page"
          :placeholder="$t('perms.data.placeholder_apply_page')"
          :options="DATA_PAGE_LIST"
        />
      </el-form-item>
      <el-form-item :label="$t('common.time_range')" prop="date_range_type">
        <gv-select-options
          class="w-full"
          v-model="formData.date_range_type"
          :placeholder="$t('perms.data.placeholder_date_range')"
          :options="PERMS_DATA_RANGE"
        />
      </el-form-item>
      <el-form-item v-if="formData.date_range_type === PERMS_DATA_CUSTOM" :label="$t('perms.data.custom_days')" prop="custom_days">
        <el-input-number
          v-model="formData.custom_days"
          :min="1"
          :step="1"
          step-strictly
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
          class="w-full"
        />
      </el-form-item>
      <el-form-item :label="$t('perms.data.description')" prop="description">
        <el-input
          class="ls-input"
          v-trim
          v-model="formData.description"
          type="textarea"
          :placeholder="$t('perms.data.placeholder_description')"
          clearable
        />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { GV_INPUT_LANGUAGE_TYPE, OPERATE_TYPE, PERMS_DATA_CUSTOM, PERMS_DATA_RANGE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { roleDataPermsSet } from '@/api/perms/role';
import { DATA_PAGE_LIST } from '@/views/perms/data/_models';
import { $t } from '@/lang/i18n';
import GvInputLanguage from '@/components/gv-input-language/index.vue';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('perms.data.title_edit') : $t('perms.data.title_add')));

const formTemp = { id: null, name: '', apply_page: null, description: '', date_range_type: PERMS_DATA_RANGE[0]?.value, custom_days: null };
const formData = reactive({ ...formTemp });

const rules = {
  name: [{ required: true, message: $t('perms.data.field_check_name'), trigger: ['blur'] }],
  apply_page: [{ required: true, message: $t('perms.data.field_check_apply_page'), trigger: ['blur'] }],
  date_range_type: [{ required: true, message: $t('perms.data.field_check_date_range'), trigger: ['blur'] }],
  custom_days: [{ required: true, message: $t('perms.data.field_check_custom_days'), trigger: ['blur'] }]
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
  await roleDataPermsSet(formData);
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
