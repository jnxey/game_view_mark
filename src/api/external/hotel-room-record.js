import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNumber } from '@/tools/pipe-format';

export const hotelRoomRecordLists = getRequestGet({
  name: '列表',
  url: '/external.HotelRoomRecord/lists',
  pipeFormat: (data) => pipeToNumber(data.lists, ['room_rates_true', 'deposit'])
});

export const hotelRoomRecordSet = getRequestPost({ name: '编辑', url: '/external.HotelRoomRecord/set', logRefresh: true });

export const hotelRoomRecordDel = getRequestPost({ name: '删除', url: '/external.HotelRoomRecord/del', logRefresh: true });

export const hotelRoomRecordLog = getRequestGet({ name: '日志', url: '/external.HotelRoomRecord/lastLog' });
