import dayjs from 'dayjs';
import { formatServerTime, getAlbumDef, getTimeFormat, getUrlAndOrigin, isString } from '@/tools';
import { $ti } from '@/lang/input';

// 获取导出要显示的内容
export function getRowContent(role, cell, row, imageLink, listMap) {
  if (role.dict) {
    return $ti(role.dict[cell]?.name ?? cell);
  } else if (role.dictSelf) {
    return $ti(listMap[cell]?.name ?? '');
  } else if (role.image) {
    const url = getAlbumDef(cell);
    return url
      ? imageLink
        ? getUrlAndOrigin(url)
        : `<img src="${getUrlAndOrigin(url)}" style="width:50px;height:50px;object-fit:cover;" alt=""/>`
      : '';
  } else if (role.time) {
    return !!cell ? dayjs(formatServerTime(cell)).format(isString(role.time) ? role.time : getTimeFormat()) : '';
  } else if (role.func) {
    return role.func(cell, row);
  } else if (role.printShow) {
    return role.printShow(cell, row);
  } else {
    return $ti(cell ?? '');
  }
}

// 获取打印表格样式
export function getPrintTableCss() {
  return `table {width: 100%;border-collapse: collapse;}
  th, td {border: 1px solid black;padding: 8px;text-align: left;min-width: 50px;}
  th {background-color: lightgrey;}}`;
}
