<template>
  <div class="info-card p-4">
    <div class="bet-info ml-4 fz-12 text-line-1_5">
      <div class="title mb-4 fw-bold" :style="{ color: codeWashChangeTypeMap[infoObj.is_modify]?.color }">
        {{ codeWashChangeTypeMap[infoObj.is_modify]?.name }}
      </div>
      <div class="flex-row flex-wrap align-top">
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.settle_username') }}：</span>
          <span class="info-content">{{ infoObj.settlement_log.username }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.settle_no_value') }}：</span>
          <span class="info-content">{{ infoObj.settlement_log.unsettle_code_washing }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.settle_no_fee') }}：</span>
          <span class="info-content">{{ infoObj.settlement_log.settle_amount }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.settle_balance_fee') }}：</span>
          <span class="info-content">{{ infoObj.settlement_log.after_balance_code_washing_fee }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.settle_real_fee') }}：</span>
          <span class="info-content">{{ infoObj.settlement_log.actual_settle_amount }}</span>
        </div>
        <div class="info-row flex-row align-top">
          <div class="info-label">{{ $t('finance.bet_separate_log.settlement_time') }}：</div>
          <div class="info-content flex-col fz-10">
            <span>{{ dayjs(formatServerTime(infoObj.settlement_log.settler_start_time)).format(getTimeFormat()) }}</span>
            <span>{{ dayjs(formatServerTime(infoObj.settlement_log.settler_end_time)).format(getTimeFormat()) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { formatServerTime, getTimeFormat, parseDict } from '@/tools';
import { $t } from '@/lang/i18n';
import { CODE_WASH_CHANGE_TYPE_DICT } from '@/values';

const codeWashChangeTypeMap = parseDict(CODE_WASH_CHANGE_TYPE_DICT);

const props = defineProps({ infoObj: Object });
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
