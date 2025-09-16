// 时间范围类型
export const TIME_RANGE_TYPE = {
  today: 'today',
  yesterday: 'yesterday',
  beforeYesterday: 'beforeYesterday',
  seven: 'seven',
  thisMonth: 'thisMonth',
  lastMonth: 'lastMonth',
  ninetyDay: 'ninetyDay'
};

// 获取时间范围
export function getTimeRange(type, endZero = false) {
  const now = new Date();
  let start, end;

  switch (type) {
    case TIME_RANGE_TYPE.today:
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      if (endZero) end.setHours(0, 0, 0, 0);
      break;

    case TIME_RANGE_TYPE.yesterday:
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      start = new Date(yesterday);
      start.setHours(0, 0, 0, 0);
      end = new Date(yesterday);
      end.setHours(23, 59, 59, 999);
      if (endZero) end.setHours(0, 0, 0, 0);
      break;

    case TIME_RANGE_TYPE.beforeYesterday:
      const beforeYesterday = new Date(now);
      beforeYesterday.setDate(now.getDate() - 2);
      start = new Date(beforeYesterday);
      start.setHours(0, 0, 0, 0);
      end = new Date(beforeYesterday);
      end.setHours(23, 59, 59, 999);
      if (endZero) end.setHours(0, 0, 0, 0);
      break;

    case TIME_RANGE_TYPE.seven:
      const beforeSeven = new Date(now);
      beforeSeven.setDate(now.getDate() - 7);
      start = new Date(beforeSeven);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      if (endZero) end.setHours(0, 0, 0, 0);
      break;

    case TIME_RANGE_TYPE.thisMonth:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      if (endZero) end.setHours(0, 0, 0, 0);
      break;

    case TIME_RANGE_TYPE.lastMonth:
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      if (endZero) end.setHours(0, 0, 0, 0);
      break;

    case TIME_RANGE_TYPE.ninetyDay:
      const beforeNinetyDay = new Date(now);
      beforeNinetyDay.setDate(now.getDate() - 90);
      start = new Date(beforeNinetyDay);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      if (endZero) end.setHours(0, 0, 0, 0);
      break;

    default:
      throw new Error('Invalid type: 支持 today/yesterday/beforeYesterday/thisMonth/lastMonth');
  }

  return {
    start: Math.floor(start.getTime() / 1000),
    end: Math.floor(end.getTime() / 1000)
  };
}
