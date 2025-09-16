import { reactive, ref, shallowRef } from 'vue';
import { delayExec, getPX, isFunction, toAwait } from '@/tools';

// 展开类型
export const EXPAND_TYPE = { level: 'level', currency: 'currency' };

// 展开币种信息
export function useCurrencyExtend(getTableRef, requestFunc, props, otherQuery) {
  const splitColumns = shallowRef([]);
  const isMerge = ref(false);
  const expandValue = reactive({});
  const extendWidth = reactive({});
  const expandCache = reactive({});
  const expandSelf = reactive({});

  // 表格数据变更
  const refreshIsMerge = () => {
    const target = getTableRef();
    const { data_merge } = target?.getExtend();
    isMerge.value = data_merge === 'merge';
  };

  // 刷新格式化后的column
  const refreshSplitColumns = async () => {
    await delayExec(300);
    const target = getTableRef();
    const instance = target?.getTableInstance() ?? {};
    instance.columns?.forEach((item) => {
      extendWidth[item.property] = !!item.width && !item.realWidth ? getPX(item.width) : getPX(item.realWidth);
    });
    splitColumns.value = target?.getFormatColumns();
  };

  // 展开表格
  const toggleRowExpansion = (row, setClose = false) => {
    if (!setClose) {
      const target = getTableRef();
      expandCache[row.UID] = !expandCache[row.UID];
      target.toggleRowExpansion(row, expandCache[row.UID]);
    } else {
      expandCache[row.UID] = false;
    }
  };

  // 只看自身
  const toggleRowSelf = (row) => {
    expandSelf[row.UID] = !expandSelf[row.UID];
    if (!!expandCache[row.UID]) refreshExpandChange(row);
  };

  // 展开变更
  const refreshExpandChange = async (row) => {
    const target = getTableRef();
    if (!!expandCache[row.UID] && !expandValue[row.UID]?.loading) {
      expandValue[row.UID] = { loading: true, value: null };
      const query = target?.getQuery();
      const other = isFunction(otherQuery) ? otherQuery(row) : {};
      const params = {
        ...query,
        [props.key]: row[props.value],
        currency_id: row.currency_id,
        level_chain: row.level_chain,
        view_self: !!expandSelf[row.UID] ? 1 : null,
        ...other
      };
      const [res, err] = await toAwait(requestFunc(params));
      if (!!err) {
        expandValue[row.UID] = null;
      } else {
        expandValue[row.UID] = { loading: false, value: res.lists ?? [] };
      }
    }
  };

  return {
    splitColumns,
    isMerge,
    expandValue,
    extendWidth,
    expandCache,
    expandSelf,
    refreshIsMerge,
    refreshSplitColumns,
    toggleRowExpansion,
    toggleRowSelf,
    refreshExpandChange
  };
}

// 展开下级信息
export function useLevelExtend(getTableRef, requestFunc) {
  const levelValue = reactive({});
  const levelCache = reactive({});

  // 展开表格
  const toggleRowExpansionLevel = (row, setClose = false) => {
    if (!setClose) {
      const target = getTableRef();
      levelCache[row.UID] = !levelCache[row.UID];
      target.toggleRowExpansion(row, levelCache[row.UID]);
    } else {
      levelCache[row.UID] = false;
    }
  };

  // 展开变更
  const refreshExpandChangeLevel = async (row) => {
    const target = getTableRef();
    if (!levelValue[row.UID]?.loading && !levelValue[row.UID]?.value) {
      levelValue[row.UID] = { loading: true, value: null };
      const query = target?.getQuery();
      const params = { ...query, sub_id: row.user_id, user_id: 0, currency_id: row.currency_id, level_chain: row.level_chain };
      const [res, err] = await toAwait(requestFunc(params));
      if (!!err) {
        levelValue[row.UID] = null;
      } else {
        levelValue[row.UID] = { loading: false, value: res.lists ?? [] };
      }
    }
  };

  return {
    levelValue,
    levelCache,
    toggleRowExpansionLevel,
    refreshExpandChangeLevel
  };
}

// 展开类型控制
export function useExpandType(toggleLevel, queryLevel, toggleCurrency, queryCurrency) {
  const cacheExpandType = reactive({});

  const expandLevelColumn = (row) => {
    toggleLevel(row);
    toggleCurrency(row, true);
    queryLevel(row);
    cacheExpandType[row.UID] = EXPAND_TYPE.level;
  };

  const expandCurrencyColumn = (row) => {
    toggleCurrency(row);
    toggleLevel(row, true);
    queryCurrency(row);
    cacheExpandType[row.UID] = EXPAND_TYPE.currency;
  };

  return { cacheExpandType, expandLevelColumn, expandCurrencyColumn };
}
