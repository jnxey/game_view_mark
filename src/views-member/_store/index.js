import { reactive, ref } from 'vue';

// 步骤
export const STEP_MAP = { login: 1, menu: 2, betList: 3 };

// 步骤-当前
export const memberStep = ref(STEP_MAP.login);

// 会员信息
export const memberInfo = reactive({});

// 登录
export const memberLogin = (info) => {
  memberInfo.avatar = info.avatar;
  memberInfo.nickname = info.nickname;
  memberInfo.token = info.token;
  memberInfo.username = info.username;
  memberStep.value = STEP_MAP.menu;
};

// 登出
export const memberLogout = () => {
  memberInfo.avatar = null;
  memberInfo.nickname = null;
  memberInfo.token = null;
  memberInfo.username = null;
  memberStep.value = STEP_MAP.login;
};

// 前往查看注单信息
export const memberBetList = () => {
  memberStep.value = STEP_MAP.betList;
};

// 前往菜单页
export const memberMenu = () => {
  memberStep.value = STEP_MAP.menu;
};
