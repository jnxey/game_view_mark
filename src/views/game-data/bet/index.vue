<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="bet-list"
      :request="betLists"
      row-key="bet_id"
      select-single
      :operate-width="220"
      :operate-perms="[permsMap.game_data.bet.edit, permsMap.game_data.bet.log]"
      :columns="columns"
      :default-query="defaultQuery"
      :handler-list="handleList"
      @selection-change="selectionChange"
      :layout-bottom="layoutBottom"
      :delay-request="isPopup"
      show-summary
      :handle-summary="useSummary('bet_id', excludes)"
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-user-inline class="search-item" place-top v-model="query.user_id" :placeholder="$t('common.user_no')" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.game_id"
          :placeholder="$t('common.game_no')"
          multiple
          :request="gameLists"
          :empty-page="{ perm: permsMap.game.list.view }"
        />
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.currency_config_id"
          :placeholder="$t('common.currency_config_no')"
          muted
          multiple
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_id"
          :placeholder="$t('common.table_no')"
          multiple
          :request="financeTableLists"
          :empty-page="{ perm: permsMap.finance.table.view }"
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
          :span-month="3"
          @click="clearTimeRangeActive"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="doubleExec(reset, resetTimeRangeActive)">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left="{ query, search }">
        <el-button
          type="primary"
          v-perms="[permsMap.game_data.bet.log]"
          @click="toRoutePath(permsMap.game_data.bet.log, { request: betActionLog.symbol, title: 'game_data.bet_log.title' })"
        >
          {{ $t('game_data.bet_log.title') }}
        </el-button>
        <el-button type="primary" v-perms="[permsMap.game_data.bet.bonus]" @click="toRoutePath(permsMap.game_data.bet.bonus)">
          {{ $t('game_data.bonus.title') }}
        </el-button>
        <el-button type="primary" v-perms="[permsMap.game_data.bet.edit]" :disabled="!selectedNow" @click="openEditGwm">
          {{ $t('game_data.bet.btn_gwm') }}
        </el-button>
        <el-button type="primary" v-perms="[permsMap.game_data.bet.edit]" :disabled="!selectedNow" @click="openEditGwmBonus">
          {{ $t('game_data.bet.btn_gwm_bonus') }}
        </el-button>
      </template>
      <template #bet_result="{ row }">
        <gv-bet-result-normal :bet-info="row" :kinds-map="kindsMap" :size="40" edit-able @edit-click="openEditResult(row)" />
      </template>
      <template #operate-cell="{ row }" v-if="!isPopup">
        <el-button link type="primary" v-perms="[permsMap.game_data.bet.edit]" @click="handleEdit(row)">
          {{ $t('common.modify_btn') }}
        </el-button>
        <el-button link type="primary" v-perms="[permsMap.game_data.bet.edit]" @click="handleEditBonus(row)">
          {{ $t('game_data.bet.btn_edit_bonus') }}
        </el-button>
        <el-button
          link
          type="info"
          v-perms="[permsMap.game_data.bet.log]"
          @click="toRoutePath(permsMap.game_data.bet.log, { user_id: row.user_id, title: 'game_data.bet_log.title', suffix: '-' + row.username })"
        >
          {{ $t('common.record_btn') }}
        </el-button>
      </template>
    </gv-table>
    <add-baccarat-gwm ref="addBaccaratGwmRef" @success="refreshTable" />
    <add-general-gwm ref="addGeneralGwmRef" @success="refreshTable" />
    <add-bonus ref="addBonusRef" @success="refreshTable" />
    <edit-baccarat ref="editBaccaratRef" @success="refreshTable" />
    <edit-general ref="editGeneralRef" @success="refreshTable" />
    <edit-bonus ref="editBonusRef" @success="refreshTable" />
    <edit-baccarat-result ref="editBaccaratResultRef" :title="$t('game_data.bet.title_modify_result')" @success="refreshTable" />
    <edit-general-niuniu ref="editGeneralNiuniuRef" :title="$t('game_data.bet.title_modify_result')" @success="refreshTable" />
  </div>
</template>

