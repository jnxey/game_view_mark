<template>
  <el-input class="select-round-btn" :model-value="roundNumber" :class="customClass" readonly>
    <template #append>
      <el-button type="primary" @click="openSelect">{{ $t('common.select') }}</el-button>
    </template>
  </el-input>
  <select-round-popover ref="selectRoundPopoverRef" />
</template>
<script setup>
import { shallowRef } from 'vue';
import SelectRoundPopover from '@/views/game-data/bet/_components/select-round-popover.vue';
import { $t } from '@/lang/i18n';

const selectRoundPopoverRef = shallowRef();

const props = defineProps({ fromInfo: Object, customClass: String, roundNumber: { type: [String, Number], default: '' } });

const emit = defineEmits(['update:roundNumber', 'update:openId']);

const openSelect = () => {
  const data = props.fromInfo;
  const info = {
    id: data.open_id,
    bet_result: data.bet_result,
    boot_id: data.boot_id,
    boot_number: data.boot_number,
    close_time: data.close_datetime,
    game_id: data.game_id,
    game_model: data.game_model,
    game_name: data.game_name,
    round_number: data.round_number,
    table_id: data.table_id,
    table_name: data.table_name
  };
  selectRoundPopoverRef.value?.open(info, (item) => {
    emit('update:roundNumber', item.round_number);
    emit('update:openId', item.open_id);
  });
};
</script>
