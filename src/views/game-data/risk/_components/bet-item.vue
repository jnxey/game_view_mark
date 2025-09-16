<template>
  <div class="bet-item fz-14 text-main p-12" :class="lastMark">
    <div class="title fw-bold mb-16">
      {{
        `${$t('common.table_no')}：${source.table_name}，${$t('common.boot_no')}：${source.boot_number}，${$t('common.round_no')}：${source.round_number}`
      }}
      <span class="fz-12 ml-12 fw-normal text-placeholder">{{ dayjs(formatServerTime(source.create_time)).format(getTimeFormat()) }}</span>
    </div>
    <div class="flex-row align-center">
      <div class="flex-1">
        <span class="label text-placeholder">{{ $t('common.user_no') }}</span>
        <span class="text ml-8">{{ source.username }}</span>
      </div>
      <div class="flex-1">
        <span class="label text-placeholder">{{ $t('game_data.risk.amount') }}</span>
        <span class="text ml-8">{{ $ti(source.currency_config_name) }} {{ source.amount }}</span>
      </div>
      <div class="flex-1">
        <span class="label text-placeholder">{{ $t('game_data.risk.kind_no') }}</span>
        <span class="text ml-8">{{ $ti(kinds[source.game_kind_id]?.name) }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';
import { formatServerTime, getTimeFormat } from '@/tools';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const props = defineProps({ source: Object, kinds: Object, index: Number });

const lastMark = computed(() => {
  if (props.index === 0) return 'rank-1';
  if (props.index === 1) return 'rank-2';
  if (props.index === 2) return 'rank-3';
});
</script>
<style scoped lang="scss">
@mixin rank-mark {
  position: absolute;
  top: 0;
  right: 0;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  color: var(--el-color-white);
  border-radius: 0 0 0 var(--gv-border-radius-big);
}

.bet-item {
  position: relative;
  border-radius: var(--gv-border-radius-big);
  border: 1px solid var(--el-border-color);
  background-color: var(--el-bg-color);
  overflow: hidden;

  &.rank-1 {
    &:after {
      content: '1';
      background-color: var(--el-color-danger);
      @include rank-mark;
    }
  }

  &.rank-2 {
    &:after {
      content: '2';
      background-color: var(--el-color-danger-light-3);
      @include rank-mark;
    }
  }

  &.rank-3 {
    &:after {
      content: '3';
      background-color: var(--el-color-danger-light-7);
      @include rank-mark;
    }
  }
}
</style>
