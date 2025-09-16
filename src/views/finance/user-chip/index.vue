<template>
  <div class="page-wrap">
    <!--    -->
    <cabinet-popup
      :currency="optionsData.currency ?? []"
      :cabinet-list="cabinetData ?? []"
      ref="cabinetRef"
      @refresh="getCabinetData"
      @reset-height="resetHeight"
    />
    <!--    -->
    <gv-table
      v-if="mountTable"
      ref="tableRef"
      row-key="UID"
      table-key="finance_user_chip-list"
      :request="financeUserChipLists"
      delay-request
      :operate-width="160"
      :columns="columns"
      :popup-left-title="$t('common.user_agent')"
      :popup-right-title="$t('common.operate_log')"
      @selection-change="selectionChange"
      :default-query="defaultQuery"
      @refresh="getCabinetData"
      :handler-list="handlerList"
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-user-inline
          class="search-item"
          place-top
          v-model="query.user_id"
          :placeholder="$t('common.user_no')"
          @update:model-value="setUserQuery"
        />
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
          <el-radio-button :label="$t('common.ninety_day')" :value="TIME_RANGE_TYPE.ninetyDay" />
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
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-box>
        <div class="w-full flex-row align-center flex-wrap">
          <gv-buttons-fold
            fold-class="mb-8 ml-12"
            uni-key="finance-user-chip-sub-handler"
            first-item
            :fold-text="$t('finance.user_chip.btn_more_operate')"
            @status-change="tableResizeHeight"
          >
            <el-button class="mb-8" type="primary" @click="toRoutePath(permsMap.finance.cabinet_type.view)">
              {{ $t('finance.cabinet_chip_type.title') }}
            </el-button>
            <el-button class="mb-8" type="primary" @click="toRoutePath(permsMap.finance.remit_type.view)">
              {{ $t('finance.remit_type.title') }}
            </el-button>
            <el-button class="mb-8" type="primary" v-perms="[permsMap.finance.exchange.edit]" @click="handlerExchange">
              {{ $t('finance.user_chip.btn_currency_exchange') }}
            </el-button>
            <el-button class="mb-8" :disabled="disableHandlerChip" type="danger" @click="handlerClear()">
              {{ $t('finance.user_chip.btn_clear') }}
            </el-button>
          </gv-buttons-fold>
          <gv-buttons-fold
            fold-class="mb-8 ml-12"
            uni-key="finance-user-chip-detail"
            :fold-text="$t('finance.user_chip.btn_more_detail')"
            @status-change="tableResizeHeight"
          >
            <!--     会员余额明细     -->
            <el-button
              class="mb-8"
              type="info"
              @click="
                toRoutePath(permsMap.finance.user_chip.log, {
                  sub_type: BALANCE_TYPE.chip_balance.user_unique,
                  title: 'finance.user_chip.btn_balance_log'
                })
              "
            >
              {{ $t('finance.user_chip.btn_balance_log') }}
            </el-button>
            <!--      洗码结算      -->
            <el-button class="mb-8" type="info" v-perms="[permsMap.finance.code_washing.log]" @click="toDetail">
              {{ $t('finance.code_washing.btn_log') }}
            </el-button>
            <el-button class="mb-8" type="info" v-perms="[permsMap.finance.code_washing.bet]" @click="toBetSeparate">
              {{ $t('finance.code_washing.btn_bet') }}
            </el-button>
            <!--     买码明细     -->
            <el-button
              class="mb-8"
              type="info"
              @click="
                toRoutePath(permsMap.finance.user_chip.log, {
                  sub_type: BALANCE_TYPE.cabinet_buy.user_unique,
                  title: 'finance.user_chip.btn_buy_log'
                })
              "
            >
              {{ $t('finance.user_chip.btn_buy_log') }}
            </el-button>
            <!--     转码明细     -->
            <el-button
              class="mb-8"
              type="info"
              @click="
                toRoutePath(permsMap.finance.user_chip.log, {
                  sub_type: BALANCE_TYPE.chip_transfer.user_unique,
                  title: 'finance.user_chip.btn_transfer_log'
                })
              "
            >
              {{ $t('finance.user_chip.btn_transfer_log') }}
            </el-button>
            <!--     寄存明细     -->
            <el-button
              class="mb-8"
              type="info"
              @click="
                toRoutePath(permsMap.finance.user_chip.log, {
                  sub_type: BALANCE_TYPE.deposit_amount.user_unique,
                  title: 'finance.user_chip.btn_deposit_log'
                })
              "
            >
              {{ $t('finance.user_chip.btn_deposit_log') }}
            </el-button>
            <!--     汇款明细     -->
            <el-button
              class="mb-8"
              type="info"
              @click="
                toRoutePath(permsMap.finance.user_chip.log, {
                  sub_type: BALANCE_TYPE.cabinet_remit.user_unique,
                  title: 'finance.user_chip.btn_remit_log'
                })
              "
            >
              {{ $t('finance.user_chip.btn_remit_log') }}
            </el-button>
            <!--    签单明细      -->
            <el-button
              class="mb-8"
              type="info"
              @click="
                toRoutePath(permsMap.finance.user_chip.log, {
                  sub_type: BALANCE_TYPE.sign_amount.user_unique,
                  title: 'finance.user_chip.btn_sign_log'
                })
              "
            >
              {{ $t('finance.user_chip.btn_sign_log') }}
            </el-button>
            <!--     上下分明细     -->
            <el-button
              class="mb-8"
              type="info"
              @click="
                toRoutePath(permsMap.finance.user_chip.log, {
                  sub_type: BALANCE_TYPE.point_amount.user_unique,
                  title: 'finance.user_chip.btn_score_log'
                })
              "
            >
              {{ $t('finance.user_chip.btn_score_log') }}
            </el-button>
            <el-button class="mb-8" type="info" @click="toRoutePath(permsMap.finance.exchange.view)">
              {{ $t('finance.currency_exchange.title') }}
            </el-button>
          </gv-buttons-fold>
        </div>
        <div class="w-full flex-row align-center flex-wrap">
          <el-button
            class="mb-8"
            :disabled="disableHandlerCodeWashing"
            color="#E53935"
            :style="textWhiteColor"
            size="large"
            v-perms="[permsMap.finance.code_washing.settler]"
            @click="handlerCodeWashing"
          >
            {{ $t('finance.code_washing.btn_settler') }}
          </el-button>
          <template v-if="checkPerm([permsMap.finance.user_chip.edit])">
            <el-divider class="mb-8" direction="vertical" />
            <el-button-group type="primary">
              <el-button
                class="mb-8"
                size="large"
                color="#00BFA5"
                :style="textWhiteColor"
                :disabled="disableHandlerChip"
                @click="handlerBalance(BALANCE_TYPE.cabinet_buy, NUMBER_HANDLER.inc)"
              >
                {{ $t('finance.user_chip.btn_buy') }}
              </el-button>
              <el-button
                class="mb-8"
                size="large"
                color="#00BFA5"
                :style="textWhiteColor"
                :disabled="disableHandlerChip"
                @click="handlerBalance(BALANCE_TYPE.cabinet_buy, NUMBER_HANDLER.dec)"
              >
                {{ $t('finance.user_chip.btn_cash') }}
              </el-button>
              <el-button class="mb-8" size="large" color="#00BFA5" :style="textWhiteColor" @click="handlerTransfer">
                {{ $t('finance.user_chip.btn_transfer') }}
              </el-button>
            </el-button-group>
            <el-divider class="mb-8" direction="vertical" />
            <el-button-group type="primary">
              <el-button
                class="mb-8"
                size="large"
                color="#42A5F5"
                :style="textWhiteColor"
                :disabled="disableHandler"
                @click="handlerBalance(BALANCE_TYPE.deposit_amount, NUMBER_HANDLER.inc)"
              >
                {{ $t('finance.user_chip.btn_save') }}
              </el-button>
              <el-button
                class="mb-8"
                size="large"
                color="#42A5F5"
                :style="textWhiteColor"
                :disabled="disableHandler"
                @click="handlerBalance(BALANCE_TYPE.deposit_amount, NUMBER_HANDLER.dec)"
              >
                {{ $t('finance.user_chip.btn_take') }}
              </el-button>
            </el-button-group>
            <el-divider class="mb-8" direction="vertical" />
            <el-button-group type="primary">
              <el-button
                class="mb-8"
                color="#e59217"
                :style="textWhiteColor"
                size="large"
                :disabled="disableHandlerCashOnly"
                @click="handlerRemit(NUMBER_HANDLER.inc)"
              >
                {{ $t('finance.user_chip.btn_remit_in') }}
              </el-button>
              <el-button class="mb-8" color="#e59217" :style="textWhiteColor" size="large" @click="handlerRemit(NUMBER_HANDLER.dec)">
                {{ $t('finance.user_chip.btn_remit_out') }}
              </el-button>
            </el-button-group>
            <el-divider class="mb-8" direction="vertical" />
            <el-button-group type="primary">
              <el-button
                class="mb-8"
                size="large"
                color="#AB47BC"
                :style="textWhiteColor"
                :disabled="disableHandler"
                @click="handlerBalance(BALANCE_TYPE.sign_amount, NUMBER_HANDLER.inc)"
              >
                {{ $t('finance.user_chip.btn_sign') }}
              </el-button>
              <el-button
                class="mb-8"
                size="large"
                color="#AB47BC"
                :style="textWhiteColor"
                :disabled="disableHandler"
                @click="handlerBalance(BALANCE_TYPE.sign_amount, NUMBER_HANDLER.dec)"
              >
                {{ $t('finance.user_chip.btn_return') }}
              </el-button>
            </el-button-group>
            <el-divider class="mb-8" direction="vertical" />
            <el-button-group type="primary">
              <el-button
                class="mb-8"
                size="large"
                color="#66BB6A"
                :style="textWhiteColor"
                :disabled="disableHandler"
                @click="handlerBalance(BALANCE_TYPE.point_amount, NUMBER_HANDLER.inc)"
              >
                {{ $t('finance.user_chip.btn_score_up') }}
              </el-button>
              <el-button
                class="mb-8"
                size="large"
                color="#66BB6A"
                :style="textWhiteColor"
                :disabled="disableHandler"
                @click="handlerBalance(BALANCE_TYPE.point_amount, NUMBER_HANDLER.dec)"
              >
                {{ $t('finance.user_chip.btn_score_down') }}
              </el-button>
            </el-button-group>
          </template>
        </div>
      </template>
      <template #handler-left="{ query, search, reset, tableExtend }">
        <gv-select-currency-config-handler
          v-model="query.currency_config_id"
          :options="currencyAble"
          at-least-one
          @update:model-value="executeMethods(search, () => selectCache.setItem(query.currency_config_id))"
        />
        <div class="flex-row align-center">
          <span class="mr-8">{{ $t('finance.user_chip.btn_tips_empty') }}</span>
          <el-switch v-model="isFilterZero" :active-value="true" :inactive-value="false" @change="handlerEmpty" />
          <span class="ml-16 mr-8">{{ $t('finance.user_chip.btn_tips_subs') }}</span>
          <el-switch v-model="query.is_show_all" :active-value="YES_NO_VALUE.yes" :inactive-value="YES_NO_VALUE.no" @change="search" />
        </div>
        <div class="flex-row align-center" v-if="tableExtend">
          <span class="ml-12 mr-4 fz-12 text-placeholder">{{ $t('finance.user_chip.sum_balance') }}</span>
          <el-statistic :value="tableExtend.countChipBalance" />
          <span class="ml-12 mr-4 fz-12 text-placeholder">{{ $t('finance.user_chip.sum_deposit') }}</span>
          <el-statistic :value="tableExtend.countDepositAmount" />
          <span class="ml-12 mr-4 fz-12 text-placeholder">{{ $t('finance.user_chip.sum_sign') }}</span>
          <el-statistic :value="tableExtend.countSignAmount" />
          <!--          <span class="ml-12 mr-4 fz-12 text-placeholder">洗码费合计</span>-->
          <!--          <el-statistic :value="tableExtend.countCodeWashing" />-->
        </div>
      </template>
      <!--      -->
      <template #popup-left="{ height, offset }">
        <gv-user-tree ref="userTreeRef" @selected="selectedParent" :all-title="$t('report.user.agent_top')" :height="height" :offset="offset" />
      </template>
      <!--        -->
      <template #popup-right>
        <gv-operate-record :request="financeUserLog" />
      </template>
      <template #username="{ row }">
        <span :style="{ color: LEVEL_COLOR_MAP[row.level_path] }">{{ row.username }}</span>
      </template>
    </gv-table>
    <balance-popup ref="balanceRef" @success="refreshData" />
    <exchange-popup ref="exchangeRef" :currency="currencyCash ?? []" @success="refreshData" />
    <transfer-popup ref="transferRef" @success="refreshData" />
    <remit-popup v-if="!!optionsData.currency" ref="remitRef" @success="refreshData" :currency="optionsData.currency" />
    <washing-popup ref="washingRef" @success="refreshTable" />
    <washing-all-popup ref="washingAllRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { financeUserChipClear, financeUserChipLists, financeUserLog } from '@/api/finance/user-chip';
