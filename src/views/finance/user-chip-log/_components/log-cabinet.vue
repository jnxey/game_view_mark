<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="log-list"
      :request="financeUserLog"
      :columns="columns"
      :default-query="defaultQuery"
      show-summary
      :handle-summary="useSummary('username', null, $t('finance.user_chip_log.count_title'))"
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="title" @back="backTab($router)" />
        <gv-select-options
          v-if="!defaultQuery?.cabinet_chip_type_id"
          class="search-item"
          place-top
          v-model="query.cabinet_chip_type_id"
          :placeholder="$t('log.cabinet_name')"
          :disabled="!!defaultQuery.cabinet_chip_type_id"
          multiple
          :request="financeCabinetChipTypeLists"
          :empty-page="{ perm: permsMap.finance.cabinet_type.view }"
        />
        <gv-select-user-inline
          v-if="!defaultQuery?.cabinet_chip_type_id"
          class="search-item"
          place-top
          v-model="query.user_id"
          :placeholder="$t('common.user_no')"
        />
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.currency_config_id"
          :placeholder="$t('common.currency_config_no')"
          :options="optionsData.currencyConfig"
          multiple
        />
        <gv-select-options
          class="search-item"
          place-top
          :model-value="actionQueryGet(query)"
          @update:model-value="(value) => actionQuerySet(query, value)"
          :placeholder="$t('log.action_from')"
          clearable
          :options="actionList"
        />
        <!--    汇入汇出搜索条件    -->
        <template v-if="Number(query.cabinet_chip_type_id) === REGULAR_CABINET_TYPE_IDS.remit">
          <gv-select-options
            class="search-item"
            v-model="query.remittance_type_id"
            place-top
            :request="financeRemitTypeLists"
            :placeholder="$t('finance.user_chip.remit_type')"
          />
          <gv-select-options
            class="search-item"
            v-model="query.account_type"
            place-top
            :options="IS_MEMBER_DICT"
            :placeholder="$t('finance.user_chip_log.is_member')"
          />
          <el-input
            class="search-item"
            v-trim
            v-model="query.mobile"
            :placeholder="$t('finance.user_chip.mobile')"
            v-place
            clearable
            @keyup.enter="search"
          />
        </template>
        <el-input
          class="search-item"
          v-trim
          v-model="query.operator"
          :placeholder="$t('common.operate_person')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <br />
        <el-radio-group v-model="timeRangeActive" class="search-item auto box" @change="setTimeRange">
          <el-radio-button :label="$t('common.today')" :value="TIME_RANGE_TYPE.today" />
          <el-radio-button :label="$t('common.yesterday')" :value="TIME_RANGE_TYPE.yesterday" />
          <el-radio-button :label="$t('common.before_yesterday')" :value="TIME_RANGE_TYPE.beforeYesterday" />
          <el-radio-button :label="$t('common.this_month')" :value="TIME_RANGE_TYPE.thisMonth" />
          <el-radio-button :label="$t('common.last_month')" :value="TIME_RANGE_TYPE.lastMonth" />
        </el-radio-group>
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.operate_time')"
          :type="dateRangeType"
          :show-format="dateRangeFormat"
          v-place
          :clearable="false"
          @click="clearTimeRangeActive"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #action_info="{ row }">
        <div class="flex-row align-center">
          <template v-for="(item, index) in showActionInfo(null, row)" :key="index">
            <gv-icon v-if="!!index" name="el-icon-right" />
            <span>{{ item }}</span>
          </template>
        </div>
      </template>
    </gv-table>
  </div>
</template>
<script setup>
import { computed, nextTick, onActivated, onBeforeMount, shallowRef, watch } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { backTab } from '@/store/tabs';
import { financeActionsSummary, financeUserLog } from '@/api/finance/user-chip';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { useRoute } from 'vue-router';
import { parseDict } from '@/tools';
import { CURRENCY_TYPE_DICT, IS_MEMBER, IS_MEMBER_DICT, REGULAR_CABINET_TYPE_IDS, YES_NO_VALUE } from '@/values';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { FINANCE_ACTION } from '../_models/finance';
import { $t } from '@/lang/i18n';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import { financeCabinetChipTypeLists } from '@/api/finance/cabinet-chip-type';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import { permsMap } from '@/api/perms';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { $ti } from '@/lang/input';
import { GLOBAL_DICT } from '@/store/global-dict';
import { useSummary } from '@/hooks/summary';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';
import { TIME_RANGE_TYPE } from '@/tools/date';
import layer from '@/tools/layer';
import GvIcon from '@/components/gv-icon/index.vue';
import { financeRemitTypeLists } from '@/api/finance/remit-type';

