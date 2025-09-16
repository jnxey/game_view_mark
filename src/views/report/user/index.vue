<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="report_user-list"
      :request="reportUserLists"
      row-key="UID"
      :operate-width="160"
      :columns="columns"
      :default-query="defaultQuery"
      :popup-left-title="$t('common.user_agent')"
      :layout-bottom="layoutBottom"
      show-summary
      :handle-summary="handleSummary"
      select-single
      @selection-change="selectionChange"
      @table-data-change="refreshIsMerge"
      @format-columns-change="refreshSplitColumns"
      delay-request
      :is-page="false"
      :is-extend="true"
      hide-extend-button
      :other-query="getOtherQuery"
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-user-inline
          class="search-item"
          place-top
          v-model="query.user_id"
          :placeholder="$t('common.user_no')"
          @update:model-value="setUserQuery"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.game_id"
          :placeholder="$t('common.game_no')"
          multiple
          :request="gameLists"
          :empty-page="{ perm: permsMap.game.list.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.game_kind_id"
          :placeholder="$t('common.kind_no')"
          multiple
          :request="gameKindLists"
          :group-options="{ field: 'game_model', dict: GAME_MODEL_DICT }"
          filterable
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_id"
          :placeholder="$t('common.table_no')"
          multiple
          :request="financeTableLists"
          :empty-page="{ perm: permsMap.finance.table.view }"
          :disabled="disableSearchItem.table_id"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_type_id"
          :placeholder="$t('common.table_type')"
          multiple
          :request="financeTableTypeLists"
          :empty-page="{ perm: permsMap.finance.table_type.view }"
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.boot_number"
          :placeholder="$t('common.boot_no')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <el-input
          class="search-item"
          v-trim
          v-model="query.round_number"
          :placeholder="$t('common.round_no')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.currency_config_id"
          muted
          :placeholder="$t('common.currency_config_no')"
          multiple
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.user_type_id"
          :placeholder="$t('common.user_type_no')"
          multiple
          :options="optionsData.dimension?.user_type"
          :empty-page="{ perm: permsMap.user.type.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.is_shares"
          :placeholder="$t('report.search_box.is_shares')"
          :options="SHARE_REBATE_VALUE_DICT"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.is_user_income_settlement"
          :placeholder="$t('report.search_box.is_user_income_settlement')"
          :options="YES_NO_VALUE_DICT"
          @update:model-value="search"
        />
        <br />
        <el-radio-group class="search-item auto box" v-model="query.filter_time" @change="setDateRangeType">
          <el-radio-button :label="$t('common.create_time')" :value="rangeTimeType.create_time" />
          <el-radio-button :label="$t('common.close_time')" :value="rangeTimeType.close_time" />
        </el-radio-group>
        <el-radio-group v-model="timeRangeActive" class="search-item auto box" @change="setTimeRange">
          <el-radio-button :label="$t('common.today')" :value="TIME_RANGE_TYPE.today" />
          <el-radio-button :label="$t('common.yesterday')" :value="TIME_RANGE_TYPE.yesterday" />
          <el-radio-button :label="$t('common.before_yesterday')" :value="TIME_RANGE_TYPE.beforeYesterday" />
          <el-radio-button :label="$t('common.this_month')" :value="TIME_RANGE_TYPE.thisMonth" />
          <el-radio-button :label="$t('common.last_month')" :value="TIME_RANGE_TYPE.lastMonth" />
        </el-radio-group>
        <gv-daterange-picker
          v-show="showTimeRange"
          class="search-item"
          v-model:startTime="query.time_start"
          v-model:endTime="query.time_end"
          :placeholder="$t('common.time_range')"
          :type="dateRangeType"
          :show-format="dateRangeFormat"
          v-place
          :clearable="false"
          @click="clearTimeRangeActive"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="resetSearch">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <!--      -->
      <template #popup-left="{ height, offset }">
        <gv-user-tree ref="userTreeRef" @selected="selectedParent" :all-title="$t('report.user.agent_top')" :height="height" :offset="offset" />
      </template>
      <!--      -->
      <template #handler-left="{ query }">
        <div class="flex-row align-center">
          <el-button type="primary" link :title="$t('report.user.back')" :disabled="disabledUndo" @click="historyBack">
            <template #icon><gv-icon name="local-icon-back" class="fz-20" /></template>
          </el-button>
          <el-divider direction="vertical" />
          <breadcrumb-level :list="breadcrumbLevelList" @select="setSelected" :current="query.sub_id" />
        </div>
      </template>
      <template #handler-right>
        <el-button class="search-button" type="danger" round v-perms="[permsMap.report.user.settler]" :disabled="!selectedNow" @click="handleSettler">
          {{ $t('report.user.btn_settler') }}
        </el-button>
        <el-button class="search-button" type="primary" round v-perms="[permsMap.report.user.settler_log]" @click="toDetail">
          {{ $t('report.user_settler_log.title') }}
        </el-button>
      </template>
      <template #expand-column="{ row }">
        <template v-if="cacheExpandType[row.UID] === EXPAND_TYPE.currency">
          <report-expand
            :left-space="!!isMerge ? 290 : 140"
            :row="row"
            :split-columns="splitColumns"
            :expand-value="expandValue"
            :extend-width="extendWidth"
          />
        </template>
        <template v-if="cacheExpandType[row.UID] === EXPAND_TYPE.level">
          <report-expand-level
            :left-space="!!isMerge ? 290 : 150"
            :row="row"
            :split-columns="splitColumns"
            :expand-value="levelValue"
            :extend-width="extendWidth"
            @set-selected="setSelected"
          />
        </template>
      </template>
      <template #prev-column>
        <el-table-column :width="110" align="center" :resizable="false">
          <template #default="{ row }">
            <el-button text type="primary" :disabled="disabledKeyHasChild(row)" @click.stop="expandLevelColumn(row)">
              <span class="mr-4">{{ $t('report.user.btn_expand_open') }}</span>
              <gv-icon v-if="!levelCache[row.UID]" name="el-icon-arrow-right" />
              <gv-icon v-if="!!levelCache[row.UID]" name="el-icon-arrow-down" />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="!!isMerge" :width="140" align="center" :resizable="false">
          <template #default="{ row }">
            <div class="flex-row align-center">
              <el-button text type="primary" @click.stop="expandCurrencyColumn(row)">
                <span class="mr-4">{{ $t('report.user.btn_expand_currency_open') }}</span>
                <gv-icon v-if="!expandCache[row.UID]" name="el-icon-arrow-right" />
                <gv-icon v-if="!!expandCache[row.UID]" name="el-icon-arrow-down" />
              </el-button>
              <span
                class="cursor-pointer text-line-1 pt-8 pb-8 pl-4 pr-4 fz-14"
                :class="!!expandSelf[row.UID] ? 'text-primary' : 'text-placeholder'"
                :title="$t('report.user.btn_expand_currency_self_tips')"
                @click.stop="toggleRowSelf(row)"
              >
                <gv-icon name="local-icon-look-self" />
              </span>
            </div>
          </template>
        </el-table-column>
      </template>
      <template #username="{ row }">
        <div class="link-click link" :style="{ color: getLevelColor(row.level_path) }" @click.stop="setSelected(row)">
          {{ row.username }}
        </div>
      </template>
    </gv-table>
    <report-bet-details ref="reportBetDetailsRef" />
  </div>
