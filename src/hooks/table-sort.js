import dragula from 'dragula/dist/dragula';
import 'dragula/dist/dragula.css';
import { nextTick } from 'vue';
import { QUERY_LIST_SORT } from '@/values';

// 表格排序
export function useTableSort(getRef, getOrderBy, sortFunc, options = { name: 'name-box', icon: 'drag-icon', key: 'data-key' }) {
  const cacheDragula = { value: null };

  // 初始化拖拽
  const initDragHandler = async () => {
    await nextTick();
    const pageRef = getRef();
    if (!pageRef) return;
    const dragBox = pageRef.querySelector('.el-table .el-table__body tbody');
    cacheDragula.value = dragula([dragBox], {
      invalid: (el, handle) => {
        console.log();
        return !checkDrag(handle);
      }
    }).on('dragend', () => {
      execDrag();
    });
  };

  // 判断是否可拖拽
  const checkDrag = (el) => {
    if (!el) {
      return false;
    } else if (el.classList?.contains(options.name)) {
      return false;
    } else if (el.classList?.contains(options.icon)) {
      return true;
    } else {
      return checkDrag(el.parentNode);
    }
  };

  // 执行排序任务
  const execDrag = async () => {
    await nextTick();
    const pageRef = getRef();
    if (!pageRef) return;
    const dragBox = pageRef.querySelector('.el-table .el-table__body tbody');
    const nodes = dragBox.querySelectorAll('.' + options.name);
    const sorts = [];
    const orderBy = getOrderBy();
    const len = nodes.length;
    nodes.forEach((node, index) => {
      if (!node) return;
      const key = node.getAttribute(options.key);
      if (!key) return false;
      sorts.push({ id: Number(key), sort: orderBy === QUERY_LIST_SORT.descending ? len - (index + 1) : index });
    });
    sortFunc(sorts);
  };

  return { initDragHandler };
}