const route = useRoute();
const tableRef = shallowRef();
const chipChangeSummaryRef = shallowRef();

const financeActionMap = parseDict(FINANCE_ACTION);

const title = computed(() => $t(route.query.title, route.query) || $t('common.operate_log'));

const changeTypeMap = { inc: 1, dec: 2 }; // 增码，减码
const changeTypeList = [changeTypeMap.inc, changeTypeMap.dec];

const remitList = [70, 71];
const exchangeList = [80];
const signReturnList = [25];
const transferList = [27, 41];

const currencyTypeMap = parseDict(CURRENCY_TYPE_DICT);

const actionList = computed(() => {
  const query = route.query;
  let action = [];
  if (Number(query.cabinet_chip_type_id) === REGULAR_CABINET_TYPE_IDS.code_washing) action = [30, 31];
  if (Number(query.cabinet_chip_type_id) === REGULAR_CABINET_TYPE_IDS.deposit) action = [22, 23];
  if (Number(query.cabinet_chip_type_id) === REGULAR_CABINET_TYPE_IDS.buy) action = [20, 21];
  if (Number(query.cabinet_chip_type_id) === REGULAR_CABINET_TYPE_IDS.sign) action = [24, 25];
  if (Number(query.cabinet_chip_type_id) === REGULAR_CABINET_TYPE_IDS.score) action = [60, 61];
  if (Number(query.cabinet_chip_type_id) === REGULAR_CABINET_TYPE_IDS.exchange) action = [80];
  if (Number(query.cabinet_chip_type_id) === REGULAR_CABINET_TYPE_IDS.remit) action = [70, 71];
  action = action.map((id) => {
    return { ...financeActionMap[id], field: 'action_from' };
  });
  return [
    { name: $t('finance.user_chip_log.code_inc'), value: changeTypeMap.inc, field: 'change_type' },
    { name: $t('finance.user_chip_log.code_dec'), value: changeTypeMap.dec, field: 'change_type' },
    ...action
  ];
});

const actionMap = computed(() => parseDict(actionList.value));

const { optionsData, refresh } = useDictOptions({ currencyConfig: { api: currencyConfigLists, params: { virtual_status: null } } }, true);

const { timeRangeActive, dateRangeType, dateRangeFormat, setTimeRange, getDefaultQuery, clearTimeRangeActive, resetTimeRangeActive, doubleExec } =
  useTimeRange(() => tableRef.value, {
    start: 'create_time_start',
    end: 'create_time_end',
    defActive: TIME_RANGE_TYPE.today,
    defFilterTime: rangeTimeType.create_time
  });

const defaultQuery = computed(() => {
  const query = { ...route.query, ...getDefaultQuery() };
  delete query.title;
  return query;
});

const columns = computed(() => {
  const query = route.query;
  const extendCols = [];
  if (Number(query.cabinet_chip_type_id) === REGULAR_CABINET_TYPE_IDS.remit) {
    extendCols.push({ title: $t('finance.user_chip.remit_type'), dataIndex: 'remittance_type', minWidth: 150 });
    extendCols.push({ title: $t('finance.user_chip.commission'), dataIndex: 'commission', minWidth: 150 });
    extendCols.push({ title: $t('finance.user_chip.mobile'), dataIndex: 'mobile', minWidth: 150 });
    extendCols.push({
      title: $t('finance.user_chip_log.is_member'),
      dataIndex: 'account_type',
      minWidth: 150,
      func: (_, val) => {
        if (!val.account_type) return null;
        return IS_MEMBER.inset === val.account_type ? $t('other.values.yes_no_value_yes') : $t('other.values.yes_no_value_no');
      }
    });
  }
  return [
    { title: $t('common.user_no'), dataIndex: 'username', minWidth: 100, hide: !!defaultQuery.value?.cabinet_chip_type_id },
    {
      title: $t('common.currency_config_no'),
      dataIndex: 'currency_config_id',
      minWidth: 100,
      func_html: true,
      func: (_, val) => {
        const cMap = GLOBAL_DICT.value.currency_config.map;
        const current =
          remitList.includes(val.action_from) && !!val.from_currency_config_id ? cMap[val.from_currency_config_id] : cMap[val.currency_config_id];
        return `<span style="color:${current?.color};">${$ti(current?.name)}</span>`;
      }
    },
    { title: $t('common.log_before_value'), dataIndex: 'before_value', minWidth: 150 },
    { title: $t('log.change_value'), dataIndex: 'left_amount', minWidth: 150 },
    { title: $t('common.log_after_value'), dataIndex: 'after_value', minWidth: 150 },
    ...extendCols,
    { title: $t('log.action_info'), dataIndex: 'action_info', minWidth: 600, func: (_, val) => showActionInfo(_, val).join('->') },
    { title: $t('log.cabinet_name'), dataIndex: 'cabinet_chip_type_name', minWidth: 100, hide: !!defaultQuery.value?.cabinet_chip_type_id },
    { title: $t('common.remark'), dataIndex: 'remark', minWidth: 150 },
    { title: $t('common.operate_person'), dataIndex: 'operator', minWidth: 150 },
    { title: $t('common.operate_time'), dataIndex: 'create_time', minWidth: 180, time: true }
  ];
});