</template>
<script>
export default { name: 'report-user-list' };
</script>
<script setup>
import { computed, nextTick, onMounted, reactive, shallowRef } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import { reportUserDetail, reportUserIncomeSettler, reportUserLists } from '@/api/report/user';
import { useDictOptions } from '@/hooks/dict';
import { userDimension } from '@/api/user/list';
import GvUserTree from '@/components/gv-user-tree/index.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { financeTableLists } from '@/api/finance/table';
import { financeTableTypeLists } from '@/api/finance/table-type';
import { gameLists } from '@/api/game/list';
import { GAME_MODEL_DICT, SHARE_REBATE_VALUE_DICT, USER_TREE_ALL_KEY, YES_NO_VALUE, YES_NO_VALUE_DICT } from '@/values';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { TIME_RANGE_TYPE } from '@/tools/date';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';

import BreadcrumbLevel from '@/views/report/user/_components/breadcrumb-level.vue';
import { useHistory } from '@/hooks/history';
import GvIcon from '@/components/gv-icon/index.vue';
import layer from '@/tools/layer';
import dayjs from 'dayjs';
import { formatServerTime, getTimeFormat, printElement } from '@/tools';
import { financeCodeWashingSettlerLog } from '@/api/finance/code-washing';
import { toRoutePath } from '@/router';
import { getReportUserProfitTempReceipts } from '@/views/report/user-settler-log/_models';
import { systemState } from '@/store/system';
import ReportBetDetails from '@/views/report/_components/report-bet-details.vue';
import { gameKindLists } from '@/api/game/kind';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';
import { EXPAND_TYPE, useCurrencyExtend, useExpandType, useLevelExtend } from '@/views/report/_hooks/column-extend';
import ReportExpand from '@/views/report/_components/report-expand.vue';
import { getLevelColor } from '@/views/report/user/_models';
import ReportExpandLevel from '@/views/report/_components/report-expand-level.vue';
import { GLOBAL_DICT } from '@/store/global-dict';