import { computed, nextTick, onBeforeMount, ref, shallowRef } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import { CACHE_USER_CHIP_SELECT } from '@/values/cache';
import { CURRENCY_TYPE, QUERY_LIST_TYPE, NUMBER_HANDLER, YES_NO_VALUE, STATUS_VALUE, LEVEL_COLOR_MAP, USER_TREE_ALL_KEY } from '@/values';
import { storage } from '@/tools/storage';
import { calcAmount, checkIndexArray, executeMethods, getBaseImagUrl, getListInfoById, mappingArrayToObject, parseDict } from '@/tools';
import { BALANCE_TYPE, CABINET_CHIP_FIELD } from '@/views/finance/user-chip/_model';
import BalancePopup from './_components/balance.vue';
import CabinetPopup from './_components/cabinet.vue';
import ExchangePopup from './_components/exchange.vue';
import TransferPopup from './_components/transfer.vue';
import RemitPopup from './_components/remit.vue';
import layer from '@/tools/layer';
import { toRoutePath } from '@/router';
import { financeCabinetChipTypeLists } from '@/api/finance/cabinet-chip-type';
import { financeCurrencyExchangeLists, financeCurrencyExchangeSet } from '@/api/finance/currency-exchange';
import { financeCabinetChipLists } from '@/api/finance/cabinet-chip';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { financeCodeWashingList, financeCodeWashingSettler, financeCodeWashingSettlerLog } from '@/api/finance/code-washing';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';
import GvSelectCurrencyConfigHandler from '@/components/gv-select-currency/config-handler.vue';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import { $ti } from '@/lang/input';
import { GLOBAL_DICT } from '@/store/global-dict';
import { checkPerm } from '@/directives/perms';
import { rangeTimeType, useTimeRange } from '@/hooks/time-range';
import { TIME_RANGE_TYPE } from '@/tools/date';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import WashingPopup from '@/views/finance/user-chip/_components/washing.vue';
import WashingAllPopup from '@/views/finance/user-chip/_components/washing-all.vue';
import GvButtonsFold from '@/components/gv-buttons-fold/index.vue';
import GvUserTree from '@/components/gv-user-tree/index.vue';

