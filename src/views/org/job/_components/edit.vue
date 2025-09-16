<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
      <el-form-item :label="$t('org.job.name')" prop="name">
        <gv-input-language
          custom-class="ls-input"
          v-model="formData.name"
          :placeholder="$t('org.job.placeholder_name')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.org_job_name"
        />
      </el-form-item>
      <el-form-item :label="$t('org.job.code')" prop="code">
        <el-input v-trim v-model="formData.code" :placeholder="$t('org.job.placeholder_code')" clearable :maxlength="100" />
      </el-form-item>
      <el-form-item :label="$t('common.sort')" prop="sort">
        <div class="flex-1 flex-col justify-start">
          <el-input-number v-model="formData.sort" :min="0" :max="Number.MAX_SAFE_INTEGER" controls-position="right" class="w-full" />
          <div class="text-tips">{{ $t('common.sort_tips') }}</div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input
          v-trim
          v-model="formData.remark"
          :placeholder="$t('common.remark_placeholder')"
          type="textarea"
          :autosize="TEXTAREA_CONFIG"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item :label="$t('common.status')" required prop="status">
        <el-switch v-model="formData.status" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { jobsAdd, jobsDetail, jobsEdit } from '@/api/org/job';
import { computed, reactive, ref, shallowRef } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import layer from '@/tools/layer';
import { GV_INPUT_LANGUAGE_TYPE, OPERATE_TYPE, STATUS_VALUE, TEXTAREA_CONFIG } from '@/values';
import { syncObjectData } from '@/tools';
import { useDelay } from '@/hooks/delay';
import { $t } from '@/lang/i18n';
import GvInputLanguage from '@/components/gv-input-language/index.vue';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);
const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('org.job.title_edit') : $t('org.job.title_add')));
const formTemp = { id: null, name: '', code: '', sort: 0, remark: '', status: STATUS_VALUE.normal };
const formData = reactive({ ...formTemp });

const formRules = {
  code: [{ required: true, message: $t('org.job.field_check_code'), trigger: ['blur'] }],
  name: [{ required: true, message: $t('org.job.field_check_name'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  mode.value = type;
  popupRef.value?.open();

  if (type === OPERATE_TYPE.update) {
    layer.loading();
    const data = await jobsDetail({ id: row.id });
    layer.closeLoading();
    syncObjectData(formData, data);
  } else {
    syncObjectData(formData, { ...formTemp, ...row });
  }
  popupRef.value?.open();
  clearValidate();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  mode.value === OPERATE_TYPE.update ? await jobsEdit(formData) : await jobsAdd(formData);
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
