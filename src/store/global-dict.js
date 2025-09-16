import { computed, shallowRef } from 'vue';
import { currencyConfigLists } from '@/api/currency/config';
import { QUERY_LIST_TYPE, STATUS_VALUE, YES_NO_VALUE } from '@/values';
import { financeTableLists } from '@/api/finance/table';
import { parseDict } from '@/tools';
import { gameLists } from '@/api/game/list';
import { managerState } from '@/store/manager';

// 币种
export const storeCurrencyConfig = shallowRef([]);

// 同步币种信息
export const syncStoreCurrencyConfig = async () => {
  const { lists } = await currencyConfigLists({ page_type: QUERY_LIST_TYPE.all, virtual_status: null });
  storeCurrencyConfig.value = lists;
};

// 台号
export const storeTable = shallowRef([]);

// 同步台号信息
export const syncStoreTable = async () => {
  const { lists } = await financeTableLists({ page_type: QUERY_LIST_TYPE.all });
  storeTable.value = lists;
};

// 游戏
export const storeGame = shallowRef([]);

// 同步游戏信息
export const syncStoreGame = async () => {
  const { lists } = await gameLists({ page_type: QUERY_LIST_TYPE.all });
  storeGame.value = lists;
};

// 全局字典描述
export const GLOBAL_DICT = computed(() => {
  return {
    currency_config: {
      mark: 'currency_config',
      map: parseDict(storeCurrencyConfig.value ?? []),
      getList: (filterDisabled = false) => {
        if (!filterDisabled) {
          return [...storeCurrencyConfig.value];
        } else {
          return [...storeCurrencyConfig.value].filter((val) => val.virtual_status === YES_NO_VALUE.no && val.status === STATUS_VALUE.normal);
        }
      }
    },
    table: {
      mark: 'table',
      map: parseDict(storeTable.value ?? []),
      getList: () => [...storeTable.value]
    },
    game: {
      mark: 'game',
      map: parseDict(storeGame.value ?? []),
      getList: () => [...storeGame.value]
    }
  };
});

// 拉取全局字典数据
export const syncGlobalDict = () => {
  if (!managerState.user) return;
  syncStoreCurrencyConfig();
  syncStoreTable();
  syncStoreGame();
};
