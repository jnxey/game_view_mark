<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px">
      <el-form-item :label="$t('game.chip.name')" prop="name">
        <el-input v-model="formData.name" :placeholder="$t('game.chip.placeholder_name')" clearable />
      </el-form-item>
      <el-form-item :label="$t('game.chip.face_value')" prop="value">
        <el-input-number
          class="w-full"
          v-model="formData.value"
          :placeholder="$t('game.chip.placeholder_face_value')"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('game.chip.currency')" prop="currency_config_id">
        <gv-select-currency-config-radio v-model="formData.currency_config_id" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { gameChipSet } from '@/api/game/chip';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { CURRENCY_TYPE, CURRENCY_TYPE_DICT, OPERATE_TYPE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import { $t } from '@/lang/i18n';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import GvSelectCurrencyBaseRadio from '@/components/gv-select-currency/base-radio.vue';
import GvSelectCurrencyConfigRadio from '@/components/gv-select-currency/config-radio.vue';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('game.chip.title_edit') : $t('game.chip.title_add')));

const formTemp = {
  id: null,
  name: '',
  value: null,
  currency_config_id: null
};

const formData = reactive({ ...formTemp });

const { optionsData } = useDictOptions({ currency: { api: currencyConfigLists } });

const rules = {
  name: [{ required: true, message: $t('game.chip.field_check_name'), trigger: ['blur'] }],
  value: [{ required: true, message: $t('game.chip.field_check_face_value'), trigger: ['blur'] }],
  currency_config_id: [{ required: true, message: $t('game.chip.field_check_currency'), trigger: ['blur'] }]
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
  await gameChipSet(formData);
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
