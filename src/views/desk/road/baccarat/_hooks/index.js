import { computed } from 'vue';
import { parseDict, splitArrayByValue } from '@/tools/index.js';
import { GAME_KIND_MARK, GAME_KIND_MARK_DICT, GAME_ASK_WAY_TYPE } from '@/values';

const markMap = parseDict(GAME_KIND_MARK_DICT);

// 获取列表的问路情况
function _getListAskRoad(list, offset) {
  const resultList = [];
  // 计算指定位置的问路情况
  function getPositionWay(x, y) {
    const offsetList = list[x - offset];
    if (!offsetList) return;
    if (offsetList[y]) {
      return GAME_ASK_WAY_TYPE.regularly;
    } else if (!offsetList[y] && !offsetList[y - 1]) {
      return GAME_ASK_WAY_TYPE.regularly;
    } else {
      return GAME_ASK_WAY_TYPE.confused;
    }
  }
  list.forEach((nowList, x) => {
    if (x <= offset - 1) return;
    const preList = list[x - 1];
    nowList.forEach((item, y) => {
      let px = x;
      let py = y;
      if (!y) {
        // 如果是第一行，需要找前一行最后一个确定问路情况，然后取反
        px = px - 1;
        py = preList.length;
      }
      let result = getPositionWay(px, py);
      if (result) {
        if (!y) result = result.value === GAME_ASK_WAY_TYPE.regularly.value ? GAME_ASK_WAY_TYPE.confused : GAME_ASK_WAY_TYPE.regularly; // 取反
        resultList.push({ ...result, index: resultList.length });
      }
    });
  });
  return resultList;
}

// 设置格式化问路
export function useFormatList(getList, offset) {
  return computed(() => {
    const list = getList();
    const resultList = _getListAskRoad(list, offset);
    return splitArrayByValue(resultList, 'value');
  });
}

// 预测下一局问路情况
export function usePreviewList(getList, offset) {
  return computed(() => {
    const markMaster = markMap[GAME_KIND_MARK.master];
    const list1 = splitArrayByValue(
      [...getList(), { bet_result: [], value: markMaster.value, color: markMaster.color, name: markMaster.name }],
      'value'
    );
    const resultList1 = _getListAskRoad(list1, offset);
    const markPlayer = markMap[GAME_KIND_MARK.player];
    const list2 = splitArrayByValue(
      [...getList(), { bet_result: [], value: markPlayer.value, color: markPlayer.color, name: markPlayer.name }],
      'value'
    );
    const resultList2 = _getListAskRoad(list2, offset);
    return { master: resultList1.pop(), player: resultList2.pop() };
  });
}

// 设置过滤列表
export function useFilterList(getList, rows) {
  return computed(() => {
    const list = getList();
    const filterList = [];
    list.forEach((level2, x) => {
      initFilterList(x);
      let overY = rows;
      let y = 0;
      // 检查此列最大能显示到第几行
      for (y; y < overY; y++) {
        if (filterList[x][y]) {
          overY = y;
          break;
        }
      }
      if (level2.length > overY) {
        filterListFill(x, level2.slice(0, overY));
        // 将超出的项填到后面列中
        y = overY; // 重置y
        while (level2[y]) {
          const offset = Math.max(0, overY - 1);
          setSign(x + y - (overY - 1), offset, level2[y]);
          y = y + 1;
        }
      } else {
        filterListFill(x, level2);
      }
    });

    // 填充过滤列表
    function filterListFill(x, list) {
      list.forEach((item, index) => {
        filterList[x][index] = item;
      });
    }

    // 初始化第一层列表
    function initFilterList(x) {
      if (!filterList[x]) filterList[x] = [];
    }

    // 设置超出行数显示情况
    function setSign(x, y, value) {
      initFilterList(x);
      if (!filterList[x][y]) {
        filterList[x][y] = value;
      } else {
        // console.log('------------------已经被占位');
        setSign(x + 1, y, value);
      }
    }
    // console.log(filterList, '---------------1');
    return filterList;
  });
}
