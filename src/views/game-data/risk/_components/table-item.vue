<template>
  <div class="table-item mb-16" :data-test="isBaccarat">
    <div class="table-title fz-16 fw-bold">{{ $t('common.table_no') }}：{{ tableInfo.table_name }}</div>
    <div class="table-content">
      <div class="profit-item mb-12">
        <span>{{ $t('game_data.risk.title_profit_today') }}:</span>
        <span class="ml-8" v-for="item in tableProfit" :key="item.currency_id">
          {{ item.icon }}
          <gv-profit :value="item.total_bet_profit_loss" />
        </span>
      </div>
      <div class="profit-item mb-12">
        <span>{{ $t('game_data.risk.title_profit_boot') }}:</span>
        <span class="ml-8" v-for="item in bootProfit" :key="item.currency_id">
          {{ item.icon }}
          <gv-profit :value="item.total_bet_profit_loss" />
        </span>
      </div>
      <template v-if="isBaccarat">
        <road-baccarat :size="160" :bet-results="betResults" :kinds="kinds" />
      </template>
      <template v-if="isNiuNiu">
        <road-niuniu :size="160" :bet-results="betResults" />
      </template>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import GvProfit from '@/components/gv-profit/index.vue';
import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT } from '@/values';
import RoadBaccarat from './_components/road-baccarat.vue';
import RoadNiuniu from './_components/road-niuniu.vue';
import { $t } from '@/lang/i18n';

const props = defineProps({ tableInfo: Object, kinds: Object });

const bootProfit = computed(() => props.tableInfo?.boot_profit ?? []);
const tableProfit = computed(() => props.tableInfo?.table_profit ?? []);
const betResults = computed(() => props.tableInfo?.bet_results ?? []);

const isBaccarat = computed(() => GAME_MODEL_TYPE_BACCARAT.includes(betResults.value[0]?.game_model));
const isNiuNiu = computed(() => betResults.value[0]?.game_model === GAME_MODEL.niu_niu);
</script>
<style lang="scss" scoped>
$handler-box-height: 40px;

.table-item {
  position: relative;
  padding-top: $handler-box-height;
  border-radius: var(--gv-border-radius-big);
  overflow: hidden;

  .table-title {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: $handler-box-height;
    padding: 0 16px;
    background-color: var(--el-fill-color-light);
  }

  .table-content {
    padding: 16px;
    background-color: var(--el-bg-color);
  }
}
</style>
