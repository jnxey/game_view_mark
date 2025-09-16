<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="130px">
      <el-form-item :label="$t('points.consume_name.name')" prop="name">
        <el-input v-model="formData.name" :placeholder="$t('points.consume_name.placeholder_name')" clearable />
      </el-form-item>
      <el-form-item :label="$t('points.consume_name.amount')" prop="amount">
        <el-input-number
          v-model="formData.amount"
          :placeholder="$t('points.consume_name.placeholder_amount')"
          class="w-full"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input v-model="formData.remark" :placeholder="$t('common.remark_placeholder')" clearable type="textarea" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { pointsConsumeNameSet } from '@/api/points/consume-name';
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

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('points.consume_name.title_edit') : $t('points.consume_name.title_add')));

const formTemp = {
  id: null,
  name: '',
  amount: null,
  remark: ''
};

const formData = reactive({ ...formTemp });

const rules = {
  name: [{ required: true, message: $t('points.consume_name.field_check_name'), trigger: ['blur'] }],
  amount: [{ required: true, message: $t('points.consume_name.field_check_amount'), trigger: ['blur'] }]
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
  await pointsConsumeNameSet(formData);
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
