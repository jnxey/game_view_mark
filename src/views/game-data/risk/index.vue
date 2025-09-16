<template>
  <gv-full-height :bottom="20">
    <div class="risk flex-row align-top">
      <!--      -->
      <div class="left-box" v-if="!!infoLeft?.length && !!optionsData.kinds">
        <el-scrollbar>
          <template v-for="item in infoLeft" :key="item.table_id">
            <table-item :table-info="item" :kinds="kindsMap" />
          </template>
        </el-scrollbar>
      </div>
      <!--      -->
      <div class="content-box flex-1 flex-w0 flex-col">
        <div class="filter-wrap flex-row flex-wrap align-center">
          <template v-for="item in optionsData.currencyConfig" :key="item.id">
            <el-input-number
              class="mr-16 mb-16"
              v-model="contentQuery[item.id]"
              :placeholder="$ti(item.name)"
              v-place
              :controls="false"
              :max="Number.MAX_SAFE_INTEGER"
              @keyup.enter="contentSearch"
            />
          </template>
          <el-button class="mb-16" icon="Search" @click="contentSearch">{{ $t('common.refresh_btn') }}</el-button>
        </div>
        <div class="list-wrap flex-1 flex-h0 p-16">
          <el-scrollbar class="scroll-x-hide">
            <transition-group name="list" tag="div" class="list-container">
              <template v-for="(item, index) in tableData" :key="item.id">
                <bet-item class="list-item mb-16" :source="item" :kinds="kindsMap" :index="index" />
              </template>
            </transition-group>
          </el-scrollbar>
        </div>
      </div>
      <!--      -->
      <div class="right-wrap">
        <el-radio-group v-model="currentRankSort" @change="getAllRankData" class="mb-16">
          <el-radio class="custom-radio" :value="QUERY_LIST_SORT.descending">
            <div class="flex-row align-center">
              <span>{{ $t('common.sort_desc') }}</span>
              <gv-icon name="el-icon-sort-down" />
            </div>
          </el-radio>
          <el-radio class="custom-radio" :value="QUERY_LIST_SORT.ascending">
            <div class="flex-row align-center">
              <span>{{ $t('common.sort_asc') }}</span>
              <gv-icon name="el-icon-sort-up" />
            </div>
          </el-radio>
        </el-radio-group>
        <div class="flex-row align-top">
          <template v-for="(item, index) in currencyRankUser" :key="item.id">
            <div class="right-box" :class="{ 'ml-16': !!index }">
              <currency-rank class="mb-16" :source="item" :title-fit="$t('game_data.risk.user')" />
              <currency-rank v-if="currencyRankTable[index]" :source="currencyRankTable[index]" :title-fit="$t('game_data.risk.table')" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </gv-full-height>
</template>
<script>
export default { name: 'no-cache-game-data-risk' };
</script>
<script setup>
import { riskBetLists, riskCurrencyConfigLists, riskCurrencyConfigTableLists, riskTableLists } from '@/api/game-data/risk';
import { computed, onBeforeMount, reactive, ref, shallowRef } from 'vue';
import TableItem from '@/views/game-data/risk/_components/table-item.vue';
import GvFullHeight from '@/components/gv-full-height/index.vue';
import { gameKindLists } from '@/api/game/kind';
import { calcAmount, checkIndexArray, generateUUID, getArrayLastKey, mappingArrayToObject } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import BetItem from '@/views/game-data/risk/_components/bet-item.vue';
import CurrencyRank from '@/views/game-data/risk/_components/currency-rank.vue';
import { currencyBaseLists } from '@/api/currency/base';
import { useWebsocket } from '@/hooks/websocket';
import { currencyConfigLists } from '@/api/currency/config';
import { QUERY_LIST_SORT, QUERY_LIST_TYPE } from '@/values';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const BET_RISK_MAX = 50;

const infoLeft = ref();
const infoRightUser = shallowRef();
const infoRightTable = shallowRef();

const tableData = reactive([]);

