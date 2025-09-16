<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="100px">
      <el-form-item :label="$t('perms.role.name')" prop="name">
        <gv-input-language
          custom-class="ls-input"
          v-model="formData.name"
          :placeholder="$t('perms.role.placeholder_name')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.perms_role_name"
        />
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="desc">
        <el-input
          v-trim
          v-model="formData.desc"
          type="textarea"
          :autosize="TEXTAREA_CONFIG"
          :placeholder="$t('common.remark_placeholder')"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item :label="$t('common.sort')" prop="sort">
        <div class="flex-1 flex-col justify-start">
          <el-input-number v-model="formData.sort" :min="0" :max="Number.MAX_SAFE_INTEGER" controls-position="right" class="w-full" />
          <div class="text-tips">{{ $t('common.sort_tips') }}</div>
        </div>
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { roleAdd, roleEdit } from '@/api/perms/role';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import { GV_INPUT_LANGUAGE_TYPE, OPERATE_TYPE, TEXTAREA_CONFIG } from '@/values';
import layer from '@/tools/layer';
import { syncObjectData } from '@/tools';
import { useDelay } from '@/hooks/delay';
import { $t } from '@/lang/i18n';
import GvInputLanguage from '@/components/gv-input-language/index.vue';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('perms.role.title_edit') : $t('perms.role.title_add')));

const formTemp = { id: null, name: '', desc: '', sort: 0, menu_id: [] };
const formData = reactive({ ...formTemp });

const rules = {
  name: [{ required: true, message: $t('perms.role.field_check_name'), trigger: ['blur'] }]
};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, row);
  else syncObjectData(formData, { ...formTemp });
  popupRef.value?.open();
  clearValidate();
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  layer.loading();
  mode.value === OPERATE_TYPE.update ? await roleEdit(formData) : await roleAdd(formData);
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
