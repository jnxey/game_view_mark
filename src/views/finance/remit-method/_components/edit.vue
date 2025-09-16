<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="100px" @submit.prevent>
      <el-form-item :label="$t('finance.remit_type.name')" prop="name">
        <gv-input-language
          custom-class="ls-input"
          v-model="formData.name"
          :placeholder="$t('finance.remit_type.placeholder_name')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.remit_type_name"
        />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { GV_INPUT_LANGUAGE_TYPE, OPERATE_TYPE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import { $t } from '@/lang/i18n';
import GvInputLanguage from '@/components/gv-input-language/index.vue';
import { financeRemitTypeSet } from '@/api/finance/remit-type';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('finance.remit_type.title_edit') : $t('finance.remit_type.title_add')));

const formTemp = { id: null, name: '' };

const formData = reactive({ ...formTemp });

const rules = {
  name: [{ required: true, message: $t('finance.remit_type.field_check_name'), trigger: ['blur'] }]
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
  await financeRemitTypeSet(formData);
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
