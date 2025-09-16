<template>
  <div class="bet-record-item fz-14 text-main p-12">
    <div class="title fw-bold mb-16">
      {{ `${$t('scene.enter.label_tc_boot')}：${source.boot_number}，${$t('scene.enter.label_tc_round')}：${source.round_number}` }}
      <span class="fz-12 ml-12 fw-normal text-placeholder">{{ dayjs(formatServerTime(source.create_time)).format(getTimeFormat()) }}</span>
    </div>
    <div class="flex-row align-center">
      <div class="flex-1">
        <span class="label text-placeholder">{{ $t('common.user_no') }}</span>
        <span class="text ml-8">{{ source.username }}</span>
      </div>
      <div class="flex-1">
        <span class="label text-placeholder">{{ $t('scene.enter.label_tc_amount') }}</span>
        <span class="text ml-8 text-warning">{{ currencyMap[source.currency_config_id]?.icon }} {{ source.amount }}</span>
      </div>
      <div class="flex-1">
        <span class="label text-placeholder">{{ $t('scene.enter.label_tc_kind') }}</span>
        <span class="text ml-8">{{ $ti(gameKindMap[source.game_kind_id]?.name) }}</span>
      </div>
      <template v-if="isGeneral">
        <div class="flex-1_5 flex-row align-center">
          <span class="label text-placeholder mr-16">{{ $t('scene.enter.label_tc_loss_win') }}</span>
          <template v-if="current">
            <el-radio-group :model-value="source.is_nn_win">
              <el-radio class="custom-radio" v-for="item in LOSS_WIN_VALUE_DICT" :value="item.value" @click="setIsWin(item.value)">
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </template>
          <template v-else>
            <span class="text ml-8">{{ lossWinMap[source.is_nn_win]?.name }}</span>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, unref } from 'vue';
import { formatServerTime, getTimeFormat, mappingArrayToObject } from '@/tools';
import dayjs from 'dayjs';
import { LOSS_WIN_VALUE_DICT } from '@/values';
import { betModify } from '@/api/game-data/bet';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const currencyConfig = inject('currencyConfig');
const gameKindMap = inject('gameKindMap');
const isGeneral = inject('isGeneral');

const emit = defineEmits(['refresh']);

const props = defineProps({ source: Object, current: Boolean });

const currencyMap = computed(() => mappingArrayToObject(unref(currencyConfig)));

const setIsWin = async (value) => {
  await layer.confirm($t('scene.enter.tips_confirm_modify_bet_loss_win'));
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