<script setup>
import { betActionLog, betBonusList, betLists, betModify } from '@/api/game-data/bet';
import { computed, onActivated, onBeforeMount, reactive, shallowRef, toRaw, unref } from 'vue';
import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT, GAME_MODEL_TYPE_GENERAL, YES_NO_VALUE, YES_NO_VALUE_DICT } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import { mappingArrayToObject, parseDict } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import { gameKindLists } from '@/api/game/kind';
import { gameLists } from '@/api/game/list';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { financeTableLists } from '@/api/finance/table';
import AddBaccaratGwm from './_components/add-baccarat-gwm.vue';
import AddGeneralGwm from './_components/add-general-gwm.vue';
import EditBaccarat from './_components/edit-baccarat.vue';
import EditGeneral from './_components/edit-general.vue';
import { toRoutePath } from '@/router';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { getTimeRange, TIME_RANGE_TYPE } from '@/tools/date';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';
import { financeTableTypeLists } from '@/api/finance/table-type';
import { permsMap } from '@/api/perms';
import { useSummary } from '@/hooks/summary';
import { useBetOpenShow } from '@/hooks/print-show';
import { $t } from '@/lang/i18n';
import { currencyConfigLists } from '@/api/currency/config';
import AddBonus from '@/views/game-data/bet/_components/add-bonus.vue';
import EditBonus from '@/views/game-data/bet/_components/edit-bonus.vue';
import { GLOBAL_DICT } from '@/store/global-dict';
import { $ti } from '@/lang/input';
import { bounsConfigLists } from '@/api/bouns/config';
import EditGeneralNiuniu from '@/views/game-data/bet-open/_components/edit-general-niuniu.vue';
import EditBaccaratResult from '@/views/game-data/bet-open/_components/edit-baccarat.vue';
import GvBetResultNormal from '@/components/gv-bet-result-show/normal.vue';

const {
  timeRangeActive,
  dateRangeType,
  dateRangeFormat,
  showTimeRange,
  setTimeRange,
  setDateRangeType,
  getDefaultQuery,
  clearTimeRangeActive,
  resetTimeRangeActive,
  doubleExec
} = useTimeRange(() => tableRef.value, { defActive: TIME_RANGE_TYPE.today }, true);

const defaultQuery = { ...getDefaultQuery() };

const props = defineProps({ isPopup: { type: Boolean, default: false }, layoutBottom: Number, tableId: Number });

const tableRef = shallowRef();
const addBaccaratGwmRef = shallowRef();
const addGeneralGwmRef = shallowRef();
const addBonusRef = shallowRef();
const editBaccaratRef = shallowRef();
const editGeneralRef = shallowRef();
const editBonusRef = shallowRef();

const editBaccaratResultRef = shallowRef();
const editGeneralNiuniuRef = shallowRef();

const selected = shallowRef([]);

const { optionsData, refresh } = useDictOptions(
  { game: { api: gameLists }, kinds: { api: gameKindLists }, currencyConfig: { api: currencyConfigLists }, bonusList: { api: bounsConfigLists } },
  true
);

const selectedNow = computed(() => {
  return selected.value[0];
});

const kindsMap = computed(() => mappingArrayToObject(optionsData.kinds ?? []));

const refreshTable = () => tableRef.value?.refresh();

const excludes = {
  game_name: true,
  currency_config_name: true,
  table_name: true,
  boot_number: true,
  round_number: true,
  game_kind_name: true,
  bet_result: true,
  is_close: true,
  is_cash_compensation: true,
  work_no: true,
  create_time: true,
  update_time: true,
  close_datetime: true
};

