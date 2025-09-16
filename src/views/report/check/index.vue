<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="game_data_check-list"
      :request="reportGameCheckList"
      :handler-list="handlerList"
      :operate-width="160"
      :columns="columns"
      :default-query="defaultQuery"
      :handler-extend="handlerExtend"
      show-summary
      :handle-summary="useSummary('table_id')"
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_id"
          :placeholder="$t('common.table_no')"
          :options="optionsData.table"
          :empty-page="{ perm: permsMap.finance.table.view }"
        />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.table_type_id"
          :placeholder="$t('common.table_type')"
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
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.game_id"
          :placeholder="$t('common.game_no')"
          :options="optionsData.game"
          :empty-page="{ perm: permsMap.game.list.view }"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button
          type="primary"
          v-perms="[permsMap.report.check.inc_dec_log]"
          @click="toRoutePath(permsMap.report.check.inc_dec_log, { title: 'report.check_inc_dec_log.title' })"
        >
          {{ $t('report.check_inc_dec_log.title') }}
        </el-button>
      </template>
      <template #id="{ row }">
        <el-button link type="primary" v-perms="[permsMap.report.check.edit]" @click.stop="handleEdit(row)">{{ $t('common.edit_btn') }}</el-button>
        <el-button link type="primary" v-perms="[permsMap.report.check.edit]" @click.stop="openTableChip(NUMBER_HANDLER.inc, row)">
          {{ $t('report.check.chip_inc') }}
        </el-button>
        <el-button link type="warning" v-perms="[permsMap.report.check.edit]" @click.stop="openTableChip(NUMBER_HANDLER.dec, row)">
          {{ $t('report.check.chip_dec') }}
        </el-button>
      </template>
    </gv-table>
    <table-check ref="tableCheckRef" />
    <table-chip-edit ref="tableChipEditRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { computed, provide, onMounted, ref, shallowRef, unref, onActivated } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { useDictOptions } from '@/hooks/dict';
import { reportCheckIncDecLog, reportGameCheckGetDetail, reportGameCheckList, reportGameCheckSet } from '@/api/report/game-check';
import { financeTableLists } from '@/api/finance/table';
import { gameLists } from '@/api/game/list';
import { getMultipleKey, mappingArrayToObject, parseDict } from '@/tools';
import { financeTableTypeLists } from '@/api/finance/table-type';
import { currencyConfigLists } from '@/api/currency/config';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import layer from '@/tools/layer';
import TableCheck from '@/views/scene/enter/_components/_components/table-check.vue';
import { currencyBaseLists } from '@/api/currency/base';
import { gameChipLists } from '@/api/game/chip';
import { toRoutePath } from '@/router';
import { permsMap } from '@/api/perms';
import { useSummary } from '@/hooks/summary';
import TableChipEdit from '@/views/scene/enter/_components/_components/table-chip-edit.vue';
import { NUMBER_HANDLER } from '@/values';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';
import { GLOBAL_DICT } from '@/store/global-dict';

const tableRef = shallowRef();
const tableCheckRef = shallowRef();
const tableChipEditRef = shallowRef();

const defaultQuery = {};

const { optionsData, refresh } = useDictOptions(
  {
    table: { api: financeTableLists },
    tableType: { api: financeTableTypeLists },
    game: { api: gameLists },
    faceConfig: { api: gameChipLists },
    currencyBase: { api: currencyBaseLists },
    currencyConfig: { api: currencyConfigLists }
  },
  true
);

/****************编辑使用*****************/
const tableInfo = ref();
const openingInfo = ref();
const faceConfig = computed(() => optionsData.faceConfig);
const currencyBase = computed(() => optionsData.currencyBase);
const currencyConfig = computed(() => optionsData.currencyConfig);
const handleNextBoot = () => tableRef.value?.refresh();
const currencyConfigMap = computed(() => mappingArrayToObject(unref(currencyConfig)));
/****************编辑使用*****************/

