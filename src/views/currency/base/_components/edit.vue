<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="100px">
      <el-form-item v-if="mode === OPERATE_TYPE.insert" :label="$t('currency.base.quick_fill')">
        <gv-input-currency class="w-full" @select-currency="selectCurrency" />
      </el-form-item>
      <el-form-item :label="$t('currency.base.name')" prop="name">
        <gv-input-language
          v-model="formData.name"
          :placeholder="$t('currency.base.placeholder_name')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.currency_base_name"
        />
      </el-form-item>
      <el-form-item :label="$t('currency.base.icon')" prop="icon">
        <el-input
          v-trim
          v-model="formData.icon"
          :placeholder="$t('currency.base.placeholder_icon')"
          clearable
          :disabled="mode === OPERATE_TYPE.update"
        />
      </el-form-item>
      <el-form-item :label="$t('currency.base.abbreviation')" prop="abbreviation">
        <el-input
          v-model="formData.abbreviation"
          :placeholder="$t('currency.base.placeholder_abbreviation')"
          clearable
          :disabled="mode === OPERATE_TYPE.update"
        />
      </el-form-item>
      <el-form-item :label="$t('currency.base.color')" prop="color">
        <el-color-picker v-model="formData.color" show-alpha />
      </el-form-item>
      <el-form-item :label="$t('currency.base.virtual_status')" prop="status">
        <el-switch v-model="formData.virtual_status" :active-value="YES_NO_VALUE.yes" :inactive-value="YES_NO_VALUE.no" />
      </el-form-item>
      <el-form-item :label="$t('currency.base.remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('currency.base.placeholder_remark')" type="textarea" clearable />
      </el-form-item>
      <el-form-item :label="$t('currency.base.image')" prop="image">
        <gv-material-picker custom-class="w-full" v-model="formData.image" :limit="1" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { currencyBaseSet } from '@/api/currency/base';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { GV_INPUT_LANGUAGE_TYPE, OPERATE_TYPE, STATUS_VALUE, YES_NO_VALUE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { getCurrencyImage, syncObjectData } from '@/tools';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import GvInputCurrency from '@/components/gv-input-currency/index.vue';
import { $t } from '@/lang/i18n';
import GvInputLanguage from '@/components/gv-input-language/index.vue';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('currency.base.title_edit') : $t('currency.base.title_add')));

const formTemp = {
  id: null,
  name: '',
  icon: '',
  image: '',
  abbreviation: '',
  color: '',
  remark: '',
  virtual_status: YES_NO_VALUE.no
};

const formData = reactive({ ...formTemp });

const rules = {
  name: [{ required: true, message: $t('currency.base.field_check_name'), trigger: ['blur'] }],
  icon: [{ required: true, message: $t('currency.base.field_check_icon'), trigger: ['blur'] }],
  image: [{ required: true, message: $t('currency.base.field_check_image'), trigger: ['blur'] }],
  abbreviation: [{ required: true, message: $t('currency.base.field_check_abbreviation'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, row);
  else syncObjectData(formData, { ...formTemp });
  popupRef.value?.open();
  clearValidate();
};

const selectCurrency = (item) => {
  formData.name = item.name;
  formData.icon = item.symbol;
  formData.abbreviation = item.code;
  formData.image = getCurrencyImage(item.image);
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await currencyBaseSet(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  if (mode.value === OPERATE_TYPE.insert) layer.alertWarning($t('currency.base.tips_submit'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
