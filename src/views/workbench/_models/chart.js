import { calcColor } from '@/tools/index.js';

const primaryColor = '#409EFF';

export const visitorOption = {
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  legend: { data: ['访问量'] },
  tooltip: { trigger: 'axis' },
  series: [
    {
      name: '访问量',
      data: [],
      type: 'line',
      smooth: true,
      color: primaryColor,
      lineStyle: { color: primaryColor, width: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: primaryColor }
          ]
        },
        opacity: 0.1
      }
    }
  ]
};

export const saleOption = {
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value', name: '单位（万）' },
  tooltip: { trigger: 'axis' },
  series: [
    {
      name: '销售量',
      data: [],
      type: 'bar',
      showBackground: true,
      backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)', borderRadius: [10, 10, 0, 0] },
      barWidth: '40%',
      itemStyle: {
        borderRadius: [10, 10, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: calcColor(primaryColor, 0.7) },
            { offset: 1, color: primaryColor }
          ]
        }
      }
    }
  ]
};