const textWhiteColor = '--el-button-text-color:#ffffff;--el-button-hover-text-color:#ffffff;';

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
} = useTimeRange(() => tableRef.value, { defFilterTime: rangeTimeType.create_time, defActive: TIME_RANGE_TYPE.ninetyDay }, true);

const defaultQuery = { is_show_all: YES_NO_VALUE.yes, ...getDefaultQuery() };

const mountTable = ref(false);
const balanceRef = shallowRef();
const tableRef = shallowRef();
const cabinetRef = shallowRef();
const exchangeRef = shallowRef();
const transferRef = shallowRef();
const remitRef = shallowRef();
const washingRef = shallowRef();
const washingAllRef = shallowRef();
const userTreeRef = shallowRef();
const selected = shallowRef([]);
const cabinetData = shallowRef([]);
const isFilterZero = shallowRef(true);

const { optionsData, refresh } = useDictOptions({ currency: { api: currencyConfigLists, params: { virtual_status: null } } }, true);

const currencyMap = computed(() => mappingArrayToObject(optionsData.currency));

const selectedNow = computed(() => {
  const selects = selected.value ?? [];
  return selects.length === 1 ? selects[0] : null;
});

const disableHandler = computed(() => {
  return !selectedNow.value;
});

const disableHandlerChip = computed(() => {
  const now = selectedNow.value;
  const cMap = currencyMap.value;
  return !(!!now && cMap[now.currency_config_id]?.type === CURRENCY_TYPE.chips);
});