let lockHistory = false;

const {
  timeRangeActive,
  dateRangeType,
  dateRangeFormat,
  showTimeRange,
  setTimeRange,
  setDateRangeType,
  getDefaultQuery,
  clearTimeRangeActive,
  resetTimeRangeActive
} = useTimeRange(() => tableRef.value, { defActive: TIME_RANGE_TYPE.today }, true);

let defaultQuery = { ...getDefaultQuery() };

const props = defineProps({ isPopup: { type: Boolean, default: false }, layoutBottom: Number, tableId: Number });
const tableRef = shallowRef();
const userTreeRef = shallowRef();
const reportBetDetailsRef = shallowRef();
const disableSearchItem = reactive({});
const selected = shallowRef([]);

const breadcrumbLevelList = shallowRef([]);

const { optionsData } = useDictOptions({ dimension: { api: userDimension } });

const { disabledUndo, push, undo } = useHistory();

const selectedNow = computed(() => {
  return selected.value[0];
});

const columns = shallowRef([
  { title: $t('common.user_no'), dataIndex: 'username', minWidth: 100, subHide: true },
  { title: $t('report.table_col.nickname'), dataIndex: 'nickname', minWidth: 100, subHide: true },
  { title: $t('common.currency_config_no'), dataIndex: 'currency_config_name', minWidth: 100 },
  { title: $t('report.table_col.total_amount'), dataIndex: 'total_amount', minWidth: 100 },
  { title: $t('report.table_col.total_rake'), dataIndex: 'total_rake', minWidth: 100 },
  { title: $t('report.table_col.total_code_washing'), dataIndex: 'total_code_washing', minWidth: 100 },
  { title: $t('report.table_col.total_code_washing_fee'), dataIndex: 'total_code_washing_fee', minWidth: 100 },
  { title: $t('report.table_col.total_bet_profit_loss'), dataIndex: 'total_bet_profit_loss', minWidth: 100 },
  { title: $t('report.table_col.total_code_washing_profit_loss'), dataIndex: 'total_code_washing_profit_loss', minWidth: 100 },
  { title: $t('report.table_col.total_cost'), dataIndex: 'total_cost', minWidth: 100 },
  { title: $t('report.table_col.total_code_washing_profit_loss_cost'), dataIndex: 'total_code_washing_profit_loss_cost', minWidth: 100 },
  { title: $t('report.table_col.total_user_profit_loss'), dataIndex: 'total_user_profit_loss', minWidth: 100 },
  { title: $t('report.table_col.total_company_profit_loss'), dataIndex: 'total_company_profit_loss', minWidth: 100 },
  { title: $t('report.table_col.total_bonus_profit_loss'), dataIndex: 'total_bonus_profit_loss', minWidth: 100 },
  { title: $t('report.table_col.total_net_earning'), dataIndex: 'total_net_earning', minWidth: 100 },
  { title: $t('report.table_col.total_shareholder_net_earning'), dataIndex: 'total_shareholder_net_earning', minWidth: 100 },
  { title: $t('report.table_col.total_company_net_earning'), dataIndex: 'total_company_net_earning', minWidth: 100 }
]);

