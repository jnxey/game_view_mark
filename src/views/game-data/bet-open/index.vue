<template>
  <div class="page-wrap">
    <gv-table
      ref="tableRef"
      table-key="bet_open-list"
      :request="betOpenLists"
      :operate-width="160"
      :operate-perms="[permsMap.game_data.bet_open.edit]"
      :columns="columns"
      :default-query="defaultQuery"
    >
      <template #search-box="{ query, search, reset }">
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
          v-model="query.game_id"
          :placeholder="$t('common.game_no')"
          multiple
          :request="gameLists"
          :empty-page="{ perm: permsMap.game.list.view }"
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
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.create_time')"
          v-place
        />
        <gv-daterange-picker
          class="search-item"
          v-model:startTime="query.update_time_start"
          v-model:endTime="query.update_time_end"
          :placeholder="$t('common.update_time')"
          v-place
        />
        <el-button class="search-button" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="search-button" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </template>
      <template #handler-left>
        <el-button
          type="primary"
          v-perms="[permsMap.game_data.bet_open.log]"
          @click="toRoutePath(permsMap.game_data.bet_open.log, { request: betOpenLog.symbol, title: 'game_data.bet_open_log.title' })"
        >
          {{ $t('common.operate_log') }}
        </el-button>
      </template>
      <!--      -->
      <!--      <template #popup-right v-if="checkPerm(permsMap.game_data.bet_open.log)">-->
      <!--        <gv-operate-record :request="betOpenLog" />-->
      <!--      </template>-->
      <template #bet_result="{ row }">
        <gv-bet-result-normal :bet-info="row" :kinds-map="kindsMap" :size="40" />
      </template>
      <template #operate-cell="{ row }">
        <el-button
          link
          type="primary"
          v-perms="[permsMap.game_data.bet_open.edit]"
          @click="handleEdit(row)"
          :disabled="row.game_model === GAME_MODEL.general"
        >
          {{ $t('common.modify_btn') }}
        </el-button>
      </template>
    </gv-table>
    <edit-baccarat ref="editBaccaratRef" @success="refreshTable" />
    <edit-general-niuniu ref="editGeneralNiuniuRef" @success="refreshTable" />
  </div>
</template>

<script setup>
import { betOpenSet, betOpenLists, betOpenLog } from '@/api/game-data/bet-open';
import { computed, shallowRef, unref } from 'vue';
import { GAME_BOOT_STATUS, GAME_BOOT_STATUS_DICT, GAME_MODEL, GAME_MODEL_TYPE_BACCARAT, YES_NO_VALUE_DICT } from '@/values';
import GvTable from '@/components/gv-table/index.vue';
import EditBaccarat from './_components/edit-baccarat.vue';
import { mappingArrayToObject, parseDict } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import { gameKindLists } from '@/api/game/kind';
import GvGameKindIcon from '@/components/gv-game-kind-icon/index.vue';
import { toRoutePath } from '@/router';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { gameLists } from '@/api/game/list';
import { financeTableLists } from '@/api/finance/table';
import EditGeneralNiuniu from '@/views/game-data/bet-open/_components/edit-general-niuniu.vue';
import { getNiuniuResult } from '@/tools/road';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { permsMap } from '@/api/perms';
import { checkPerm } from '@/directives/perms';
import GvOperateRecord from '@/components/gv-operate-record/index.vue';
import { useBetOpenShow } from '@/hooks/print-show';
import { $t } from '@/lang/i18n';
import GvBetResultNormal from '@/components/gv-bet-result-show/normal.vue';

const editBaccaratRef = shallowRef();
const editGeneralNiuniuRef = shallowRef();
const tableRef = shallowRef();

const { optionsData } = useDictOptions({ kinds: { api: gameKindLists } });

const defaultQuery = { status: GAME_BOOT_STATUS.finish };

const kindsMap = computed(() => mappingArrayToObject(optionsData.kinds ?? []));

const columns = shallowRef([
  { title: $t('common.table_no'), dataIndex: 'table_name', minWidth: 100 },
  { title: $t('common.game_no'), dataIndex: 'game_name', minWidth: 100 },
  { title: $t('common.boot_no'), dataIndex: 'boot_number', minWidth: 100 },
  { title: $t('common.round_no'), dataIndex: 'round_number', minWidth: 100 },
  { title: $t('game_data.bet_open.bet_result'), dataIndex: 'bet_result', minWidth: 100, printShow: useBetOpenShow(() => unref(kindsMap)) },
  { title: $t('game_data.bet_open.status'), dataIndex: 'status', minWidth: 100, dict: parseDict(GAME_BOOT_STATUS_DICT) },
  { title: $t('game_data.bet_open.is_close'), dataIndex: 'is_close', minWidth: 100, dict: parseDict(YES_NO_VALUE_DICT) },
  { title: $t('common.close_time'), dataIndex: 'close_time', minWidth: 180, time: true },
  { title: $t('common.create_time'), dataIndex: 'create_time', minWidth: 180, time: true },
  { title: $t('common.update_time'), dataIndex: 'update_time', minWidth: 180, time: true },
  { title: $t('common.operate_person'), dataIndex: 'work_no', minWidth: 100 }
]);

const refreshTable = () => tableRef.value?.refresh();

const handleEdit = async (data) => {
  if (GAME_MODEL_TYPE_BACCARAT.includes(data.game_model)) {
    editBaccaratRef.value?.open(unref(data));
  } else if (data.game_model === GAME_MODEL.niu_niu) {
    editGeneralNiuniuRef.value?.open(unref(data));
  }
};
</script>
