<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="100px" @submit.prevent>
      <el-form-item :label="$t('components.gv_material.cate_name')" prop="name">
        <el-input class="ls-input" v-trim v-model="formData.name" :placeholder="$t('components.gv_material.cate_placeholder_name')" clearable />
      </el-form-item>
      <el-form-item :label="$t('components.gv_material.cate_is_private')" prop="is_private" required>
        <el-switch v-model="formData.is_private" :active-value="YES_NO_VALUE.yes" :inactive-value="YES_NO_VALUE.no" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE, YES_NO_VALUE } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() =>
  mode.value === OPERATE_TYPE.update ? $t('components.gv_material.cate_title_edit') : $t('components.gv_material.cate_title_add')
);

const props = defineProps({ addFn: Function, editFn: Function });

const formTemp = { id: null, pid: null, name: '', is_private: YES_NO_VALUE.yes };
const formData = reactive({ ...formTemp });

const rules = {
  name: [{ required: true, message: $t('components.gv_material.cate_placeholder_name'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row, pid) => {
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, row);
  else syncObjectData(formData, { ...formTemp, pid: pid });
  popupRef.value?.open();
  clearValidate();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  mode.value === OPERATE_TYPE.update ? await props.editFn(formData) : await props.addFn(formData);
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