const refreshTable = () => tableRef.value?.refresh();

// 动作参数信息获取
const actionQueryGet = (query) => {
  return query.change_type || query.action_from;
};

// 动作参数信息设置
const actionQuerySet = (query, value) => {
  if (changeTypeList.includes(value)) {
    query.change_type = value;
    query.action_from = null;
  } else {
    query.change_type = null;
    query.action_from = value;
  }
};

// 显示动作信息
const showActionInfo = (_, val) => {
  const cMap = GLOBAL_DICT.value.currency_config.map;
  const aMap = actionMap.value ?? {};
  const currencyIcon = cMap[val.currency_config_id]?.icon;
  const currencyType = cMap[val.currency_config_id]?.type;
  const amount = !!val.left_amount ? currencyIcon + val.left_amount : '0.00';
  if (!!val.action_from) {
    const actionFormName = !!financeActionMap[val.action_from]?.getName
      ? financeActionMap[val.action_from]?.getName(currencyType)
      : financeActionMap[val.action_from]?.name;
    if (remitList.includes(val.action_from)) {
      // 汇入汇出
      const aType =
        IS_MEMBER.inset === val.account_type ? $t('finance.user_chip_log.account_type_inset') : $t('finance.user_chip_log.account_type_outset');
      const result = [$t('common.user_name_no') + ': ' + val.username + `(${aType})`];
      if (!!val.mobile) result.push($t('finance.user_chip.mobile') + ': ' + val.mobile);
      if (!!val.remittance_type) result.push($t('finance.user_chip.remit_type') + ': ' + $ti(val.remittance_type));
      if (!!val.commission) result.push($t('finance.user_chip.commission') + ': ' + val.commission);
      result.push(actionFormName);
      result.push(amount);
      if (!!val.to_currency_config_id)
        result.push($t('finance.user_chip.take_out') + $t('common.currency_config_no') + ': ' + $ti(cMap[val.to_currency_config_id]?.name));
      return result;
    } else if (exchangeList.includes(val.action_from)) {
      // 货币兑换
      return [
        $t('common.user_name_no') + ': ' + val.username,
        $t('finance.user_chip_log.currency_from') + ': ' + $ti(cMap[val.from_currency_config_id]?.name),
        actionFormName,
        $t('finance.user_chip.exchange_amount') + ': ' + val.exchange_amount + ` (${$t('finance.user_chip.exchange_rate')} ${val.rate})`,
        $t('finance.user_chip_log.currency_to') + ': ' + $ti(cMap[val.to_currency_config_id]?.name)
      ];
    } else if (signReturnList.includes(val.action_from)) {
      // 还单
      const typeName = currencyTypeMap[val.pattern]?.name ?? '';
      return [$t('common.user_name_no') + ': ' + val.username, typeName + ' ' + actionFormName, amount];
    } else if (transferList.includes(val.action_from)) {
      // 转码
      return [
        $t('finance.user_chip_log.account_form') + ': ' + val.from_username,
        actionFormName,
        amount,
        $t('finance.user_chip_log.account_to') + ': ' + val.to_username
      ];
    } else {
      // 其他
      return [$t('common.user_name_no') + ': ' + val.username, actionFormName, amount];
    }
  } else {
    return [$t('common.cabinet_no'), aMap[val.change_type]?.name, amount];
  }
};

// 查看统计信息
const showSummaryInfo = async () => {
  const query = tableRef.value?.getQuery();
  if (!query.user_id) return layer.msgError($t('finance.user_chip_log.tips_filter_fail'));
  if (!query.create_time_start) return layer.msgError($t('finance.user_chip_log.tips_filter_fail'));
  refreshTable();
  layer.loading();
  const sInfo = await financeActionsSummary({ ...query });
  layer.closeLoading();
  chipChangeSummaryRef.value?.open({ ...sInfo });
};

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
});
</script>
<style scoped>
.handler-left-wrap {
  position: relative;
  width: 100%;
}
</style>