const contentQuery = ref({});
const currentRankSort = ref(QUERY_LIST_SORT.descending);

const { optionsData } = useDictOptions({
  kinds: { api: gameKindLists },
  currencyBase: { api: currencyBaseLists },
  currencyConfig: { api: currencyConfigLists }
});

const currencyBaseMap = computed(() => mappingArrayToObject(optionsData.currencyBase ?? []));
const currencyConfigMap = computed(() => mappingArrayToObject(optionsData.currencyConfig ?? []));

const kindsMap = computed(() => mappingArrayToObject(optionsData.kinds ?? []));

// 当前排行数据
const currencyRankUser = computed(() => {
  const result = [];
  const rank = infoRightUser.value ?? [];
  rank.forEach((item) => {
    const key = result.findIndex((val) => val.id === item.currency_id);
    const info = { name: item.username, amount: item.total_bet_profit_loss };
    if (!checkIndexArray(key)) {
      result[result.length] = { id: item.currency_id, name: item.currency_name, icon: item.icon, rank: [info] };
    } else {
      result[key].rank.push(info);
    }
  });
  return result;
});

// 当前排行数据
const currencyRankTable = computed(() => {
  const result = [];
  const rank = infoRightTable.value ?? [];
  rank.forEach((item) => {
    const key = result.findIndex((val) => val.id === item.currency_id);
    const info = { name: item.table_name, amount: item.total_bet_profit_loss };
    if (!checkIndexArray(key)) {
      result[result.length] = { id: item.currency_id, name: item.currency_name, icon: item.icon, rank: [info] };
    } else {
      result[key].rank.push(info);
    }
  });
  return result;
});

const wsRisk = { room: 'risk', action: 'riskUpdate' };

useWebsocket(wsRisk.room, (message) => {
  if (message.type !== wsRisk.action) return;
  const { table_id, table_name, boot_number, currency_config_id, currency_id } = message;
  const tables = infoLeft.value ?? [];
  const cInfo = currencyBaseMap.value[currency_id];
  let infoKey = tables.findIndex((val) => val.table_id === table_id);

  // 左侧未找到通知得台号
  if (!checkIndexArray(infoKey)) {
    infoLeft.value.push({ table_name, table_id, boot_number, boot_profit: [], table_profit: [], bet_results: [] });
    infoKey = getArrayLastKey(infoLeft.value);
  }

  const info = { ...tables[infoKey] };

  // 当前靴号改变
  if (info.boot_number !== message.boot_number) {
    info.bet_results = [];
    info.boot_profit?.forEach((val) => val.total_bet_profit_loss === 0);
  }

  if (!cInfo) {
    // 不存在货币信息标识，没有投注
    // 没有投注信息，但有结果信息，添加注单
    if (!!message.bet_result) {
      info.bet_results.push({ boot_number: message.boot_number, bet_result: message.bet_result });
      infoLeft.value[infoKey] = info;
    }
  } else {
    // 存在货币信息标识，有投注，处理盈亏数据
    syncProfitData(info, cInfo, message);
    infoLeft.value[infoKey] = info;
  }

  // 投注风险显示
  const limit = Number(contentQuery.value[currency_config_id] || 0);
  if (!!cInfo && !!limit && message.amount >= limit) {
    tableData.unshift(getProfitRankItem(message));
    if (tableData.length > BET_RISK_MAX) tableData.splice(getArrayLastKey(tableData), 1);
  }
});