// 展开币种功能
const {
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
} = useCurrencyExtend(
  () => tableRef.value,
  reportUserDetail,
  { key: 'user_id', value: 'user_id' },
  (row) => {
    if (row.level_path === 1) {
      return { sub_id: 0, level_chain: 0 };
    } else {
      return { sub_id: 0 };
    }
  }
);

// 展开下级
const { levelValue, levelCache, toggleRowExpansionLevel, refreshExpandChangeLevel } = useLevelExtend(() => tableRef.value, reportUserLists);

const { cacheExpandType, expandLevelColumn, expandCurrencyColumn } = useExpandType(
  toggleRowExpansionLevel,
  refreshExpandChangeLevel,
  toggleRowExpansion,
  refreshExpandChange
);

// 刷新表格
const refreshTable = () => tableRef.value?.refresh();

// 获取额外的参数
const getOtherQuery = (query) => {
  if (!!query.user_id) {
    if (query.user_id === query.level_chain) {
      return { sub_id: 0, level_chain: 0 };
    } else {
      return { sub_id: 0 };
    }
  } else {
    return {};
  }
};

// 获取是否当前用户有下级
const disabledKeyHasChild = (row) => {
  if (!!userTreeRef.value?.getKeyHasChild) {
    return !userTreeRef.value.getKeyHasChild(row.user_id);
  } else {
    return false;
  }
};

// 回退
const historyBack = async () => {
  const result = undo();
  lockHistory = true;
  setSelected({ user_id: result || USER_TREE_ALL_KEY });
};

// 设置左侧选中节点
const setUserQuery = () => {
  const { user_id } = tableRef.value?.getQuery();
  userTreeRef.value?.setSelected(user_id || USER_TREE_ALL_KEY);
};

// 选中代理
const selectedParent = async ({ id, level_chain }) => {
  defaultQuery.user_id = id;
  defaultQuery.level_chain = level_chain;
  tableRef.value?.setQuery('user_id', id);
  tableRef.value?.setQuery('level_chain', level_chain);
  tableRef.value?.search();
  if (!lockHistory) push(id);
  lockHistory = false;
  breadcrumbLevelList.value = userTreeRef.value?.getLevelChain(id);
};

// 设置选中
const setSelected = async (row) => {
  const query = tableRef.value?.getQuery();
  if (query.user_id === row.user_id) {
    handleBetDetails(row);
  } else {
    userTreeRef.value?.setSelected(row.user_id);
  }
};

// 搜索
const searchTable = async (query, active) => {
  const cUserId = defaultQuery.user_id;
  if (!!cUserId) {
    defaultQuery.user_id = null;
    defaultQuery.level_chain = null;
  }
  Object.keys(query ?? {}).forEach((name) => (defaultQuery[name] = query[name]));
  disableSearchItem.table_id = !!query?.table_id;
  timeRangeActive.value = active;
  tableRef.value?.reset();
  await nextTick();
  if (!!cUserId) userTreeRef.value?.setSelected(USER_TREE_ALL_KEY);
};

