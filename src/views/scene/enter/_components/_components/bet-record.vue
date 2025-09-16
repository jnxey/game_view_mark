<template>
  <gv-popup
    ref="popupRef"
    :title="$t('scene.enter.btn_bet_record')"
    custom-class="near-top"
    max-height="calc(92vh - 100px)"
    :async="true"
    :width="popupWidth"
    :show-footer="false"
  >
    <gv-table
      ref="tableRef"
      table-key="scene_enter_bet_record-list"
      :request="betDetailByBootNumber"
      row-key="bet_id"
      select-single
      :operate-width="160"
      :columns="columns"
      :default-query="defaultQuery"
      :handler-list="handleList"
      @selection-change="selectionChange"
      :layout-bottom="layoutBottom"
      delay-request
      show-summary
      :handle-summary="useSummary('bet_id')"
    >
      <template #search-box="{ query, search, reset }">
        <gv-select-user-inline class="search-item" place-top v-model="query.user_id" :placeholder="$t('common.user_no')" />
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.currency_config_id"
          :placeholder="$t('common.currency_config_no')"
          muted
          multiple
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
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left="{ query, search }">
        <el-button type="primary" :disabled="!selectedNow" @click="openEditGwm">
          {{ $t('game_data.bet.btn_gwm') }}
        </el-button>
        <el-button type="primary" :disabled="!selectedNow" @click="openEditGwmBonus">
          {{ $t('game_data.bet.btn_gwm_bonus') }}
        </el-button>
      </template>
      <template #bet_result="{ row }">
        <gv-bet-result-normal :bet-info="row" :kinds-map="kindsMap" :size="40" />
      </template>
      <template #operate-cell="{ row }">
        <el-button link type="primary" @click="handleEdit(row)">
          {{ $t('common.modify_btn') }}
        </el-button>
        <el-button link type="primary" @click="handleEditBonus(row)">
          {{ $t('game_data.bet.btn_edit_bonus') }}
        </el-button>
      </template>
    </gv-table>
    <add-baccarat-gwm ref="addBaccaratGwmRef" @success="refreshTable" />
    <add-general-gwm ref="addGeneralGwmRef" @success="refreshTable" />
    <add-bonus ref="addBonusRef" @success="refreshTable" />
    <edit-baccarat ref="editBaccaratRef" @success="refreshTable" />
    <edit-general ref="editGeneralRef" @success="refreshTable" />
    <edit-bonus ref="editBonusRef" @success="refreshTable" />
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, inject, nextTick, ref, shallowRef, toRaw, unref } from 'vue';
import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT, GAME_MODEL_TYPE_GENERAL, QUERY_LIST_TYPE, YES_NO_VALUE, YES_NO_VALUE_DICT } from '@/values';
import layer from '@/tools/layer';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { betDetailByBootNumber } from '@/api/scene/enter';
import { $t } from '@/lang/i18n';
import { getPX, getWindowSize, mappingArrayToObject, parseDict } from '@/tools';
import GvTable from '@/components/gv-table/index.vue';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import AddBaccaratGwm from '@/views/game-data/bet/_components/add-baccarat-gwm.vue';
import AddGeneralGwm from '@/views/game-data/bet/_components/add-general-gwm.vue';
import EditGeneral from '@/views/game-data/bet/_components/edit-general.vue';
import EditBaccarat from '@/views/game-data/bet/_components/edit-baccarat.vue';
import { useDictOptions } from '@/hooks/dict';
import { gameLists } from '@/api/game/list';
import { gameKindLists } from '@/api/game/kind';
import { currencyConfigLists } from '@/api/currency/config';
import { useBetOpenShow } from '@/hooks/print-show';
import { permsMap } from '@/api/perms';
import { toRoutePath } from '@/router';
import AddBonus from '@/views/game-data/bet/_components/add-bonus.vue';
import EditBonus from '@/views/game-data/bet/_components/edit-bonus.vue';
import { GLOBAL_DICT } from '@/store/global-dict';
import { useSummary } from '@/hooks/summary';
import GvBetResultNormal from '@/components/gv-bet-result-show/normal.vue';

const defaultQuery = {};

const emit = defineEmits(['success', 'close']);
const tableRef = shallowRef();
const popupRef = shallowRef();
const addBaccaratGwmRef = shallowRef();
const addGeneralGwmRef = shallowRef();
const addBonusRef = shallowRef();
const editBaccaratRef = shallowRef();
const editGeneralRef = shallowRef();
const editBonusRef = shallowRef();

const selected = shallowRef([]);

const popupWidth = computed(() => {
  const width = Math.floor(getWindowSize().width * 0.8);
  return getPX(Math.max(width, 900));
});

const layoutBottom = computed(() => {
  const height = Math.floor(getWindowSize().height * 0.06);
  return 75 + height;
});

const { optionsData, refresh } = useDictOptions(
  { game: { api: gameLists }, kinds: { api: gameKindLists }, currencyConfig: { api: currencyConfigLists } },
  true
);

const selectedNow = computed(() => {
  return selected.value[0];
});

const open = async (_query) => {
  layer.loading();
  await refresh();
  layer.closeLoading();
  Object.keys(_query ?? {}).forEach((name) => (defaultQuery[name] = _query[name]));
  popupRef.value?.open();
  await nextTick();
  tableRef.value?.reset();
};

const kindsMap = computed(() => mappingArrayToObject(optionsData.kinds ?? []));

const refreshTable = () => tableRef.value?.refresh();

const columns = computed(() => {
  return [
    { title: $t('game_data.bet.bet_id'), dataIndex: 'bet_id', minWidth: 120 },
    { title: $t('common.user_no'), dataIndex: 'username', minWidth: 100 },
    { title: $t('common.currency_config_no'), dataIndex: 'currency_config_id', minWidth: 100, dict: GLOBAL_DICT.value.currency_config.mark },
    { title: $t('common.boot_no'), dataIndex: 'boot_number', minWidth: 100 },
    { title: $t('common.round_no'), dataIndex: 'round_number', minWidth: 100 },
    { title: $t('game_data.bet.kind_no'), dataIndex: 'game_kind_id', minWidth: 100, dict: parseDict(optionsData.kinds) },
    { title: $t('game_data.bet.amount'), dataIndex: 'amount', minWidth: 100 },
    { title: $t('game_data.bet.rake'), dataIndex: 'rake', minWidth: 100 },
    { title: $t('game_data.bet.bet_result'), dataIndex: 'bet_result', minWidth: 100, printShow: useBetOpenShow(() => unref(kindsMap)) },
    { title: $t('game_data.bet.bet_profit_loss'), dataIndex: 'bet_profit_loss', minWidth: 100 },
    { title: $t('game_data.bet.code_washing'), dataIndex: 'code_washing', minWidth: 100 },
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

// 修改
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

// 补记
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

defineExpose({ open });
</script>
