import { getRequestGet, getRequestPost } from '@/tools/request';

export const hotelRoomTypeLists = getRequestGet({ name: '房间类型列表', url: '/external.HotelRoomType/lists' });

export const hotelRoomTypeSet = getRequestPost({ name: '编辑房间类型', url: '/external.HotelRoomType/set', logRefresh: true });

export const hotelRoomTypeDel = getRequestPost({ name: '删除房间类型', url: '/external.HotelRoomType/del', logRefresh: true });

export const hotelRoomTypeLog = getRequestGet({ name: '房间类型日志', url: '/external.HotelRoomType/lastLog' });
