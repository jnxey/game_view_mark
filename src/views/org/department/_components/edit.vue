<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
      <el-form-item :label="$t('org.department.parent')" prop="pid" v-if="formData.pid !== SYSTEM_PARENT_TOP">
        <el-tree-select
          class="flex-1"
          v-model="formData.pid"
          :data="optionsData.dept"
          clearable
          node-key="id"
          :props="{ value: 'id', label: 'name' }"
          check-strictly
          :default-expand-all="true"
          :placeholder="$t('org.department.placeholder_parent')"
        >
          <template #label="{ label }">
            <span>{{ $ti(label) }}</span>
          </template>
          <template #default="{ node }">
            <span>{{ $ti(node.label) }}</span>
          </template>
        </el-tree-select>
      </el-form-item>
      <el-form-item :label="$t('org.department.name')" prop="name">
        <gv-input-language
          custom-class="ls-input"
          v-model="formData.name"
          :placeholder="$t('org.department.placeholder_name')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.org_department_name"
        />
      </el-form-item>
      <el-form-item :label="$t('org.department.leader')" prop="leader">
        <el-input v-trim v-model="formData.leader" :placeholder="$t('org.department.placeholder_leader')" :maxlength="30" clearable />
      </el-form-item>
      <el-form-item :label="$t('org.department.mobile')" prop="mobile">
        <el-input v-trim v-model="formData.mobile" :placeholder="$t('org.department.placeholder_mobile')" clearable />
      </el-form-item>
      <el-form-item :label="$t('common.sort')" prop="sort">
        <div class="flex-1 flex-col justify-start">
          <el-input-number v-model="formData.sort" :min="0" :max="Number.MAX_SAFE_INTEGER" controls-position="right" class="w-full" />
          <div class="text-tips">{{ $t('common.sort_tips') }}</div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('common.status')">
        <el-switch v-model="formData.status" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { deptAdd, deptAll, deptDetail, deptEdit } from '@/api/org/department';
import { useDictOptions } from '@/hooks/dict';
import { computed, reactive, ref, shallowRef } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import layer from '@/tools/layer';
import { GV_INPUT_LANGUAGE_TYPE, OPERATE_TYPE, STATUS_VALUE, SYSTEM_PARENT_TOP } from '@/values';
import { syncObjectData } from '@/tools';
import { useDelay } from '@/hooks/delay';
import { $t } from '@/lang/i18n';
import GvInputLanguage from '@/components/gv-input-language/index.vue';
import { $ti } from '@/lang/input';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);
const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('org.department.title_edit') : $t('org.department.title_add')));
const formTemp = { id: null, pid: null, name: '', leader: '', mobile: '', sort: 0, status: STATUS_VALUE.normal };
const formData = reactive({ ...formTemp });

const formRules = {
  pid: [{ required: true, message: $t('org.department.field_check_parent'), trigger: ['change'] }],
  name: [{ required: true, message: $t('org.department.field_check_name'), trigger: ['blur'] }],
  mobile: [{ required: true, message: $t('org.department.field_check_mobile'), trigger: ['blur'] }]
};

const { optionsData, refresh } = useDictOptions({ dept: { api: deptAll } }, true);

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  refresh();
  mode.value = type;
  if (type === OPERATE_TYPE.update) {
    layer.loading();
    const data = await deptDetail({ id: row.id });
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
  mode.value === OPERATE_TYPE.update ? await deptEdit(formData) : await deptAdd(formData);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => emit('close');

defineExpose({ open });
</script>
