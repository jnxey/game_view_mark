<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="100px">
      <el-form-item :label="$t('currency.config.currency')" prop="currency_id">
        <gv-select-currency-base
          ref="currencyBaseRef"
          class="flex-1"
          virtual
          v-model="formData.currency_id"
          :disabled="mode === OPERATE_TYPE.update"
          :placeholder="$t('currency.config.placeholder_currency')"
        />
      </el-form-item>
      <el-form-item :label="$t('currency.config.name')" prop="name">
        <gv-input-language
          v-model="formData.name"
          :placeholder="$t('currency.config.placeholder_name')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.currency_config_name"
        />
      </el-form-item>
      <el-form-item :label="$t('currency.config.type')" prop="type">
        <el-radio-group v-model="formData.type" :disabled="mode === OPERATE_TYPE.update">
          <el-radio class="custom-radio" v-for="item in CURRENCY_TYPE_DICT" :value="item.value">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('currency.config.color')" prop="color">
        <el-color-picker v-model="formData.color" show-alpha />
      </el-form-item>
      <el-form-item :label="$t('currency.config.status')" prop="status">
        <el-switch v-model="formData.status" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
      <el-form-item :label="$t('currency.config.remark')" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :placeholder="$t('currency.config.placeholder_remark')" clearable />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { currencyConfigSet } from '@/api/currency/config';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { CURRENCY_TYPE, CURRENCY_TYPE_DICT, GV_INPUT_LANGUAGE_TYPE, OPERATE_TYPE, STATUS_VALUE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import GvSelectCurrencyBase from '@/components/gv-select-currency/base.vue';
import { $t } from '@/lang/i18n';
import GvInputLanguage from '@/components/gv-input-language/index.vue';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const currencyBaseRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('currency.config.title_edit') : $t('currency.config.title_add')));

const formTemp = {
  id: null,
  currency_id: null,
  name: '',
  type: CURRENCY_TYPE.cash,
  remark: '',
  color: '',
  status: STATUS_VALUE.normal,
  sort: 0
};

const formData = reactive({ ...formTemp });

const rules = {
  currency_id: [{ required: true, message: $t('currency.config.field_check_currency'), trigger: ['blur'] }],
  name: [{ required: true, message: $t('currency.config.field_check_name'), trigger: ['blur'] }],
  sort: [{ required: true, message: $t('currency.config.field_sort'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row, list) => {
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, row);
  else syncObjectData(formData, { ...formTemp, sort: list.length });
  popupRef.value?.open();
  currencyBaseRef.value?.refresh();
  clearValidate();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await currencyConfigSet(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  if (mode.value === OPERATE_TYPE.insert) layer.alertWarning($t('currency.config.tips_submit'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
