<template>
  <gv-popup ref="popupRef" :title="$t('components.gv_account_change.title')" width="450px" :show-footer="false">
    <div class="gv-account-change">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item prop="account">
          <el-input
            class="v-keyboard-wrap"
            v-trim
            v-model="form.account"
            size="large"
            :placeholder="$t('components.gv_account_change.placeholder_account')"
          >
            <template #prefix><gv-icon name="el-icon-User" class="pre-icon fz-16" /></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="v-keyboard-wrap"
            v-trim
            v-model="form.password"
            size="large"
            show-password
            type="password"
            :placeholder="$t('components.gv_account_change.placeholder_password')"
          >
            <template #prefix><gv-icon name="el-icon-Key" class="pre-icon fz-16" /></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="w-full" :loading="loading" @click="handleSubmit">
            {{ $t('components.gv_account_change.btn_confirm_change') }}
          </el-button>
          <div class="w-full flex-row justify-end pt-16">
            <span class="link" @click="toLogout">{{ $t('components.gv_account_change.btn_confirm_logout') }}</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </gv-popup>
</template>
<script>
export default { name: 'gv-account-change' };
</script>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { reactive, ref, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SYSTEM_TERMINAL } from '@/values';
import { delayExec, pageReload, toAwait } from '@/tools';
import { login, logout } from '@/api/common';
import { clearManageToken, setManageToken } from '@/store/manager';
import layer from '@/tools/layer';
import GvIcon from '@/components/gv-icon/index.vue';
import { config } from '@/config';
import { $t } from '@/lang/i18n';

const popupRef = shallowRef();
const loading = ref(false);
const router = useRouter();
const formRef = ref();
const form = reactive({ account: '', password: '', terminal: SYSTEM_TERMINAL.terminal });

const rules = {
  account: [{ required: true, message: $t('components.gv_account_change.placeholder_account') }],
  password: [{ required: true, message: $t('components.gv_account_change.placeholder_password') }]
};

const open = async () => {
  popupRef.value?.open();
};

const handleSubmit = async () => {
  if (!formRef) return;
  await formRef.value.validate();
  const data = { ...form };
  loading.value = true;
  const [res, err] = await toAwait(login(data));
  loading.value = false;
  if (err) return;
  setManageToken(res.token);
  layer.msgSuccess($t('components.gv_account_change.tips_change_success'));
  await delayExec(500);
  pageReload();
};

const toLogout = async () => {
  await layer.confirm($t('components.gv_account_change.tips_confirm_logout'));
  await logout();
  clearManageToken();
  router.push(config.route.loginPath);
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.gv-account-change {
}
</style>