// 结算
const handleSettler = async () => {
  const { time_start, time_end, is_user_income_settlement, sub_id, currency_config_id } = tableRef.value?.getQuery();
  const { settle_sn } = tableRef.value?.getExtend();
  const start = dayjs(formatServerTime(time_start)).format(getTimeFormat());
  const end = dayjs(formatServerTime(time_end)).format(getTimeFormat());
  const { username, user_id, currency_id } = selectedNow.value ?? {};
  if (!!sub_id) return layer.msgError($t('report.user.tips_level_top_settler'));
  if (is_user_income_settlement !== YES_NO_VALUE.no) return layer.msgError($t('report.user.tips_is_user_income_settlement_settler'));
  if (!!time_start && !!time_end) {
    await layer.confirm($t('report.user.tips_confirm_settler', { username, start, end }));
  } else {
    await layer.confirm($t('report.user.tips_confirm_settler_simple'));
  }
  layer.loading();
  const params = { user_ids: [user_id], settle_sn: settle_sn, currency_id, currency_config_id };
  const res = await reportUserIncomeSettler(params);
  layer.closeLoading();
  refreshTable();
  if (!!res[0]) {
    await layer.confirm($t('report.user.tips_confirm_print'));
    const info = res[0];
    const temp = getReportUserProfitTempReceipts([
      {
        ...info,
        web_name: systemState.config.web_name,
        start_time: dayjs(formatServerTime(info.settler_start_time)).format(getTimeFormat()),
        end_time: dayjs(formatServerTime(info.settler_end_time)).format(getTimeFormat())
      }
    ]);
    printElement(temp);
  }
};

// 前往结算明细
const toDetail = () => {
  const { user_id, username } = selectedNow.value ?? {};
  const params = { user_ids: user_id, username };
  const suffix = !!user_id ? '-' + username : '';
  toRoutePath(permsMap.report.user.settler_log, {
    ...params,
    request: financeCodeWashingSettlerLog.symbol,
    title: 'report.user_settler_log.title',
    suffix: suffix
  });
};

// 设置合计
const handleSummary = (param, list, extend) => {
  const { columns } = param;
  const sums = [];
  const summation = extend.summation;
  if (!summation) return [];
  columns.forEach((column, index) => {
    if (column.property === 'username') return (sums[index] = $t('report.user.count'));
    if (column.property === 'nickname') return (sums[index] = $t('report.user.person', { num: list.length ?? 0 }));
    sums[index] = summation[column.property];
    if (!column.property) return (sums[index] = null);
  });
  return sums;
};

// 选中行变更
const selectionChange = (rows) => {
  selected.value = rows;
};

// 查看注单详情
const handleBetDetails = async (row) => {
  const query = tableRef.value?.getQuery();
  const GCCList = GLOBAL_DICT.value.currency_config.getList();
  let currencyConfigId = query.currency_config_id;
  if (!currencyConfigId) {
    const cList = GCCList.filter((val) => val.currency_id === row.currency_id).map((val) => val.id);
    currencyConfigId = cList.join(',');
  }
  reportBetDetailsRef.value?.open(
    {
      user_id: row.user_id,
      username: row.username,
      filter_time: query.filter_time,
      time_start: query.time_start,
      time_end: query.time_end,
      table_id: query.table_id,
      game_id: query.game_id,
      table_type_id: query.table_type_id,
      currency_config_id: currencyConfigId
    },
    timeRangeActive.value
  );
};

// 重置搜索条件
const resetSearch = async () => {
  defaultQuery = { ...getDefaultQuery() };
  await nextTick();
  tableRef.value?.resetDefaultQuery();
  resetTimeRangeActive();
  userTreeRef.value?.setSelected(USER_TREE_ALL_KEY);
};

onMounted(() => {
  refreshSplitColumns();
});

defineExpose({ searchTable });
</script>