const columns = computed(() => {
  const config = optionsData.currencyConfig ?? [];
  const cols = [];
  config.forEach((item) => {
    cols.push({ title: `${$ti(item.name)} ${$t('report.check.manual_value')}`, dataIndex: `${item.id}_manual_value`, minWidth: 150 });
    cols.push({ title: `${$ti(item.name)} ${$t('report.check.system_value')}`, dataIndex: `${item.id}_system_value`, minWidth: 150 });
    cols.push({ title: `${$ti(item.name)} ${$t('report.check.gap')}`, dataIndex: `${item.id}_gap`, minWidth: 150 });
    cols.push({ title: `${$ti(item.name)} ${$t('report.check.chip_inc')}`, dataIndex: `${item.id}_inc_code`, minWidth: 150 });
    cols.push({ title: `${$ti(item.name)} ${$t('report.check.chip_dec')}`, dataIndex: `${item.id}_dec_code`, minWidth: 150 });
  });
  return [
    { title: $t('common.operate_col'), dataIndex: 'id', minWidth: 180, fixed: 'left', noTooltip: true, perm: [permsMap.report.check.edit] },
    { title: $t('common.table_no'), dataIndex: 'table_id', minWidth: 120, dict: GLOBAL_DICT.value.table.mark },
    { title: $t('common.table_type'), dataIndex: 'table_type_id', minWidth: 120, dict: parseDict(optionsData.tableType) },
    { title: $t('common.game_no'), dataIndex: 'game_id', minWidth: 120, dict: GLOBAL_DICT.value.game.mark },
    { title: $t('common.boot_no'), dataIndex: 'boot_number', minWidth: 120 },
    { title: $t('report.check.check_time'), dataIndex: 'create_time', minWidth: 180, time: true },
    { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true },
    ...cols,
    { title: $t('common.remark'), dataIndex: 'remark', minWidth: 120 },
    { title: $t('report.check.work_no'), dataIndex: 'work_no', minWidth: 120 }
  ];
});

// 处理列表数据
const handlerList = (list) => {
  list.forEach((item) => {
    const details = item.details ?? [];
    details.forEach((detail) => {
      item[`${detail.currency_config_id}_manual_value`] = detail.manual_value;
      item[`${detail.currency_config_id}_system_value`] = detail.system_value;
      item[`${detail.currency_config_id}_gap`] = detail.gap;
      item[`${detail.currency_config_id}_inc_code`] = detail.inc_code;
      item[`${detail.currency_config_id}_dec_code`] = detail.dec_code;
    });
  });
  return list;
};

// 处理扩展数据
const handlerExtend = (extend) => {
  const countInfo = {};
  Object.keys(extend.summation ?? {}).forEach((p) => {
    const detail = extend.summation[p];
    countInfo[`${p}_manual_value`] = detail.manual_value;
    countInfo[`${p}_system_value`] = detail.system_value;
    countInfo[`${p}_gap`] = detail.gap;
    countInfo[`${p}_inc_code`] = detail.inc_code;
    countInfo[`${p}_dec_code`] = detail.dec_code;
  });
  return { summation: countInfo };
};

// 编辑
const handleEdit = async (row) => {
  layer.loading();
  const res = await reportGameCheckGetDetail({ id: row.id });
  layer.closeLoading();
  const { table_id, table_type_id, game_id, boot_number, details, report_game_close_id } = row;
  const { extend } = res;
  const cMap = currencyConfigMap.value;
  const betSum = {};
  const tableBaseUse = {};
  const tableIncDecCount = [];
  const faceConfigMap = mappingArrayToObject(faceConfig.value);
  const editIdMap = {};
  details.forEach((item) => {
    editIdMap[item.currency_config_id] = item.id;
    betSum[item.currency_config_id] = {
      sum_code_washing: item.code_washing,
      sum_code_washing_fee: item.code_washing_fee,
      sum_bet_profit_loss: item.bet_profit_loss,
      currency_config_id: item.currency_config_id
    };
    tableBaseUse[item.currency_config_id] = { base_number: item.system_value, table_id: table_id, currency_config_id: item.currency_config_id };
    tableIncDecCount.push({ sum_number: item.inc_code, type: 'inc', currency_config_id: item.currency_config_id });
    tableIncDecCount.push({ sum_number: item.dec_code, type: 'dec', currency_config_id: item.currency_config_id });
  });
  const info = { bet_sum: betSum, table_base_use: tableBaseUse, table_inc_dec_count: tableIncDecCount };
  const currentValue = {};
  extend.forEach((item) => {
    if (!item.number) return;
    if (!faceConfigMap[item.game_check_id]) return;
    const face = faceConfigMap[item.game_check_id];
    const config = cMap[face.currency_config_id];
    const key = getMultipleKey(config.currency_id, item.game_check_id, config.type);
    currentValue[key] = item.number;
  });
  tableInfo.value = { id: table_id, table_type_id, game_id };
  openingInfo.value = { boot_number, report_game_close_id, check_id: row.id };
  tableCheckRef.value?.open(table_id, info, currentValue, editIdMap);
};

// 增减码
const openTableChip = (type, row) => {
  const { id, report_game_close_id } = row;
  tableChipEditRef.value?.open(type, { table_id: row.table_id, report_game_check_id: id, report_game_close_id });
};

const refreshTable = () => tableRef.value?.refresh();

onActivated(() => refresh());

onMounted(async () => {
  await refresh();
});

provide('tableInfo', tableInfo);
provide('openingInfo', openingInfo);
provide('faceConfig', faceConfig);
provide('currencyBase', currencyBase);
provide('currencyConfig', currencyConfig);
provide('handleNextBoot', handleNextBoot);
</script>
