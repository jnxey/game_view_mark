<template>
  <gv-popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="120px" :rules="formRules">
      <!-- 管理员头像 -->
      <el-form-item :label="$t('staff.admin.avatar')">
        <gv-material-picker custom-class="w-full" v-model="formData.avatar" :limit="6" />
        <div class="text-tips">{{ $t('staff.admin.tips_avatar') }}</div>
      </el-form-item>
      <!-- 账号输入框 -->
      <el-form-item :label="$t('staff.admin.account')" prop="account">
        <el-input
          v-trim
          v-model="formData.account"
          :disabled="formData.root === SYSTEM_SUPER_ROOT"
          :placeholder="$t('staff.admin.placeholder_account')"
          clearable
        />
      </el-form-item>
      <!-- 名称输入框 -->
      <el-form-item :label="$t('staff.admin.name')" prop="name">
        <el-input v-trim v-model="formData.name" :placeholder="$t('staff.admin.placeholder_name')" clearable />
      </el-form-item>
      <!--  性别   -->
      <el-form-item :label="$t('staff.admin.gender')" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio class="custom-radio" v-for="item in SEX_VALUE_DICT" :value="item.value">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 介绍人 -->
      <el-form-item :label="$t('staff.admin.referrer')" prop="referrer">
        <el-input v-trim v-model="formData.referrer" :placeholder="$t('staff.admin.placeholder_referrer')" clearable />
      </el-form-item>
      <!-- 入职时间 -->
      <el-form-item :label="$t('staff.admin.time_joining')" prop="time_joining">
        <gv-date-picker v-model="formData.time_joining" class="flex-1" type="date" :placeholder="$t('common.time_select')" />
      </el-form-item>
      <!-- 生日 -->
      <el-form-item :label="$t('staff.admin.birthday')" prop="birthday">
        <el-date-picker
          v-model="formData.birthday"
          class="flex-1"
          type="date"
          :value-format="getTimeFormat('day')"
          :placeholder="$t('common.time_select')"
        />
      </el-form-item>
      <!--   联系方式   -->
      <el-form-item :label="$t('staff.admin.contact')" prop="contact">
        <el-input v-trim v-model="formData.contact" :placeholder="$t('staff.admin.placeholder_contact')" clearable />
      </el-form-item>
      <!-- 教育背景 -->
      <el-form-item :label="$t('staff.admin.education')" prop="education">
        <gv-input-language
          v-model="formData.education"
          :placeholder="$t('staff.admin.placeholder_education')"
          clearable
          :type="GV_INPUT_LANGUAGE_TYPE.staff_admin_education"
        />
      </el-form-item>
      <!--   部门   -->
      <el-form-item :label="$t('staff.admin.dept_name')" prop="dept_id">
        <el-tree-select
          class="flex-1"
          v-model="formData.dept_id"
          :data="optionsData.dept"
          clearable
          multiple
          node-key="id"
          :props="{ value: 'id', label: 'name' }"
          check-strictly
          :default-expand-all="true"
          :placeholder="$t('staff.admin.placeholder_dept')"
        >
          <template #label="{ label }">
            <span>{{ $ti(label) }}</span>
          </template>
          <template #default="{ node }">
            <span>{{ $ti(node.label) }}</span>
          </template>
        </el-tree-select>
      </el-form-item>
      <!--   岗位   -->
      <el-form-item :label="$t('staff.admin.jobs_name')" prop="jobs_id">
        <el-select class="flex-1" v-model="formData.jobs_id" clearable multiple :placeholder="$t('staff.admin.placeholder_jobs')">
          <el-option v-for="(item, index) in optionsData.jobs" :key="index" :label="$ti(item.name)" :value="item.id" />
        </el-select>
      </el-form-item>
      <!-- 角色选择框 -->
      <el-form-item :label="$t('staff.admin.role_name')" prop="role_id" v-if="formData.root !== SYSTEM_SUPER_ROOT">
        <el-select
          v-model="formData.role_id"
          :disabled="formData.root === SYSTEM_SUPER_ROOT"
          class="flex-1"
          multiple
          :placeholder="$t('staff.admin.placeholder_role')"
          clearable
        >
          <el-option v-for="(item, index) in optionsData.role" :key="index" :label="$ti(item.name)" :value="item.id" />
        </el-select>
      </el-form-item>
      <template v-if="mode === OPERATE_TYPE.insert">
        <!-- 密码输入框 -->
        <el-form-item :label="$t('staff.admin.password')" prop="password">
          <el-input v-model="formData.password" show-password :placeholder="$t('staff.admin.placeholder_password')" />
        </el-form-item>
        <!-- 确认密码输入框 -->
        <el-form-item :label="$t('staff.admin.password_confirm')" prop="password_confirm">
          <el-input v-model="formData.password_confirm" show-password :placeholder="$t('staff.admin.placeholder_password_confirm')" />
        </el-form-item>
      </template>
      <!-- 管理员状态 -->
      <el-form-item :label="$t('staff.admin.disabled')" v-if="formData.root !== SYSTEM_SUPER_ROOT">
        <el-switch v-model="formData.disable" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disable" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import { adminAdd, adminDetail, adminEdit } from '@/api/staff/admin';
