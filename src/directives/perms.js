import { managerState } from '@/store/manager.js';

/**
 * perm 操作权限处理
 * 指令用法：
 *  <el-button v-perms="['auth.menu/edit']">编辑</el-button>
 */

export default {
  mounted: (el, binding) => {
    const { value } = binding;
    const permissions = managerState.permissions || [];
    const all_permission = '*';
    if (Array.isArray(value)) {
      if (value.length > 0) {
        const hasPermission = permissions.some((key) => {
          return all_permission === key || value.includes(key);
        });

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    } else {
      throw new Error('like v-perms="[\'auth.menu/edit\']"');
    }
  }
};

export function checkPerm(list) {
  const permissions = managerState.permissions || [];
  const all_permission = '*';
  let valid = true;
  if (list.length > 0) {
    const hasPermission = permissions.some((key) => {
      return all_permission === key || list.includes(key);
    });
    if (!hasPermission) valid = false;
  }
  return valid;
}
