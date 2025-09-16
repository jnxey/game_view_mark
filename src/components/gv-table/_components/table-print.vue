<template>
  <el-tooltip class="box-item" effect="dark" :content="$t('components.gv_table.btn_print')" placement="bottom">
    <el-button class="ml-12" circle icon="Printer" @click="printData" />
  </el-tooltip>
</template>
<script setup>
import { getPathValue, mappingArrayToObject, printElement } from '@/tools';
import { computed, inject } from 'vue';
import { getPrintTableCss, getRowContent } from '@/components/gv-table/_components/_tools';
import { $t } from '@/lang/i18n';

const formatColumns = inject('formatColumns');
const getTableData = inject('getTableData');
const getSelected = inject('getSelected');
const rowKey = inject('rowKey');

// 格式化后模板列数据
const templateFormatColumns = computed(() => {
  const list = [];
  const map = {};
  formatColumns.value.forEach((column) => {
    map[column.dataIndex] = column;
    if (column.hide) return;
    list.push(column);
  });
  return { list, map };
});

const printData = () => {
  const tableList = getTableData();
  const selected = getSelected();
  const selectedMap = {};
  selected.forEach((val) => (selectedMap[val[rowKey]] = true));
  const outList = Boolean(selected.length) ? tableList.filter((val) => selectedMap[val[rowKey]]) : tableList;
  const outMap = mappingArrayToObject(outList, rowKey);
  const showList = [];
  outList.forEach((item) => {
    const _item = { ...item };
    templateFormatColumns.value.list.forEach((role) => {
      const name = role.dataIndex;
      const cell = getPathValue(name, _item);
      if (!role) return;
      _item[name] = getRowContent(role, cell, item, false, outMap);
    });
    showList.push(_item);
  });
  let tableContent = '';
  tableContent += '<style>' + getPrintTableCss() + '</style>';
  tableContent += '<table><tr>';
  templateFormatColumns.value.list.forEach((column) => {
    tableContent += '<th>' + column.title + '</th>';
  });
  tableContent += '</tr>';
  showList.forEach((data) => {
    tableContent += '<tr>';
    templateFormatColumns.value.list.forEach((column) => {
      tableContent += '<td>' + (data[column.dataIndex] ?? '') + '</td>';
    });
    tableContent += '</tr>';
  });
  printElement(tableContent);
};
</script>
