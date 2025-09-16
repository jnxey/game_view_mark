<template>
  <div class="page-wrap">
    <gv-table ref="tableRef" table-key="game_data_bet_open_log-list" :request="requestTable" :columns="columns" :delay-request="!requestTable">
      <template #search-box="{ query, search, reset }">
        <el-page-header class="pb-16" :content="title" @back="backTab($router)" />
        <gv-select-options
          class="search-item"
          place-top
          v-model="query.action"
          :placeholder="$t('common.operate_type')"
          :options="LOG_OPERATOR_TYPE_DICT"
        />
        <el-input class="search-item" v-trim v-model="query.operator" :placeholder="$t('common.operate_person')" clearable @keyup.enter="search" />
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.operate_time')"
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #before_value="{ row }">
        <template v-if="!!row.before_value">
          <gv-bet-result-normal :bet-info="{ ...row, bet_result: getJSON(row.before_value, []) }" :kinds-map="kindsMap" :size="40" />
        </template>
      </template>
      <template #after_value="{ row }">
        <template v-if="!!row.after_value">
          <gv-bet-result-normal :bet-info="{ ...row, bet_result: getJSON(row.after_value, []) }" :kinds-map="kindsMap" :size="40" />
        </template>
      </template>
    </gv-table>
  </div>
</template>
<script setup>
import { computed, shallowRef, unref } from 'vue';
import GvTable from '@/components/gv-table/index.vue';
import { backTab } from '@/store/tabs';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { useRoute } from 'vue-router';
import { betOpenLog } from '@/api/game-data/bet-open';
import { getJSON, mappingArrayToObject, parseDict } from '@/tools';
import { GAME_MODEL, LOG_OPERATOR_TYPE_DICT } from '@/values';
import { useDictOptions } from '@/hooks/dict';
import { gameKindLists } from '@/api/game/kind';
import GvGameKindIcon from '@/components/gv-game-kind-icon/index.vue';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { getNiuniuResult } from '@/tools/road';
import { useBetOpenShow } from '@/hooks/print-show';
import { $t } from '@/lang/i18n';
import GvBetResultNormal from '@/components/gv-bet-result-show/normal.vue';

const route = useRoute();

const { optionsData } = useDictOptions({ kinds: { api: gameKindLists } });

const kindsMap = computed(() => mappingArrayToObject(optionsData.kinds ?? []));

const title = computed(() => $t(route.query.title, route.query) || $t('common.operate_log'));

const requestTable = computed(() => {
  if (route.query.request === betOpenLog.symbol) return betOpenLog;
});

const columns = shallowRef([
  { title: $t('common.game_no'), dataIndex: 'game_name', minWidth: 100 },
  { title: $t('common.table_no'), dataIndex: 'table_name', minWidth: 100 },
  { title: $t('common.boot_no'), dataIndex: 'boot_number', minWidth: 100 },
  { title: $t('common.round_no'), dataIndex: 'round_number', minWidth: 100 },
  {
    title: $t('common.log_before_value'),
    dataIndex: 'before_value',
    minWidth: 150,
    printShow: useBetOpenShow(
      () => unref(kindsMap),
      (r) => getJSON(r.before_value)
    )
  },
  {
    title: $t('common.log_after_value'),
    dataIndex: 'after_value',
    minWidth: 150,
    printShow: useBetOpenShow(
      () => unref(kindsMap),
      (r) => getJSON(r.after_value)
    )
  },
  { title: $t('common.operate_type'), dataIndex: 'action', minWidth: 150, dict: parseDict(LOG_OPERATOR_TYPE_DICT) },
  { title: $t('common.operate_person'), dataIndex: 'operator', minWidth: 150 },
  { title: $t('common.operate_time'), dataIndex: 'create_time', minWidth: 180, time: true }
]);
</script>
