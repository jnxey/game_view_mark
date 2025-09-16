import { computed, ref } from 'vue';
import { getTimeRange, TIME_RANGE_TYPE } from '@/tools/date';
import { getTimeFormat } from '@/tools';

export const rangeTimeType = { create_time: 'create_time', close_time: 'close_time' };
export const closeTodayValue = 0; // 今日收码时间值

const _getRangeType = (type) => {
  return {
    type: type === rangeTimeType.close_time ? 'daterange' : 'datetimerange',
    format: type === rangeTimeType.close_time ? getTimeFormat('day') : getTimeFormat()
  };
};

// 使用时间范围查询
export function useTimeRange(getTableRef, options, closeSet = false) {
  const _options = { ...{ start: 'time_start', end: 'time_end', defActive: undefined, defFilterTime: rangeTimeType.close_time }, ...options };
  const defRangeType = _getRangeType(_options.defFilterTime);
  const timeRangeActive = ref(_options.defActive);
  const dateRangeType = ref(defRangeType.type);
  const dateRangeFormat = ref(defRangeType.format);

  const showTimeRange = computed(() => {
    return !(dateRangeType.value === 'daterange' && timeRangeActive.value === TIME_RANGE_TYPE.today);
  });

  const getDefaultQuery = () => {
    const isTodayClose = closeSet && _options.defActive === TIME_RANGE_TYPE.today && _options.defFilterTime === rangeTimeType.close_time;
    const defTime = getTimeRange(_options.defActive);
    return {
      filter_time: _options.defFilterTime,
      [_options.start]: isTodayClose ? closeTodayValue : defTime.start,
      [_options.end]: isTodayClose ? closeTodayValue : defTime.end
    };
  };

  const setDateRangeType = (noRefresh = false) => {
    const table = getTableRef();
    const { filter_time } = table.getQuery();
    const rangeType = _getRangeType(filter_time);
    dateRangeType.value = rangeType.type;
    dateRangeFormat.value = rangeType.format;
    if (noRefresh !== false) {
      timeRangeActive.value = _options.defActive;
      setTimeRange();
    }
  };

  const setTimeRange = () => {
    const type = timeRangeActive.value;
    const table = getTableRef();
    const { filter_time } = table.getQuery();
    const today = type === TIME_RANGE_TYPE.today && filter_time === rangeTimeType.close_time;

    if (!!type) {
      const range = getTimeRange(type);
      table?.setQuery(_options.start, range.start);
      table?.setQuery(_options.end, range.end);
    }
    if (closeSet && !!type && today) {
      table?.setQuery(_options.start, closeTodayValue);
      table?.setQuery(_options.end, closeTodayValue);
    }
  };

  const clearTimeRangeActive = () => {
    timeRangeActive.value = null;
  };

  const resetTimeRangeActive = () => {
    timeRangeActive.value = _options.defActive;
    setDateRangeType(false);
  };

  const doubleExec = (fn1, fn2) => {
    fn1();
    fn2();
  };

  return {
    timeRangeActive,
    dateRangeType,
    dateRangeFormat,
    showTimeRange,
    setTimeRange,
    setDateRangeType,
    getDefaultQuery,
    clearTimeRangeActive,
    resetTimeRangeActive,
    doubleExec
  };
}