const disableHandlerCashOnly = computed(() => {
  const now = selectedNow.value;
  const cMap = currencyMap.value;
  if (!now) return false;
  return !(!!now && cMap[now.currency_config_id]?.type === CURRENCY_TYPE.cash);
});

const disableHandlerCodeWashing = computed(() => {
  const selects = selected.value ?? [];
  return selects.length <= 0;
});

const currencyAble = computed(() => {
  const currency = optionsData.currency ?? [];
  return currency.filter((val) => val.virtual_status === YES_NO_VALUE.no);
});

const currencyCash = computed(() => {
  const currency = optionsData.currency ?? [];
  return currency.filter((val) => val.virtual_status === YES_NO_VALUE.no && val.type === CURRENCY_TYPE.cash);
});

const columns = computed(() => {
  const globalCurrencyMark = GLOBAL_DICT.value.currency_config.mark;
  const globalCurrencyMap = GLOBAL_DICT.value.currency_config.map;
  return [
    { title: $t('common.user_no'), dataIndex: 'username', minWidth: 100 },
    { title: $t('common.currency_config_no'), dataIndex: 'currency_config_id', minWidth: 100, dict: globalCurrencyMark },
    {
      title: $t('finance.user_chip.chip_balance'),
      dataIndex: 'chip_balance',
      minWidth: 100,
      func: (_, row) => {
        return globalCurrencyMap[row.currency_config_id]?.type === CURRENCY_TYPE.cash ? '-' : row.chip_balance;
      }
    },
    { title: $t('finance.user_chip.chip_deposit'), dataIndex: 'deposit_amount', minWidth: 100 },
    { title: $t('finance.user_chip.chip_sign'), dataIndex: 'sign_amount', minWidth: 100 },
    { title: $t('finance.code_washing.total_code_washing'), dataIndex: 'total_code_washing', minWidth: 100 },
    { title: $t('finance.code_washing.total_code_washing_fee'), dataIndex: 'total_code_washing_fee', minWidth: 100 },
    { title: $t('finance.code_washing.mistake_code_washing_fee'), dataIndex: 'mistake_code_washing_fee', minWidth: 100 },
    { title: $t('finance.code_washing.balance_code_washing_fee'), dataIndex: 'balance_code_washing_fee', minWidth: 100 },
    {
      title: $t('finance.code_washing.can_code_washing_fee'),
      dataIndex: 'can_code_washing_fee',
      minWidth: 100,
      func: (_, row) => {
        return calcAmount(Number(row.balance_code_washing_fee) + Number(row.mistake_code_washing_fee) + Number(row.total_code_washing_fee), false);
      }
    },
    { title: $t('finance.user_chip.user_remark'), dataIndex: 'permissions_desc', minWidth: 150 }
  ];
});

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.user_chip_list, () => currencyAble.value);

