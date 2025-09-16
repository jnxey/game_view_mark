<template>
  <el-form v-show="!!formData.mode" class="ls-form" ref="formRef" label-position="top" @submit.prevent>
    <el-form-item :label="$t('components.gv_input_language.code')" prop="name">
      <span class="text-placeholder">{{ formData.code }}</span>
    </el-form-item>
    <template v-for="item in languageSupport" :key="item.code">
      <el-form-item :label="item.name" :prop="item.code" class="mb-8">
        <el-input class="ls-input" v-trim v-model="formData[item.code]" clearable />
      </el-form-item>
    </template>
    <div class="pt-16">
      <el-button v-if="formData.mode === OPERATE_TYPE.update" type="success" @click="handleSelect">{{ $t('common.select') }}</el-button>
      <el-button v-if="formData.mode === OPERATE_TYPE.update" type="primary" @click="handleSubmit">{{ $t('common.save_btn') }}</el-button>
      <el-button v-if="formData.mode === OPERATE_TYPE.update" type="danger" @click="handleDelete">{{ $t('common.del_btn') }}</el-button>
      <el-button v-if="formData.mode === OPERATE_TYPE.insert" type="primary" @click="handleSubmit">{{ $t('common.add_btn') }}</el-button>
    </div>
  </el-form>
</template>
<script setup>
import { reactive, shallowRef } from 'vue';
import { OPERATE_TYPE } from '@/values';
import layer from '@/tools/layer';
import { syncObjectData } from '@/tools';
import { $t } from '@/lang/i18n';
import { languageField, languageSupport } from '@/lang';
import { toolsTranslateDel, toolsTranslateSet } from '@/api/common';
import { initInputLanguage } from '@/lang/input';

const emit = defineEmits(['success', 'close', 'selected']);
const formRef = shallowRef();

const formTemp = { mode: null, id: null, type: null, code: null };
languageSupport.forEach((item) => (formTemp[item.code] = null));
const formData = reactive({ ...formTemp });

// 设置表单
const set = async (value) => {
  syncObjectData(formData, { ...formTemp, ...value });
};

// 提交
const handleSubmit = async () => {
  const content = {};
  languageSupport.forEach((item) => (content[item.code] = formData[item.code]));
  if (!content[languageField.zhCN]) return layer.msgError($t('components.gv_input_language.tips_enter'));
  layer.loading();
  const params = { code: formData.code, type: formData.type, content: JSON.stringify(content) };
  await toolsTranslateSet(params);
  await initInputLanguage();
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  emit('success');
};

// 删除词条
const handleDelete = async () => {
  await layer.confirm($t('common.del_confirm'));
  layer.loading();
  const params = { t_id: formData.id };
  await toolsTranslateDel(params);
  await initInputLanguage();
  layer.closeLoading();
  layer.msgSuccess($t('common.del_success'));
  emit('close');
};

// 选中
const handleSelect = async () => {
  emit('selected', formData.code);
};

defineExpose({ set });
</script>
