<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-title fz-24 fw-bold color-white flex-row align-center">
        <el-avatar class="mr-8" :size="32" :src="systemState.config.web_logo" />
        <span>{{ systemState.config.web_name ?? $t('login.box_title') }}</span>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item prop="account">
          <el-input class="v-keyboard-wrap" v-trim v-model="form.account" size="large" :placeholder="$t('login.placeholder_account')">
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
            :placeholder="$t('login.placeholder_password')"
          >
            <template #prefix><gv-icon name="el-icon-Key" class="pre-icon fz-16" /></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" size="large" class="w-full" :loading="loading" @click="handleSubmit">{{ $t('login.login_btn') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-img" v-if="!!systemState.config.login_image">
      <img :src="systemState.config.login_image" alt="" />
    </div>
    <div class="extra-button flex-row align-center">
      <gv-select-language />
      <gv-keyboard-change class="ml-16" />
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { toAwait } from '@/tools/index.js';
import { SYSTEM_TERMINAL } from '@/values';
import { login } from '@/api/common.js';
import { useRoute, useRouter } from 'vue-router';
import { setManageToken } from '@/store/manager.js';
import layer from '@/tools/layer';
import GvIcon from '@/components/gv-icon/index.vue';
import { systemState } from '@/store/system';
import { ENV_MAP, getEnvConfig, getEnvDevice, getEnvMacAddress, getEnv } from '@/config/env';
import { financeTableBindDevice } from '@/api/finance/table';
import { $t } from '@/lang/i18n';
import { config } from '@/config';
import GvKeyboardChange from '@/components/gv-keyboard-change/index.vue';
import GvSelectLanguage from '@/components/gv-select-language/index.vue';

const loading = ref(false);
const route = useRoute();
const router = useRouter();
const formRef = ref();
const form = reactive({ account: 'admin', password: 'admin', terminal: SYSTEM_TERMINAL.terminal });

const rules = {
  account: [{ required: true, message: $t('login.field_check_account') }],
  password: [{ required: true, message: $t('login.field_check_password') }]
};

// 正常登录跳转
const normalLogin = (token) => {
  setManageToken(token);
  const redirect = route.query.redirect;
  router.push(redirect || '/');
  layer.msgSuccess($t('login.login_success'));
};

// 登录跳转现场录入
const sceneLogin = (token, tableId, tableName) => {
  setManageToken(token);
  router.push({ path: config.route.sceneEnter, query: { id: tableId, name: tableName } });
  layer.msgSuccess($t('login.login_success'));
};

const handleSubmit = async () => {
  if (!formRef) return;
  await formRef.value.validate();
  const data = { ...form };
  loading.value = true;
  const [res, err] = await toAwait(login(data));
  loading.value = false;
  if (err) return;
  if (getEnv() === ENV_MAP.terminal) {
    const config = await getEnvConfig();
    if (!config.table_id) {
      normalLogin(res.token);
    } else if (!!config.table_id) {
      const device = await getEnvDevice();
      const mac = await getEnvMacAddress();
      const mark = `${device.hostname}_${mac}`;
      const info = await financeTableBindDevice({ id: config.table_id, verify: 1, device_number: mark, terminal_type: SYSTEM_TERMINAL.terminal });
      if (info.device_number === mark) {
        sceneLogin(res.token, config.table_id, config.table_name);
      } else if (!info.device_number) {
        await financeTableBindDevice({
          id: config.table_id,
          device_number: mark,
          terminal_type: SYSTEM_TERMINAL.terminal
        });
        sceneLogin(res.token, config.table_id, config.table_name);
      } else if (info.device_number !== mark) {
        layer.msgError($t('login.tips_bind'));
      }
    }
  } else {
    normalLogin(res.token);
  }
};
</script>
<style scoped lang="scss">
$login-bg-color: #212141;

.login-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: $login-bg-color;

  .bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 5;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.7);
      background-color: $login-bg-color;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        background: $login-bg-color;
      }
    }
  }

  .extra-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px 15px 0 0;
    text-align: right;
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 10px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .login-box {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    min-width: 300px;
    max-width: 500px;
    padding: var(--el-border-radius-round);
    transform: translate(-50%, -50%);
    box-shadow: var(--el-box-shadow-light);
    z-index: 10;

    ::v-deep(.el-input) {
      --el-input-bg-color: transparent;

      .el-input__inner,
      .pre-icon,
      .el-input__password {
        color: var(--el-primary-text-color);
      }
    }

    .login-title {
      margin-bottom: 20px;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: var(--el-border-radius-round);
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      z-index: -1;
    }
  }
}
</style>
