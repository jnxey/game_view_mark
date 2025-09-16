<template>
  <div class="bet-record-item fz-14 text-main p-12">
    <div class="title fw-bold mb-16">
      {{ `${$t('common.boot_no')}：${source.boot_number}，${$t('common.round_no')}：${source.round_number}` }}
      <span class="fz-12 ml-12 fw-normal text-placeholder">{{ dayjs(formatServerTime(source.create_time)).format(getTimeFormat()) }}</span>
    </div>
    <div class="flex-row align-center">
      <div class="flex-1">
        <span class="label text-placeholder">{{ $t('common.user_no') }}</span>
        <span class="text ml-8">{{ source.username }}</span>
      </div>
      <div class="flex-1">
        <span class="label text-placeholder">{{ $t('game_data.bet_open.amount') }}</span>
        <span class="text ml-8 text-warning">{{ currencyMap[source.currency_config_id]?.icon }} {{ source.amount }}</span>
      </div>
      <div class="flex-1">
        <span class="label text-placeholder">{{ $t('game_data.bet_open.kind_no') }}</span>
        <span class="text ml-8">{{ gameKindMap[source.game_kind_id]?.name }}</span>
      </div>
      <div class="flex-2 flex-row align-center">
        <span class="label text-placeholder mr-8">{{ $t('game_data.bet_open.loss_profit') }}</span>
        <el-radio-group :model-value="source.is_nn_win">
          <el-radio class="custom-radio" v-for="item in LOSS_WIN_VALUE_DICT" :value="item.value" @click="setIsWin(item.value)">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, unref } from 'vue';
import { formatServerTime, getTimeFormat, mappingArrayToObject } from '@/tools';
import dayjs from 'dayjs';
import { LOSS_WIN_VALUE_DICT } from '@/values';
import { betModify } from '@/api/game-data/bet';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['refresh']);

const props = defineProps({ source: Object, currencyConfig: Array, gameKind: Array });

const currencyMap = computed(() => mappingArrayToObject(unref(props.currencyConfig ?? [])));
const gameKindMap = computed(() => mappingArrayToObject(unref(props.gameKind ?? [])));

const setIsWin = async (value) => {
  await layer.confirm($t('game_data.bet_open.tips_loss_profit_confirm'));
  const params = { id: props.source.id, is_nn_win: value };
  layer.loading();
  await betModify(params);
  layer.closeLoading();
  emit('refresh');
};
</script>
<style scoped lang="scss">
.bet-record-item {
  border-radius: var(--gv-border-radius-mid);
  border: 1px solid var(--el-border-color);
}
</style>
