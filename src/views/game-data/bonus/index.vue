<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="game_data_bet_bonus-list"
      :request="betBonusList"
      row-key="id"
      :operate-width="160"
      :columns="columns"
      :default-query="defaultQuery"
      delay-request
    >
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="title" @back="backTab($router)" />
        <gv-select-user-inline class="search-item" place-top v-model="query.user_id" :placeholder="$t('common.user_no')" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.winn_lottery"
          :placeholder="$t('game_data.bonus.winn_lottery')"
          :options="YES_NO_VALUE_DICT"
        />
        <gv-select-currency-config
          class="search-item"
          place-top
          v-model="query.currency_config_id"
          :placeholder="$t('common.currency_config_no')"
          :options="optionsData.currencyConfig"
          multiple
        />
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.create_time')"
          v-place
          :clearable="false"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
    </gv-table>
  </div>
</template>

<script setup>
import { betBonusList } from '@/api/game-data/bet';
import { computed, onActivated, onBeforeMount, shallowRef } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { backTab } from '@/store/tabs';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { YES_NO_VALUE_DICT } from '@/values';
import { $t } from '@/lang/i18n';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import { mappingArrayToObject, parseDict } from '@/tools';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import { bounsConfigLists } from '@/api/bouns/config';
import { $ti } from '@/lang/input';
import { GLOBAL_DICT } from '@/store/global-dict';

const defaultQuery = {};

const tableRef = shallowRef();

const title = computed(() => $t('game_data.bonus.title'));

const { optionsData, refresh } = useDictOptions({ currencyConfig: { api: currencyConfigLists }, bonusList: { api: bounsConfigLists } }, true);

const refreshTable = () => tableRef.value?.refresh();

const columns = computed(() => {
  const bonusMap = mappingArrayToObject(optionsData.bonusList ?? []);
  return [
    { title: $t('common.user_no'), dataIndex: 'username', minWidth: 100 },
    { title: $t('common.currency_config_no'), dataIndex: 'currency_config_id', minWidth: 100, dict: GLOBAL_DICT.value.currency_config.mark },
    { title: $t('common.table_no'), dataIndex: 'table_name', minWidth: 100 },
    { title: $t('common.boot_no'), dataIndex: 'boot_number', minWidth: 100 },
    { title: $t('common.round_no'), dataIndex: 'round_number', minWidth: 100 },
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
    { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 },
    { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
    { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true }
  ];
});

onActivated(() => refresh());

onBeforeMount(async () => {
  await refresh();
  await refreshTable();
});
</script>
