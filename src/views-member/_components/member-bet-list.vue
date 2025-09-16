<template>
  <div class="member-bet-list member-page-wrap">
    <div class="header-left-wrap">
      <header-back />
    </div>
    <div class="header-right-wrap">
      <header-logout />
    </div>
    <div class="content-wrap">
      <div class="search-box flex-row align-center mb-12">
        <gv-select-options class="w-160 mr-12" place-top v-model="query.game_id" :placeholder="$t('common.game_no')" :options="gameList" />
        <gv-select-options class="w-160 mr-12" place-top v-model="query.table_id" :placeholder="$t('common.table_no')" :options="tableList" />
        <el-input
          class="w-160 mr-12"
          v-trim
          v-model="query.boot_number"
          :placeholder="$t('common.boot_no')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <el-input
          class="w-160 mr-12"
          v-trim
          v-model="query.round_number"
          :placeholder="$t('common.round_no')"
          v-place
          clearable
          @keyup.enter="search"
        />
        <gv-daterange-picker
          class="w-160 mr-12"
          v-model:startTime="query.create_time_start"
          v-model:endTime="query.create_time_end"
          :placeholder="$t('common.time_range')"
          :span-month="3"
          v-place
        />
        <el-button class="w-80" type="primary" icon="Search" @click="search">{{ $t('common.search_btn') }}</el-button>
        <el-button class="w-80" icon="RefreshRight" @click="reset">{{ $t('common.reset_btn') }}</el-button>
      </div>
      <gv-full-height ref="fullHeightRef" :bottom="75">
        <el-table :data="pager.lists" border header-cell-class-name="member-bet-header-cell" height="100%">
          <!--          <el-table-column prop="id" :label="$t('views_member.member_bet_list.bet_id')" />-->
          <el-table-column prop="currency_name" :label="$t('views_member.member_bet_list.currency')">
            <template #default="{ row }">
              {{ $ti(row.currency_name) }}
            </template>
          </el-table-column>
          <el-table-column prop="game_name" :label="$t('common.game_no')">
            <template #default="{ row }">
              {{ $ti(row.game_name) }}
            </template>
          </el-table-column>
          <el-table-column prop="table_name" :label="$t('common.table_no')" />
          <el-table-column prop="boot_number" :label="$t('common.boot_no')" />
          <el-table-column prop="round_number" :label="$t('common.round_no')" />
          <el-table-column prop="game_kind_name" :label="$t('views_member.member_bet_list.kind_no')">
            <template #default="{ row }">
              {{ $ti(row.game_kind_name) }}
            </template>
          </el-table-column>
          <el-table-column prop="bet_result" :label="$t('views_member.member_bet_list.bet_result')" show-overflow-tooltip>
            <template #default="{ row }">
              <gv-bet-result-normal :bet-info="row" :kinds-map="kindMap" :size="40" edit-able />
            </template>
          </el-table-column>
          <el-table-column prop="amount" :label="$t('views_member.member_bet_list.amount')" />
          <el-table-column prop="bet_profit_loss" :label="$t('views_member.member_bet_list.bet_profit_loss')">
            <template #default="{ row }">
              <gv-profit :value="row.bet_profit_loss" />
            </template>
          </el-table-column>
          <el-table-column prop="bonus_profit_loss" :label="$t('views_member.member_bet_list.bet_bonus_profit')">
            <template #default="{ row }">
              <gv-profit :value="row.bonus_profit_loss" />
            </template>
          </el-table-column>
          <el-table-column prop="create_time" :label="$t('common.create_time')">
            <template #default="{ row }">
              <span class="fz-12">{{ dayjs(formatServerTime(row.create_time)).format(getTimeFormat()) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </gv-full-height>
      <el-pagination
        class="flex-row justify-end pt-16"
        v-model:current-page="pager.page"
        v-model:page-size="pager.size"
        background
        layout="prev, pager, next"
        :total="pager.count"
        @current-change="getLists"
      />
    </div>
  </div>
</template>
<script setup>
import HeaderBack from './header-back.vue';
import HeaderLogout from './header-logout.vue';
import { usePaging } from '@/hooks/paging';
import axios from 'axios';
import { memberApi } from '@/views-member/_api';
import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT, RESPONSE_CODE } from '@/values';
import layer from '@/tools/layer';
import { computed, onBeforeMount, reactive, ref, shallowRef } from 'vue';
import { memberInfo } from '@/views-member/_store';
import { languageCurrent } from '@/lang';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';
import { getNiuniuResult } from '@/tools/road';
import GvGameKindIcon from '@/components/gv-game-kind-icon/index.vue';
import { executeMethods, formatServerTime, getTimeFormat, mappingArrayToObject } from '@/tools';
import dayjs from 'dayjs';
import GvProfit from '@/components/gv-profit/index.vue';
import GvFullHeight from '@/components/gv-full-height/index.vue';
import { permsMap } from '@/api/perms';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import GvDaterangePicker from '@/components/gv-daterange-picker/index.vue';
import { getTimeRange, TIME_RANGE_TYPE } from '@/tools/date';
import GvBetResultNormal from '@/components/gv-bet-result-show/normal.vue';

const nearDay = getTimeRange(TIME_RANGE_TYPE.seven);

const kindList = shallowRef([]);
const gameList = shallowRef([]);
const tableList = shallowRef([]);

const kindMap = computed(() => mappingArrayToObject(kindList.value));

const { pager, query, getLists, search, reset } = usePaging({
  params: { table_id: '', game_id: '', boot_number: '', round_number: '', create_time_start: nearDay.start, create_time_end: nearDay.end },
  fetchFun: async (params) => {
    layer.loading();
    return axios
      .get(memberApi.betList.url, { params, headers: { Token: memberInfo.token, 'Accept-Language': languageCurrent } })
      .then((res) => {
        layer.closeLoading();
        if (res.data.code !== RESPONSE_CODE.SUCCESS) return layer.msgError(res.data.msg);
        else return Promise.resolve(res.data.data ?? {});
      })
      .catch((err) => {
        layer.closeLoading();
        return layer.msgError(err.message);
      });
  }
});

// 获取投注项列表
const getKinds = async () => {
  await axios
    .get(memberApi.kindList.url, { headers: { Token: memberInfo.token, 'Accept-Language': languageCurrent } })
    .then((res) => {
      if (res.data.code !== RESPONSE_CODE.SUCCESS) return layer.msgError(res.data.msg);
      else return (kindList.value = res.data.data ?? []);
    })
    .catch((err) => {
      return layer.msgError(err.message);
    });
};

// 获取游戏列表
const getGame = async () => {
  await axios
    .get(memberApi.gameList.url, { headers: { Token: memberInfo.token, 'Accept-Language': languageCurrent } })
    .then((res) => {
      if (res.data.code !== RESPONSE_CODE.SUCCESS) return layer.msgError(res.data.msg);
      else return (gameList.value = res.data.data ?? []);
    })
    .catch((err) => {
      return layer.msgError(err.message);
    });
};

// 获取游戏列表
const getTable = async () => {
  await axios
    .get(memberApi.tableList.url, { headers: { Token: memberInfo.token, 'Accept-Language': languageCurrent } })
    .then((res) => {
      if (res.data.code !== RESPONSE_CODE.SUCCESS) return layer.msgError(res.data.msg);
      else return (tableList.value = res.data.data ?? []);
    })
    .catch((err) => {
      return layer.msgError(err.message);
    });
};

onBeforeMount(async () => {
  getGame();
  getTable();
  await getKinds();
  await getLists();
});
</script>
<style lang="scss">
@use '../_style/index.scss';
</style>
<style scoped lang="scss">
.search-box {
}
.el-table {
  ::v-deep(.el-table__header) {
    min-height: 40px;
  }

  ::v-deep(.member-bet-header-cell) {
    font-weight: 500;
    color: var(--el-text-color-primary);
    background-color: var(--el-fill-color-light);

    &.el-table-fixed-column--right,
    &.el-table-fixed-column--left {
      background-color: var(--el-fill-color-light);
    }

    &.cell-light.el-table__cell {
      background-color: var(--el-fill-color-dark);
    }
  }
}
</style>
