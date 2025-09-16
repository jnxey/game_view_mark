import { $t } from '@/lang/i18n';

// 获取两次密码校验
export function useCheckSecPassword(getPassword) {
  return (rule, value, callback) => {
    const first = getPassword();
    if (first) {
      if (!value) callback(new Error($t('other.func.password2')));
      if (value !== first) callback(new Error($t('other.func.password2_check')));
    }
    callback();
  };
}
