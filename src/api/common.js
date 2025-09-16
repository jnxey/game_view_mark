import { getRequestGet, getRequestPost } from '@/tools/request';

export const getConfig = getRequestGet({ name: '配置', url: '/config/getConfig' });

export const getWorkbench = getRequestGet({ name: '数据看板主页', url: '/report.dashboard/lists' });

export const getDictData = getRequestGet({ name: '字典数据', url: '/config/dict' });

export const login = getRequestPost({ name: '登录', url: '/login/account' });

export const logout = getRequestPost({ name: '退出登录', url: '/login/logout' });

export const getUserInfo = getRequestGet({ name: '用户信息', url: '/auth.admin/mySelf' });

export const setUserInfo = getRequestPost({ name: '编辑自己的信息', url: '/auth.admin/editSelf' });

export const toolsTranslateList = getRequestGet({ name: '获取国际化词条列表', url: '/tools.generator/translateNoteList' });

export const toolsTranslateSet = getRequestPost({ name: '设置国际化词条列表', url: '/tools.generator/opTranslateNote' });

export const toolsTranslateDel = getRequestPost({ name: '删除国际化词条列表', url: '/tools.generator/delTranslateNote' });

export const toolsPushMessage = getRequestPost({ name: '推送消息', url: '/tools.generator/pushMessage' });

export const toolsChatSendMessage = getRequestPost({ name: '聊天发送消息', url: '/tools.chat/sendMessage' });

export const toolsChatGetHistory = getRequestGet({ name: '聊天拉取消息', url: '/tools.chat/getHistory' });

export const toolsChatDeleteMessage = getRequestGet({ name: '聊天删除消息', url: '/tools.chat/deleteMessage' });

export const toolsChatGetPinnedMessage = getRequestGet({ name: '获取置顶聊天消息', url: '/tools.chat/getPinnedMessages' });

export const toolsChatPinnedMessage = getRequestPost({ name: '置顶聊天消息', url: '/tools.chat/pinMessage' });

export const toolsChatUnpinnedMessage = getRequestPost({ name: '取消置顶聊天消息', url: '/tools.chat/unpinMessage' });
