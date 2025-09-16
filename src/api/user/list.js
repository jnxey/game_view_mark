import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNull, pipeToNumber } from '@/tools/pipe-format';

export const userLists = getRequestGet({ name: '用户列表', url: '/user.user/lists' });

export const userListsBase = getRequestGet({ name: '用户列表简写', url: '/user.user/baseInfoLists' });

export const userSet = getRequestPost({ name: '设置用户', url: '/user.user/set', logRefresh: true, noFilterNull: ['user_type_id', 'level_id'] });

export const userDelete = getRequestPost({ name: '删除用户', url: '/user.user/delete', logRefresh: true });

export const userDetail = getRequestGet({
  name: '用户详情',
  url: '/user.user/detail',
  pipeFormat: (data) => {
    pipeToNull(data, { user_type_id: 0, level_id: 0 });
    pipeToNumber(data.deposit, ['deposit']);
    pipeToNumber(data.buka, ['fee']);
    pipeToNumber(data.washing, ['rate']);
    pipeToNumber(data.shares, ['rate']);
    pipeToNumber(data.rebateLimit, ['rate']);
    pipeToNumber(data.integral, ['rate']);
    pipeToNumber(data.volume, ['max', 'min', 'rebate']);
  }
});

export const userUsername = getRequestGet({ name: '用户详情，根据username', url: '/user.user/getUserID' });

export const userDimension = getRequestGet({ name: '获取维度信息', url: '/user.user/dimension' });

export const userSwitchButton = getRequestPost({ name: '修改各种状态', url: '/user.user/switchButton', logRefresh: true });

export const userCheckRepeat = getRequestPost({ name: '检查会员号', url: '/user.user/checkRepeat' });

export const userEditAttr = getRequestPost({ name: '编辑用户其他配置', url: '/user.user/editAttr', logRefresh: true });

export const userAllUser = getRequestPost({ name: '获取所有用户', url: '/user.user/getAllUser' });

export const userGetAgentMove = getRequestPost({ name: '获取代理整体移动', url: '/user.user/getAgentMove', logRefresh: true });

export const userSetAgentMove = getRequestPost({ name: '设置代理整体移动', url: '/user.user/setAgentMove', logRefresh: true });

export const userSetBatchPid = getRequestPost({ name: '设置变更上级', url: '/user.user/setBatchPid', logRefresh: true });

export const userSetPassword = getRequestPost({ name: '修改用户密码', url: '/user.user/setPassword', logRefresh: true });

export const userLastLog = getRequestGet({ name: '用户列表操作记录', url: 'user.user/lastLog' });
