<template>
  <el-tooltip class="box-item" effect="dark" :content="$t('components.gv_table.btn_export')" placement="bottom">
    <el-button class="ml-12" circle @click="exportAction">
      <template #icon><gv-icon name="local-icon-export" /></template>
    </el-button>
  </el-tooltip>
</template>
<script setup>
import { computed, inject } from 'vue';
import FileSaver from '@/tools/fileSaver';
import * as ExcelJS from 'exceljs';
import { useRoute } from 'vue-router';
import GvIcon from '@/components/gv-icon/index.vue';
import dayjs from 'dayjs';
import { getRowContent } from '@/components/gv-table/_components/_tools';
import { $t } from '@/lang/i18n';

const formatColumns = inject('formatColumns');
const getTableData = inject('getTableData');
const getSelected = inject('getSelected');
const rowKey = inject('rowKey');

const route = useRoute();

// 格式化后模板列数据
const templateFormatColumns = computed(() => {
  const list = [];
  const map = {};
  formatColumns.value.forEach((column) => {
    map[column.dataIndex] = column;
    if (column.hide) return;
    list.push({ header: column.title, key: column.dataIndex, width: 10 + (column.width || column.minWidth || 140) / 14 }); // 每个宽度为1个字符
  });
  return { list, map };
});

// 导出
const exportAction = async () => {
  const tableList = getTableData();
  const selected = getSelected();
  const selectedMap = {};
  selected.forEach((val) => (selectedMap[val[rowKey]] = true));
  const outList = Boolean(selected.length) ? tableList.filter((val) => selectedMap[val[rowKey]]) : tableList;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');
  const filename = $t(route.meta.title) + '_' + dayjs().format('YYYYMMDDHHmmss') + '.xlsx';
  const showList = [];
  outList.forEach((item) => {
    const _item = { ...item };
    Object.keys(_item).forEach((name) => {
      const cell = _item[name];
      const role = templateFormatColumns.value.map[name];
      if (!role) return;
      const content = getRowContent(role, cell, _item, true);
      if (!!role.image) {
        _item[name] = !!content ? { text: '图片地址', hyperlink: content, tooltip: '点击查看' } : '';
      } else {
        _item[name] = content;
      }
    });
    showList.push(_item);
  });
  sheet.columns = templateFormatColumns.value.list;
  sheet.addRows(showList);
  sheet.getRow(1).font = { bold: true };

  // 遍历设置颜色
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      if (cell.isHyperlink) cell.font = { color: { argb: 'ff0282ff' } };
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), filename);
};
</script>