const columns = computed(() => {
  const bonusMap = mappingArrayToObject(optionsData.bonusList ?? []);
  return [
    { title: $t('game_data.bet.bet_id'), dataIndex: 'bet_id', minWidth: 120 },
    { title: $t('common.user_no'), dataIndex: 'username', minWidth: 100 },
    { title: $t('common.game_no'), dataIndex: 'game_name', minWidth: 100 },
    { title: $t('common.currency_config_no'), dataIndex: 'currency_config_id', minWidth: 100, dict: GLOBAL_DICT.value.currency_config.mark },
    { title: $t('common.table_no'), dataIndex: 'table_name', minWidth: 100 },
    { title: $t('common.boot_no'), dataIndex: 'boot_number', minWidth: 100 },
    { title: $t('common.round_no'), dataIndex: 'round_number', minWidth: 100 },
    { title: $t('game_data.bet.kind_no'), dataIndex: 'game_kind_id', minWidth: 100, dict: parseDict(optionsData.kinds) },
    { title: $t('game_data.bet.amount'), dataIndex: 'amount', minWidth: 100 },
    { title: $t('game_data.bet.rake'), dataIndex: 'rake', minWidth: 100 },
    { title: $t('game_data.bet.bet_result'), dataIndex: 'bet_result', minWidth: 100, printShow: useBetOpenShow(() => unref(kindsMap)) },
    { title: $t('game_data.bet.bet_profit_loss'), dataIndex: 'bet_profit_loss', minWidth: 100, profit: true },
    { title: $t('game_data.bet.code_washing'), dataIndex: 'code_washing', minWidth: 100 },
    { title: $t('game_data.bet.code_washing_fee'), dataIndex: 'code_washing_fee', minWidth: 100 },
    { title: $t('game_data.bonus.amount'), dataIndex: 'bonus_amount', minWidth: 100 },
    { title: $t('game_data.bonus.prize_amount'), dataIndex: 'bonus_profit_loss', minWidth: 100 },
    {
      title: $t('game_data.bonus.bonus_result'),
      dataIndex: 'bonus_result',
      minWidth: 100,
      func: (_, val) => {
        return $ti(bonusMap[val.bonus_result?.[0]]?.name);
      }
    },
    { title: $t('game_data.bet.is_close'), dataIndex: 'is_close', minWidth: 100, dict: parseDict(YES_NO_VALUE_DICT) },
    { title: $t('game_data.bet.is_cash_compensation'), dataIndex: 'is_cash_compensation', minWidth: 100, dict: parseDict(YES_NO_VALUE_DICT) },
    { title: $t('common.admin_no'), dataIndex: 'work_no', minWidth: 100 },
    { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
    { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true },
    { title: $t('common.close_time'), dataIndex: 'close_datetime', minWidth: 180, time: true }
  ];
});

// 处理表格数据
const handleList = (list) => {
  list.forEach((item) => {
    item.is_close = !!item.close_datetime ? YES_NO_VALUE.yes : YES_NO_VALUE.no;
  });
  return list;
};

// 选中行变更
const selectionChange = (rows) => {
  selected.value = rows;
};

// 修改注单
const handleEdit = async (row) => {
  if (GAME_MODEL_TYPE_BACCARAT.includes(row.game_model)) {
    editBaccaratRef.value?.open(toRaw(row));
  } else if (GAME_MODEL_TYPE_GENERAL.includes(row.game_model)) {
    editGeneralRef.value?.open(toRaw(row));
  }
};

// 修改彩金
const handleEditBonus = async (row) => {
  editBonusRef.value?.open(toRaw(row));
};

// 补记注单
const openEditGwm = async () => {
  const selected = selectedNow.value;
  if (!selected) return;
  if (GAME_MODEL_TYPE_BACCARAT.includes(selected.game_model)) {
    addBaccaratGwmRef.value?.open(toRaw(selected));
  } else if (GAME_MODEL_TYPE_GENERAL.includes(selected.game_model)) {
    addGeneralGwmRef.value?.open(toRaw(selected));
  }
};

// 补记彩金
const openEditGwmBonus = async () => {
  const selected = selectedNow.value;
  if (!selected) return;
  addBonusRef.value?.open(toRaw(selected));
};

// 编辑开牌结果
const openEditResult = async (data) => {
  const params = {
    id: data.open_id,
    bet_result: data.bet_result,
    boot_id: data.boot_id,
    boot_number: data.boot_number,
    close_time: data.close_datetime,
    game_id: data.game_id,
    game_model: data.game_model,
    game_name: data.game_name,
    round_number: data.round_number,
    table_id: data.table_id,
    table_name: data.table_name
  };
  if (GAME_MODEL_TYPE_BACCARAT.includes(params.game_model)) {
    editBaccaratResultRef.value?.open(params);
  } else if (params.game_model === GAME_MODEL.niu_niu) {
    editGeneralNiuniuRef.value?.open(params);
  }
};

// 搜索
const searchTable = async (query, active) => {
  Object.keys(query ?? {}).forEach((name) => (defaultQuery[name] = query[name]));

  timeRangeActive.value = active;
  tableRef.value?.resetDefaultQuery();
  setTimeRange();
  tableRef.value?.search();
};

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
  if (!props.isPopup) await refreshTable();
});

defineExpose({ searchTable });
</script>