import { roleAll } from '@/api/perms/role';
import { useDictOptions } from '@/hooks/dict';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import {
  LOGIN_MUTI_VALUE,
  OPERATE_TYPE,
  SYSTEM_SUPER_ROOT,
  STATUS_VALUE,
  SYSTEM_PASSWORD_PATTERN,
  SEX_VALUE_DICT,
  GV_INPUT_LANGUAGE_TYPE
} from '@/values';
import GvPopup from '@/components/gv-popup/index.vue';
import layer from '@/tools/layer';
import { adminFormTemp } from '@/views/staff/admin/_model';
import { useCheckSecPassword } from '@/hooks/password';
import { getJSON, getTimeFormat, syncObjectData } from '@/tools';
import { useDelay } from '@/hooks/delay';
import { jobsAll } from '@/api/org/job';
import { deptAll } from '@/api/org/department';
import { useDefCarType } from '@/hooks/input-memory';
import GvInputMemory from '@/components/gv-input-memory/index.vue';
import { $t } from '@/lang/i18n';
import GvDatePicker from '@/components/gv-date-picker/index.vue';
import GvInputLanguage from '@/components/gv-input-language/index.vue';
import { $ti } from '@/lang/input';

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);
const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('staff.admin.title_edit') : $t('staff.admin.title_add')));

const formData = reactive({ ...adminFormTemp });

// 校验二次密码
const passwordConfirmValidator = useCheckSecPassword(() => formData.password);

// 权限校验
const roleIdValidator = (rule, value, callback) => {
  callback(formData.root || formData.role_id.length ? undefined : new Error($t('staff.admin.field_check_role')));
};
const formRules = reactive({
  account: [{ required: true, message: $t('staff.admin.field_check_account'), trigger: ['blur'] }],
  name: [{ required: true, message: $t('staff.admin.field_check_name'), trigger: ['blur'] }],
  role_id: [{ required: true, validator: roleIdValidator }],
  password: [{ required: true, pattern: SYSTEM_PASSWORD_PATTERN, message: $t('staff.admin.field_check_password'), trigger: ['blur'] }],
  password_confirm: [{ validator: passwordConfirmValidator, trigger: 'blur' }]
});

const { optionsData, refresh } = useDictOptions(
  {
    role: { api: roleAll },
    jobs: { api: jobsAll },
    dept: { api: deptAll }
  },
  true
);

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const open = async (type, row) => {
  refresh();
  mode.value = type;
  if (type === OPERATE_TYPE.update) {
    layer.loading();
    const data = await adminDetail({ id: row.id });
    layer.closeLoading();
    syncObjectData(formData, { ...data, avatar: getJSON(data.avatar, []) });
  } else {
    syncObjectData(formData, { ...adminFormTemp, ...row, avatar: getJSON(row?.avatar, []) });
    formData.avatar = getJSON(formData.avatar, []);
  }
  popupRef.value?.open();
  clearValidate();
};

// 提交代码
const handleSubmit = async () => {
  await formRef.value?.validate();
  const params = { ...formData, avatar: JSON.stringify(formData.avatar) };
  layer.loading();
  mode.value === OPERATE_TYPE.update ? await adminEdit(params) : await adminAdd(params);
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