// 同步盈亏数据
const syncProfitData = (target, cInfo, message) => {
  const profit = message.total_bet_profit_loss;
  const bootProfit = target.boot_profit ?? [];
  const tableProfit = target.table_profit ?? [];
  const bootKey = bootProfit.findIndex((val) => val.currency_id === cInfo.id);
  const tableKey = tableProfit.findIndex((val) => val.currency_id === cInfo.id);
  const base = { abbreviation: cInfo.abbreviation, currency_id: cInfo.id, icon: cInfo.icon, table_id: message.table_id };
  if (checkIndexArray(bootKey)) {
    bootProfit[bootKey].total_bet_profit_loss = calcAmount(Number(bootProfit[bootKey].total_bet_profit_loss) + Number(profit));
  } else {
    bootProfit.push({ ...base, total_bet_profit_loss: profit });
  }
  if (checkIndexArray(tableKey)) {
    tableProfit[tableKey].total_bet_profit_loss = calcAmount(Number(tableProfit[bootKey].total_bet_profit_loss) + Number(profit));
  } else {
    tableProfit.push({ ...base, total_bet_profit_loss: profit });
  }
};

// 生成同步 投注项信息
const getProfitRankItem = (message) => {
  return {
    id: generateUUID(),
    currency_config_id: message.currency_config_id,
    round_number: message.round_number,
    boot_number: message.boot_number,
    create_time: message.create_time,
    game_kind_id: message.game_kind_id,
    table_id: message.table_id,
    amount: message.amount,
    table_name: message.table_name,
    currency_config_name: currencyConfigMap.value[message.currency_config_id]?.name,
    username: message.username,
    user_id: message.user_id
  };
};

// 获取风险数据
const getRiskInfo = async () => {
  getTableInfo();
  getCurrencyUser();
  getCurrencyTable();
  contentSearch();
};

//

// 获取左侧风险数据
const getTableInfo = async () => {
  const lists = await riskTableLists();
  lists.forEach((item) => {
    if (!item.bet_results?.length) return;
    const results = item.bet_results ?? [];
    item.bet_results = results.filter((val) => !!val?.bet_result);
  });
  infoLeft.value = lists;
};

// 获取右侧排行数据
const getCurrencyUser = async () => {
  infoRightUser.value = await riskCurrencyConfigLists({ field: 'amount', order_by: currentRankSort.value });
};

// 获取右侧排行数据
const getCurrencyTable = async () => {
  infoRightTable.value = await riskCurrencyConfigTableLists({ field: 'amount', order_by: currentRankSort.value });
};

// 拉去排行数据
const getAllRankData = async () => {
  getCurrencyUser();
  getCurrencyTable();
};

// 会员注单风险搜索
const contentSearch = async () => {
  const query = contentQuery.value;
  const params = { filter_large: [] };
  Object.keys(query).forEach((id) => {
    if (!id || !query[id]) return;
    params.filter_large.push(id + '-' + query[id]);
  });
  params.filter_large = params.filter_large.join(',');
  const { lists, extend } = await riskBetLists({ ...params, page_type: QUERY_LIST_TYPE.pager, page_no: 1, page_size: BET_RISK_MAX });
  tableData.splice(0);
  tableData.push(...lists);
  // 处理extend
  const { filter_large = '' } = extend;
  const items = filter_large.split(',');
  items.forEach((item) => {
    if (!item) return;
    const info = item.split('-');
    const id = Number(info[0]);
    if (!!currencyConfigMap.value[id]) contentQuery.value[id] = Number(info[1]);
  });
};

// 设置排序
onBeforeMount(() => {
  getRiskInfo();
});
</script>
<style scoped lang="scss">
.risk {
  min-width: 800px;
  height: 100%;
  .left-box {
    width: 300px;
    height: 100%;
  }
  .content-box {
    height: 100%;
    .filter-wrap {
      margin-left: 16px;
      margin-right: 16px;
      padding: 16px 16px 0 16px;
      border-radius: var(--gv-border-radius-big);
      background-color: var(--el-bg-color);
    }
  }

  .right-box {
    height: 100%;
  }

  .list-container {
    overflow-x: auto;
  }

  .list-item {
    transition: all 0.5s ease;
  }

  /* 进入动画 */
  .list-enter-from {
    opacity: 0;
    transform: translateX(60px);
  }

  /* 激活状态 */
  .list-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* 排序动画 */
  .list-move {
    transition: transform 0.5s ease;
  }

  .scroll-x-hide {
    ::v-deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }
  }
}
</style>
