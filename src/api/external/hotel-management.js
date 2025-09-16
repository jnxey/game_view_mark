import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNumber } from '@/tools/pipe-format';

export const hotelManagementLists = getRequestGet({
  name: '酒店管理列表',
  url: '/external.HotelManagement/lists',
  pipeFormat: (data) => pipeToNumber(data.lists, ['room_rates'])
});

export const hotelManagementSet = getRequestPost({ name: '编辑酒店管理', url: '/external.HotelManagement/set', logRefresh: true });

export const hotelManagementDel = getRequestPost({ name: '删除酒店管理', url: '/external.HotelManagement/del', logRefresh: true });

export const hotelManagementCheckIn = getRequestPost({ name: '开房', url: '/external.HotelManagement/CheckIn', logRefresh: true });

export const hotelManagementCheckOut = getRequestPost({ name: '退房', url: '/external.HotelManagement/CheckOut', logRefresh: true });

export const hotelManagementCheckContinue = getRequestPost({ name: '续费', url: '/external.HotelManagement/CheckContinue', logRefresh: true });

export const hotelManagementLog = getRequestGet({ name: '酒店管理操作记录', url: '/external.HotelManagement/lastLog' });
