<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="120px" @submit.prevent>
      <el-form-item :label="$t('finance.video_recorder.brand')" prop="brand">
        <el-radio-group v-model="formData.brand">
          <el-radio class="custom-radio" v-for="item in VIDEO_RECORDER_VALUE_DICT" :value="item.value">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('finance.video_recorder.name')" prop="ip">
        <el-input v-model="formData.model_number" :placeholder="$t('finance.video_recorder.placeholder_name')" clearable />
      </el-form-item>
      <el-form-item :label="$t('finance.video_recorder.ip')" prop="ip">
        <el-input v-model="formData.ip" :placeholder="$t('finance.video_recorder.placeholder_ip')" clearable />
      </el-form-item>
      <el-form-item :label="$t('finance.video_recorder.port')" prop="port">
        <el-input-number
          v-model="formData.port"
          :placeholder="$t('finance.video_recorder.placeholder_port')"
          controls-position="right"
          class="w-full"
          :min="1"
          :max="999"
        />
      </el-form-item>
      <el-form-item :label="$t('finance.video_recorder.account')" prop="account">
        <el-input v-model="formData.account" :placeholder="$t('finance.video_recorder.placeholder_account')" clearable />
      </el-form-item>
      <el-form-item :label="$t('finance.video_recorder.password')" prop="password">
        <el-input v-model="formData.password" :placeholder="$t('finance.video_recorder.placeholder_password')" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCheckConnection">{{ $t('finance.video_recorder.btn_check_connection') }}</el-button>
      </el-form-item>
    </el-form>
  </gv-popup>
  <gv-video-recorder-connection :check-info="formData" ref="videoRecorderConnectionRef" />
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { OPERATE_TYPE, VIDEO_RECORDER_VALUE, VIDEO_RECORDER_VALUE_DICT } from '@/values';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { syncObjectData } from '@/tools';
import { $t } from '@/lang/i18n';
import { financeCameraSet } from '@/api/finance/video-recorder';
import GvVideoRecorderConnection from '@/components/gv-video-recorder-connection/index.vue';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const videoRecorderConnectionRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() =>
  mode.value === OPERATE_TYPE.update ? $t('finance.video_recorder.title_edit') : $t('finance.video_recorder.title_add')
);

const formTemp = { id: null, brand: VIDEO_RECORDER_VALUE.HIKVision, ip: '192.168.1.XXX', port: 80, model_number: '', account: 'admin', password: '' };

const formData = reactive({ ...formTemp });

const rules = {
  name: [{ required: true, message: $t('finance.table_type.field_check_name'), trigger: ['blur'] }]
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
  await financeCameraSet(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

const handleCheckConnection = async () => {
  videoRecorderConnectionRef.value.show();
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
