import { ElLoading, ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { isObject } from '@/tools/index';
import { SYSTEM_PASSWORD_PATTERN } from '@/values';
import { $t } from '@/lang/i18n';

export class Layer {
  loadingInstance = null;
  static instance = null;
  static getInstance() {
    return this.instance ?? (this.instance = new Layer());
  }
  // 消息提示
  msg(msg) {
    ElMessage.info({ message: msg, ...(isObject(msg) ? msg : {}) });
  }
  // 错误消息
  msgError(msg) {
    ElMessage.error({ message: msg, ...(isObject(msg) ? msg : {}) });
  }
  // 成功消息
  msgSuccess(msg) {
    ElMessage.success({ message: msg, ...(isObject(msg) ? msg : {}) });
  }
  // 警告消息
  msgWarning(msg) {
    ElMessage.warning({ message: msg, ...(isObject(msg) ? msg : {}) });
  }
  // 弹出提示
  alert(msg) {
    ElMessageBox.alert(msg, $t('other.func.layer_title_tips'));
  }
  // 错误提示
  alertError(msg) {
    ElMessageBox.alert(msg, $t('other.func.layer_title_tips'), {
      type: 'error',
      confirmButtonText: $t('common.knew_btn'),
      confirmButtonClass: 'el-button--large is-round'
    });
  }
  // 成功提示
  alertSuccess(msg) {
    ElMessageBox.alert(msg, $t('other.func.layer_title_tips'), {
      type: 'success',
      confirmButtonText: $t('common.knew_btn'),
      confirmButtonClass: 'el-button--large is-round'
    });
  }
  // 警告提示
  alertWarning(msg) {
    ElMessageBox.alert(msg, $t('other.func.layer_title_tips'), {
      type: 'warning',
      confirmButtonText: $t('common.knew_btn'),
      confirmButtonClass: 'el-button--large is-round'
    });
  }
  // 通知提示
  notify(msg) {
    ElNotification.info(msg);
  }
  // 错误通知
  notifyError(msg) {
    ElNotification.error(msg);
  }
  // 成功通知
  notifySuccess(msg) {
    ElNotification.success(msg);
  }
  // 警告通知
  notifyWarning(msg) {
    ElNotification.warning(msg);
  }
  // 确认窗体
  confirm(msg, { title, confirmButtonText, cancelButtonText, confirmButtonClass, cancelButtonClass, type } = {}) {
    return ElMessageBox.confirm(msg, $t(title ?? 'other.func.layer_title_tips'), {
      confirmButtonText: confirmButtonText ?? $t('common.confirm_btn'),
      cancelButtonText: cancelButtonText ?? $t('common.cancel'),
      confirmButtonClass: confirmButtonClass ?? 'el-button--large is-round',
      cancelButtonClass: cancelButtonClass ?? 'el-button--large is-round',
      distinguishCancelAndClose: true,
      type: type ?? 'warning'
    });
  }
  // 提交内容
  prompt(content, title, options) {
    return ElMessageBox.prompt(content, title, {
      confirmButtonText: $t('common.confirm_btn'),
      cancelButtonText: $t('common.cancel'),
      confirmButtonClass: 'el-button--large is-round',
      cancelButtonClass: 'el-button--large is-round',
      ...options
    });
  }
  // 输入密码
  password(content, title = $t('other.func.layer_pwd_title'), options) {
    return ElMessageBox.prompt(content, title, {
      confirmButtonText: $t('common.confirm_btn'),
      cancelButtonText: $t('common.cancel'),
      confirmButtonClass: 'el-button--large is-round',
      cancelButtonClass: 'el-button--large is-round',
      inputPattern: options?.strict ? SYSTEM_PASSWORD_PATTERN : /^(?=.*\S).+$/,
      inputErrorMessage: $t('other.func.layer_pwd_error'),
      inputPlaceholder: $t('other.func.layer_pwd_input'),
      inputType: 'password',
      ...options
    });
  }
  // 打开全局loading
  loading(msg = '') {
    this.loadingInstance = ElLoading.service({
      lock: true,
      fullscreen: true,
      body: true,
      text: msg,
      customClass: msg ? 'gv-loading' : 'gv-loading gv-loading-empty'
    });
  }
  // 关闭全局loading
  closeLoading() {
    this.loadingInstance?.close();
  }
}

const layer = Layer.getInstance();

export default layer;
