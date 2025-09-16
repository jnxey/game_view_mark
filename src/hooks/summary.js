import { $t } from '@/lang/i18n';

// 使用合计
export function useSummary(countField, exclude, countTitle) {
  return function (param, _, extend) {
    const { columns } = param;
    const sums = [];
    const summation = extend.summation;
    if (!summation) return [];
    columns.forEach((column, index) => {
      sums[index] = summation[column.property];
      if (exclude && exclude[column.property]) sums[index] = null;
      if (column.property === countField) sums[index] = countTitle ?? $t('other.func.count');
      if (!column.property) return (sums[index] = null);
    });
    return sums;
  };
}