// 选项缓存
const filterCache = useSelectCache(SELECT_CACHE_KEYS.user_chip_filter);

// 刷新表格
const refreshTable = () => tableRef.value?.refresh();

// 重置表格高度
const resetHeight = () => tableRef.value?.resetTableHeight();

// 初始化参数
const initQuery = async () => {
  await refresh();
  defaultQuery.currency_config_id = selectCache.getItem();
  isFilterZero.value = filterCache.getItem() ?? true;
  tableRef.value?.resetDefaultQuery();
};

// 处理列表数据
const handlerList = (list) => {
  if (!isFilterZero.value) return list;
  return list.filter((val) => {
    const { total_code_washing, total_code_washing_fee, mistake_code_washing_fee, balance_code_washing_fee } = val ?? {};
    return (
      Number(total_code_washing) !== 0 ||
      Number(total_code_washing_fee) !== 0 ||
      Number(mistake_code_washing_fee) !== 0 ||
      Number(balance_code_washing_fee) !== 0
    );
  });
};

// 不看空数据
const handlerEmpty = () => {
  refreshTable();
  filterCache.setItem(isFilterZero.value);
};

// 转码
const handlerTransfer = () => {
  transferRef.value?.open(BALANCE_TYPE.chip_transfer_type.manager, selectedNow.value?.user_id, selectedNow.value?.currency_config_id);
};

// 余额变更操作
const handlerBalance = async (type, handler) => {
  const { cabinet_chip_type_id } = type;
  const now = selectedNow.value;
  const username = now.username;
  const currency_config_id = now.currency_config_id;
  const currency = getListInfoById(currency_config_id, currencyAble.value);
  const title = !!type.getTitle ? type.getTitle(handler, currency.type) : type.amount_types[handler];
  const params = { cabinet_chip_type_id, currency_config_id, user_ids: [now.user_id], amount_type: handler, total_amount: null };
  balanceRef.value?.open(title, username, currency.icon, params);
};

