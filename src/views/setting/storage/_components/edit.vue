<template>
  <gv-popup ref="popupRef" title="设置存储" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="120px" :rules="formRules">
      <el-form-item label="存储方式" prop="engine">
        <div class="flex-1 flex-col justify-start">
          <el-radio checked>{{ getStorageInfo?.name }}</el-radio>
          <div class="text-tips">{{ getStorageInfo?.tips }}</div>
        </div>
      </el-form-item>
      <div v-if="formData.engine !== 'local'">
        <el-form-item label="存储空间名称" prop="bucket">
          <el-input v-trim v-model="formData.bucket" placeholder="请输入存储空间名称(Bucket)" clearable />
        </el-form-item>
        <el-form-item label="ACCESS_KEY" prop="access_key">
          <el-input v-model="formData.access_key" placeholder="请输入ACCESS_KEY(AK)" clearable />
        </el-form-item>
        <el-form-item label="SECRET_KEY" prop="secret_key">
          <el-input v-model="formData.secret_key" placeholder="请输入SECRET_KEY(SK)" clearable />
        </el-form-item>
        <el-form-item label="空间域名" prop="domain">
          <div class="flex-1 flex-col justify-start">
            <el-input v-model="formData.domain" placeholder="请输入空间域名(Domain)" clearable />
            <div class="text-tips">请补全http://或https://，例如https://static.cloud.com</div>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio class="custom-radio" :value="OPENED_VALUE.open">开启</el-radio>
          <el-radio class="custom-radio" :value="OPENED_VALUE.close">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { storageSetup } from '@/api/setting/storage';
import { storageDetail } from '@/api/setting/storage';
import { computed, reactive, shallowRef } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import layer from '@/tools/layer';
import { OPENED_VALUE } from '@/values';
import { $t } from '@/lang/i18n';

const StorageEnum = {
  LOCAL: 'local', // 本地
  QINIU: 'qiniu', // 七牛云
  ALIYUN: 'aliyun', // 阿里云OSS
  QCLOUD: 'qcloud' // 腾讯云OSS
};

const emit = defineEmits(['success']);
const formRef = shallowRef();
const popupRef = shallowRef();
const formData = reactive({
  engine: '',
  bucket: '',
  access_key: '',
  secret_key: '',
  domain: '',
  region: '', // 腾讯云需要
  status: 0
});

const storageArr = [
  { name: '本地存储', type: StorageEnum.LOCAL, tips: '本地存储方式不需要配置其他参数' },
  { name: '七牛云存储', type: StorageEnum.QINIU, tips: '切换七牛云存储后，素材库需要重新上传至七牛云' },
  { name: '阿里云OSS', type: StorageEnum.ALIYUN, tips: '切换阿里云OSS后，素材库需要重新上传至阿里云OSS' },
  { name: '腾讯云OSS', type: StorageEnum.QCLOUD, tips: '切换腾讯云OSS后，素材库需要重新上传至腾讯云OSS' }
];

const formRules = {
  bucket: [{ required: true, message: '请输入存储空间名称', trigger: 'blur' }],
  access_key: [{ required: true, message: '请输入ACCESS_KEY', trigger: 'blur' }],
  secret_key: [{ required: true, message: '请输入SECRET_KEY', trigger: 'blur' }],
  domain: [{ required: true, message: '请输入空间域名', trigger: 'blur' }],
  region: [{ required: true, message: '请输入REGION', trigger: 'blur' }]
};

const getStorageInfo = computed(() => {
  return storageArr.find((item) => item.type === formData.engine);
});

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  await storageSetup(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

const getDetail = async () => {
  const data = await storageDetail({ engine: formData.engine });
  for (const key in data) {
    formData[key] = data[key];
  }
};

const open = (type) => {
  formData.engine = type;
  popupRef.value?.open();
  getDetail();
};

const handleClose = () => {
  formRef.value?.resetFields();
};

defineExpose({ open });
</script>
