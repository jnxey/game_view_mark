<template>
  <div class="member-login-page member-page-wrap">
    <div class="member-login">
      <div class="title">{{ $t('views_member.member_login.title') }}</div>
      <div class="form-wrap">
        <div class="form-group v-keyboard-wrap">
          <input class="input" type="text" v-model="form.account" :placeholder="$t('views_member.member_login.account')" required />
        </div>
        <div class="form-group v-keyboard-wrap">
          <input class="input" type="password" v-model="form.password" :placeholder="$t('views_member.member_login.password')" required />
        </div>
        <div class="submit" type="submit" @click="login">{{ $t('views_member.member_login.btn_login') }}</div>
      </div>
    </div>
    <div class="extra-button flex-row align-center">
      <gv-select-language color="text-main" />
      <gv-keyboard-change color="text-main" class="ml-16" />
    </div>
  </div>
</template>
<script setup>
import { $t } from '@/lang/i18n';
import GvKeyboardChange from '@/components/gv-keyboard-change/index.vue';
import GvSelectLanguage from '@/components/gv-select-language/index.vue';
import { reactive } from 'vue';
import { RESPONSE_CODE, SYSTEM_TERMINAL } from '@/values';
import layer from '@/tools/layer';
import axios from 'axios';
import { memberApi } from '../_api';
import { toAwait } from '@/tools';
import { memberLogin } from '../_store';

const form = reactive({ account: '', password: '', scene: 1, terminal: SYSTEM_TERMINAL.member });

const login = async () => {
  if (!form.account) return layer.msgError($t('views_member.member_login.tips_account'));
  if (!form.password) return layer.msgError($t('views_member.member_login.tips_password'));
  layer.loading();
  const params = { ...form };
  const [res, err] = await toAwait(axios.post(memberApi.login.url, params));
  layer.closeLoading();
  if (err) return layer.msgError(err.message);
  if (res.data.code !== RESPONSE_CODE.SUCCESS) return layer.msgError(res.data.msg);
  memberLogin(res.data.data ?? {});
};
</script>
<style lang="scss">
@use '../_style/index.scss';
</style>
<style scoped lang="scss">
.member-login-page {
  .member-login {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    max-width: 600px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transform: translate(-50%, -50%);

    .title {
      padding: 40px 20px 20px;
      color: #2d3436;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }

    .form-wrap {
      padding: 0 20px 40px;

      .form-group {
        margin-bottom: 1.5rem;
        position: relative;

        .input {
          box-sizing: border-box;
          width: 100%;
          padding: 12px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;

          &:focus {
            outline: none;
            border-color: #74b9ff;
            box-shadow: 0 0 8px rgba(116, 185, 255, 0.2);
          }

          &::placeholder {
            color: #b2bec3;
          }
        }
      }

      .submit {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #74b9ff, #0984e3);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        transition: transform 0.2s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(116, 185, 255, 0.3);
        }
      }
    }
  }

  .extra-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px 15px 0 0;
    text-align: right;
    z-index: 10;
  }
}
</style>
