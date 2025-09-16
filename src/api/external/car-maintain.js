import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNumber } from '@/tools/pipe-format';

export const carMaintainLists = getRequestGet({
  name: '车辆保养列表',
  url: '/external.CarMaintain/lists',
  pipeFormat: (data) => pipeToNumber(data.lists, ['maintain_money'])
});

export const carMaintainSet = getRequestPost({ name: '编辑车辆保养', url: '/external.CarMaintain/set', logRefresh: true });

export const carMaintainCreate = getRequestPost({ name: '创建车辆保养', url: '/external.CarMaintain/car_maintain', logRefresh: true });

export const carMaintainLog = getRequestGet({ name: '车辆保养日志', url: '/external.CarMaintain/lastLog' });
