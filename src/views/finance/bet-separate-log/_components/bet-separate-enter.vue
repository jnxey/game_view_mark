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
          <span class="info-content">{{ infoObj.round_number }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('common.kind_no') }}：</span>
          <span class="info-content">{{ $ti(infoObj.game_kind_name) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('common.currency_config_no') }}：</span>
          <span class="info-content">{{ $ti(currencyConfigMap[infoObj.currency_config_id]?.name) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('finance.bet_separate_log.amount') }}：</span>
          <span class="info-content">{{ infoObj.amount }}</span>
        </div>
        <div class="info-row flex-row align-top">
          <span class="info-label">{{ $t('finance.bet_separate_log.bet_result') }}：</span>
          <span class="info-content">
            <gv-bet-result-normal :bet-info="infoObj" :kinds-map="kindsMap" :size="18" />
          </span>
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
import { formatServerTime, getTimeFormat, parseDict } from '@/tools';
import { $t } from '@/lang/i18n';
import { CODE_WASH_CHANGE_TYPE_DICT } from '@/values';
import { $ti } from '@/lang/input';
import GvBetResultNormal from '@/components/gv-bet-result-show/normal.vue';
import GvIcon from '@/components/gv-icon/index.vue';

const codeWashChangeTypeMap = parseDict(CODE_WASH_CHANGE_TYPE_DICT);

const props = defineProps({ infoObj: Object, kindsMap: Object, currencyConfigMap: Object });
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