// 汇款操作
const handlerRemit = async (handler) => {
  const now = selectedNow.value ?? {};
  const { username, currency_config_id } = now;
  const params = { username, currency_config_id };
  remitRef.value?.open(handler, params);
};

// 余额清0操作
const handlerClear = async () => {
  const currency = getListInfoById(selectedNow.value.currency_config_id, currencyAble.value);
  const { value } = await layer.password(
    $t('finance.user_chip.tips_confirm_clear', { username: selectedNow.value.username, currency: $ti(currency.name) })
  );
  const params = { password: value, currency_config_id: selectedNow.value.currency_config_id, user_ids: [selectedNow.value.user_id] };
  await financeUserChipClear(params);
  refreshData();
  layer.msgSuccess($t('finance.user_chip.clear_balance_success'));
};

// 货币兑换
const handlerExchange = async () => {
  exchangeRef.value?.open(selectedNow.value?.username);
};

// 选中行变更
const selectionChange = (rows) => {
  selected.value = rows;
};

// 查询柜子列表
const getCabinetData = async () => {
  const { lists } = await financeCabinetChipLists({ page_type: QUERY_LIST_TYPE.all });
  cabinetData.value = lists ?? [];
};

// 刷新数据
const refreshData = () => {
  refreshTable();
  getCabinetData();
};

// 洗码费结算操作
const handlerCodeWashing = async () => {
  const selects = selected.value ?? [];
  const { time_start, time_end, filter_time } = tableRef.value?.getQuery();
  const { code_washing_sn } = tableRef.value?.getExtend();
  if (!!selectedNow.value) {
    const { currency_config_id, username, total_code_washing_fee, mistake_code_washing_fee, balance_code_washing_fee } = selectedNow.value ?? {};
    const currency = getListInfoById(currency_config_id, optionsData.currency);
    const other = {
      total_code_washing_fee: Number(total_code_washing_fee),
      mistake_code_washing_fee: Number(mistake_code_washing_fee),
      balance_code_washing_fee: Number(balance_code_washing_fee)
    };
    const params = { code_washing_sn, currency_config_id, time_start, time_end, filter_time, user_id: selectedNow.value.user_id, total_amount: null };
    washingRef.value?.open($t('finance.code_washing.title'), username, currency.icon, params, other);
  } else if (selects.length > 1) {
    const users = selects.map((item) => ({ user_id: item.user_id, settler_amount: 0, currency_config_id: item.currency_config_id }));
    const params = { code_washing_sn, time_start, time_end, filter_time, settler_users: [...users], cabinet_chip_type_id: 1 };
    washingAllRef.value?.open($t('finance.code_washing.title'), params);
  }
};

// 前往结算明细
const toDetail = () => {
  const { user_id, username } = selectedNow.value ?? {};
  const params = { user_ids: user_id };
  const suffix = !!user_id ? '-' + username : '';
  toRoutePath(permsMap.finance.code_washing.log, {
    ...params,
    request: financeCodeWashingSettlerLog.symbol,
    title: 'finance.code_washing.btn_log',
    suffix: suffix
  });
};

// 前往投注分账明细
const toBetSeparate = () => {
  const { user_id, username } = selectedNow.value ?? {};
  const params = { user_ids: user_id };
  const suffix = !!user_id ? '-' + username : '';
  toRoutePath(permsMap.finance.code_washing.bet, {
    ...params,
    request: financeCodeWashingSettlerLog.symbol,
    title: 'finance.code_washing.btn_bet',
    suffix: suffix
  });
};

// 选中代理
const selectedParent = async ({ id }) => {
  tableRef.value?.setQuery('user_id', id);
  tableRef.value?.search();
};

// 设置左侧选中节点
const setUserQuery = () => {
  const { user_id } = tableRef.value?.getQuery();
  userTreeRef.value?.setSelected(user_id || USER_TREE_ALL_KEY);
};

// 动态计算表格高度
const tableResizeHeight = async () => {
  await nextTick();
  tableRef.value?.resetTableHeight();
};

onBeforeMount(async () => {
  layer.loading();
  await initQuery();
  await getCabinetData();
  layer.closeLoading();
  mountTable.value = true;
  await nextTick();
  tableRef.value?.search();
});
</script>
