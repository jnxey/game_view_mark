<!-- 个人资料 -->
<template>
  <div class="user-setting">
    <el-card class="!border-none" shadow="never">
      <el-form ref="formRef" class="ls-form" :model="formData" :rules="rules" label-width="100px">
        <el-form-item :label="$t('account.avatar')" prop="avatar">
          <gv-material-picker v-model="formData.avatar" :limit="6" />
        </el-form-item>
        <el-form-item :label="$t('account.account')" prop="account">
          <div class="w-280">
            <el-input v-trim v-model="formData.account" disabled />
          </div>
        </el-form-item>
        <el-form-item :label="$t('account.name')" prop="name">
          <div class="w-280">
            <el-input v-trim v-model="formData.name" :placeholder="$t('account.placeholder_name')" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('account.password_old')" prop="password_old">
          <div class="w-280">
            <el-input v-trim v-model="formData.password_old" :placeholder="$t('account.placeholder_password')" type="password" show-password />
          </div>
        </el-form-item>
        <el-form-item :label="$t('account.password')" prop="password">
          <div class="w-280">
            <el-input v-trim v-model="formData.password" :placeholder="$t('account.placeholder_password')" type="password" show-password />
          </div>
        </el-form-item>

        <el-form-item :label="$t('account.password_confirm')" prop="password_confirm">
          <div class="w-280">
            <el-input v-trim v-model="formData.password_confirm" :placeholder="$t('account.placeholder_password')" type="password" show-password />
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <gv-footer>
      <el-button type="primary" @click="handleSubmit">{{ $t('common.save_btn') }}</el-button>
    </gv-footer>
  </div>
</template>

<script setup>
import { setUserInfo } from '@/api/common.js';
import GvMaterialPicker from '@/components/gv-material/picker.vue';
import GvFooter from '@/components/gv-footer/index.vue';
import { onBeforeMount, reactive, ref } from 'vue';
import layer from '@/tools/layer';
import { managerState, syncManageUser } from '@/store/manager';
import { getJSON, syncObjectData } from '@/tools';
import { $t } from '@/lang/i18n';

const formRef = ref();

// 表单数据
const formData = reactive({
  avatar: '', // 头像
  account: '', // 账号
  name: '', // 名称
  password_old: '', // 当前密码
  password: '', // 新的密码
  password_confirm: '' // 确定密码
});

// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: $t('account.field_check_name'), trigger: ['blur'] }]
});

// 获取个人设置
const getUser = async () => {
  const userInfo = managerState.user;
  syncObjectData(formData, { ...userInfo, avatar: getJSON(userInfo.avatar, []) });
};

// 设置个人设置
const setUser = async () => {
  if (formData.password_old || formData.password || formData.password_confirm) {
    if (!formData.password_old) {
      return layer.msgError($t('account.field_check_password_old'));
    }

    if (!formData.password) {
      return layer.msgError($t('account.field_check_password'));
    }

    if (!formData.password_confirm) {
      return layer.msgError($t('account.field_check_password_confirm'));
    }

    if (formData.password_confirm !== formData.password) {
      return layer.msgError($t('account.field_check_password_compare'));
    }
  }

  if (formData.password_old && formData.password && formData.password_confirm) {
    if (formData.password_old.length < 6 || formData.password_old.length > 32) {
      return layer.msgError($t('account.field_check_password_length'));
    }
    if (formData.password.length < 6 || formData.password.length > 32) {
      return layer.msgError($t('account.field_check_password_length'));
    }
    if (formData.password_confirm.length < 6 || formData.password_confirm.length > 32) {
      return layer.msgError($t('account.field_check_password_length'));
    }
  }
  const params = { ...formData, avatar: JSON.stringify(formData.avatar) };
  layer.loading();
  await setUserInfo(params);
  await syncManageUser();
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
};

// 提交数据
const handleSubmit = async () => {
  await formRef.value?.validate();
  setUser();
};

onBeforeMount(() => {
  getUser();
});
</script>

<style lang="scss" scoped></style>
