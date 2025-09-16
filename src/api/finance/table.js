import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNumber } from '@/tools/pipe-format';

export const financeTableLists = getRequestGet({ name: '台号列表', url: '/finance.table/lists' });

export const financeTableSet = getRequestPost({ name: '编辑台号', url: '/finance.table/set', logRefresh: true });

export const financeTableGet = getRequestGet({
  name: '获取台号',
  url: '/finance.table/get',
  pipeFormat: (data) => {
    pipeToNumber(data, ['shares_rate', 'limit_amount']);
    pipeToNumber(data.table_base_info, ['base_number']);
  }
});

export const financeTableDel = getRequestPost({ name: '删除台号', url: '/finance.table/del', logRefresh: true });

export const financeTableSetStatus = getRequestPost({ name: '设置台号状态', url: '/finance.table/setStatus', logRefresh: true });

export const financeTableSetCashStatus = getRequestPost({ name: '设置台号现金理赔', url: '/finance.table/setCashStatus', logRefresh: true });

export const financeTableIncDec = getRequestPost({ name: '台面增减码', url: '/finance.table_inc_dec/set' });

export const financeTableAmount = getRequestGet({ name: '获取台面实时余额', url: '/finance.table/getBaseUse' });

export const financeTableLastLog = getRequestGet({ name: '台号列表操作记录', url: '/finance.table/lastLog' });

export const financeTableListBonus = getRequestGet({ name: '台号绑定游戏的彩金列表', url: '/finance.table/listBonus' });

export const financeTableSetUserCabinet = getRequestPost({ name: '台面买码', url: '/finance.cabinet_chip/setUserCabinetDesk' });

export const financeTableBindDevice = getRequestPost({ name: '绑定设备', url: '/finance.table/bindDevice' });

export const financeTableUnbindDevice = getRequestPost({ name: '解绑设备', url: '/finance.table/unbindDevice' });

export const financeTableBindCamera = getRequestPost({ name: '绑定摄像头', url: '/finance.table/bindCamera' });
