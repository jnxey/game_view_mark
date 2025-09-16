<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px">
      <el-form-item :label="$t('bonus.list.name')" prop="name">
        <gv-input-language
          v-model="formData.name"
          :placeholder="$t('bonus.list.placeholder_name')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.bonus_list_name"
        />
      </el-form-item>
      <el-form-item :label="$t('bonus.list.currency')" prop="currency_id">
        <gv-select-currency-base-radio ref="currencyBaseRef" v-model="formData.currency_id" class="flex-1" />
      </el-form-item>
      <el-form-item :label="$t('bonus.list.mini_amount')" prop="mini_amount">
        <el-input-number
          v-model="formData.mini_amount"
          :placeholder="$t('bonus.list.placeholder_mini_amount')"
          clearable
          :min="1"
          :max="Number.MAX_SAFE_INTEGER"
          :step="1"
          step-strictly
          controls-position="right"
          class="w-full"
        />
      </el-form-item>
      <el-form-item :label="$t('bonus.list.max_multiple')" prop="max_multiple">
        <el-input-number
          v-model="formData.max_multiple"
          :placeholder="$t('bonus.list.placeholder_max_multiple')"
          clearable
          :min="1"
          :max="Number.MAX_SAFE_INTEGER"
          :step="1"
          step-strictly
          controls-position="right"
          class="w-full"
        />
      </el-form-item>
      <el-form-item :label="$t('bonus.list.status')" prop="status">
        <el-switch v-model="formData.status" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
      <el-form-item :label="$t('bonus.list.remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('bonus.list.placeholder_remark')" clearable type="textarea" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { bonusListSet } from '@/api/bouns/list';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { GV_INPUT_LANGUAGE_TYPE, OPERATE_TYPE, STATUS_VALUE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import GvSelectCurrencyBase from '@/components/gv-select-currency/base.vue';
import { $t } from '@/lang/i18n';
import GvSelectCurrencyBaseRadio from '@/components/gv-select-currency/base-radio.vue';
import GvInputLanguage from '@/components/gv-input-language/index.vue';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const currencyBaseRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('bonus.list.title_edit') : $t('bonus.list.title_add')));

const formTemp = {
  id: null,
  name: '',
  currency_id: null,
  mini_amount: null,
  max_multiple: null,
  status: '',
  remark: ''
};

const formData = reactive({ ...formTemp });

const rules = {
  name: [{ required: true, message: $t('bonus.list.field_check_name'), trigger: ['blur'] }],
  currency_id: [{ required: true, message: $t('bonus.list.field_check_currency'), trigger: ['blur'] }],
  mini_amount: [{ required: true, message: $t('bonus.list.field_check_mini_amount'), trigger: ['blur'] }],
  max_multiple: [{ required: true, message: $t('bonus.list.field_check_max_multiple'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  currencyBaseRef.value?.refresh();
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, row);
  else syncObjectData(formData, { ...formTemp });
  popupRef.value?.open();
  clearValidate();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await bonusListSet(formData);
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
