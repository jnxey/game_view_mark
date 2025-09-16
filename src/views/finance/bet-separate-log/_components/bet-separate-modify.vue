<template>
  <div class="info-card p-4">
    <div class="bet-info ml-4 fz-12 text-line-1_5">
      <div class="title mb-4 fw-bold flex-row align-center" :style="{ color: codeWashChangeTypeMap[infoObj.is_modify]?.color }">
        <span>{{ codeWashChangeTypeMap[infoObj.is_modify]?.name }}</span>
        <gv-icon v-if="infoObj.username !== infoObj.source_user?.username" name="local-icon-diver" class="fz-14" />
      </div>
      <div class="flex-row flex-wrap align-top">
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.bet_username') }}：</span>
          <span class="info-content">{{ infoObj.source_user?.username }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('common.table_no') }}：</span>
          <span class="info-content">{{ infoObj.table_name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.bet_time') }}：</span>
          <span class="info-content fz-10">
            {{ dayjs(formatServerTime(infoObj.create_time)).format(getTimeFormat()) }}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('common.boot_no') }}：</span>
          <span class="info-content">{{ infoObj.boot_number }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('common.round_no') }}：</span>
          <span class="info-content">
            <span>{{ modifyInfo.old_round }}</span>
            <span v-if="!!modifyInfo.new_round" class="text-danger">
              {{ arrowRight }}
              {{ modifyInfo.new_round }}
            </span>
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('common.kind_no') }}：</span>
          <span class="info-content">
            <span>{{ $ti(kindsMap[modifyInfo.old_kind]?.name) }}</span>
            <span v-if="!!modifyInfo.new_kind" class="text-danger">
              {{ arrowRight }}
              {{ $ti(kindsMap[modifyInfo.new_kind]?.name) }}
            </span>
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('common.currency_config_no') }}：</span>
          <span class="info-content">
            <span>{{ $ti(currencyConfigMap[modifyInfo.old_currency]?.name) }}</span>
            <span v-if="!!modifyInfo.new_currency" class="text-danger">
              {{ arrowRight }}
              {{ $ti(currencyConfigMap[modifyInfo.new_currency]?.name) }}
            </span>
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.amount') }}：</span>
          <span class="info-content">
            <span>{{ modifyInfo.old_amount }}</span>
            <span v-if="!!modifyInfo.new_amount" class="text-danger">
              {{ arrowRight }}
              {{ modifyInfo.new_amount }}
            </span>
          </span>
        </div>
        <div class="info-row flex-row align-top">
          <span class="info-label">{{ $t('finance.bet_separate_log.bet_result') }}：</span>
          <div class="info-content flex-row align-center">
            <gv-bet-result-normal :bet-info="{ ...infoObj, bet_result: modifyInfo.old_bet_result }" :kinds-map="kindsMap" :size="18" />
            <span v-if="!!modifyInfo.new_bet_result" class="text-danger">-></span>
            <gv-bet-result-normal
              v-if="!!modifyInfo.new_bet_result"
              :bet-info="{ ...infoObj, bet_result: modifyInfo.new_bet_result }"
              :kinds-map="kindsMap"
              :size="18"
            />
          </div>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.code_washing') }}：</span>
          <span class="info-content">
            {{ infoObj.code_washing }}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.code_washing_rate') }}：</span>
          <span class="info-content">
            {{ infoObj.code_washing_rate }}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.code_washing_fee') }}：</span>
          <span class="info-content">
            {{ infoObj.code_washing_fee }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { areArraysEqual, formatServerTime, getTimeFormat, parseDict } from '@/tools';
import { $t } from '@/lang/i18n';
import { CODE_WASH_CHANGE_TYPE_DICT } from '@/values';
import { $ti } from '@/lang/input';
import GvBetResultNormal from '@/components/gv-bet-result-show/normal.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import { computed } from 'vue';

const codeWashChangeTypeMap = parseDict(CODE_WASH_CHANGE_TYPE_DICT);

const arrowRight = '->';

const props = defineProps({ infoObj: Object, kindsMap: Object, currencyConfigMap: Object });

const modifyInfo = computed(() => {
  const betInfo = props.infoObj ?? {};
  const result = {};
  result.old_round = betInfo.snapshot_bet?.round_number;
  result.new_round = result.old_round === betInfo.round_number ? null : betInfo.round_number;
  // 投注项
  result.old_kind = betInfo.snapshot_bet?.game_kind_id;
  result.new_kind = result.old_kind === betInfo.game_kind_id ? null : betInfo.game_kind_id;
  // 投注项
  result.old_kind = betInfo.snapshot_bet?.game_kind_id;
  result.new_kind = result.old_kind === betInfo.game_kind_id ? null : betInfo.game_kind_id;
  // 投注金额
  result.old_amount = betInfo.snapshot_bet?.amount;
  result.new_amount = result.old_amount === betInfo.amount ? null : betInfo.amount;
  // 币种
  result.old_currency = betInfo.snapshot_bet?.currency_config_id;
  result.new_currency = result.old_currency === betInfo.currency_config_id ? null : betInfo.currency_config_id;
  // 开牌结果
  result.old_bet_result = betInfo.snapshot_bet?.bet_result;
  result.new_bet_result = areArraysEqual(result.old_bet_result, betInfo.bet_result) ? null : betInfo.bet_result;
  return result;
});
</script>
<style scoped>
.info-card {
  border-radius: var(--gv-border-radius-mid);
  border: 1px solid var(--el-border-color);

  .info-row {
    min-width: 160px;
    margin-right: 4px;
  }
}
</style>
