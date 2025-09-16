<template>
  <gv-popup
    ref="popupRef"
    :title="$t('game_data.bet.title_select_round')"
    width="500px"
    :confirm-button-text="null"
    :cancel-button-text="null"
    @close="cacheCallback = null"
    click-modal-close
  >
    <div class="table-seat flex-row flex-wrap align-center">
      <div
        class="select-item flex-row align-center justify-center cursor-pointer mb-8 mr-8"
        v-for="(item, index) in selectList"
        :key="index"
        @click="selectItem(item)"
      >
        {{ $t('common.round_no') }}: {{ item.round_number }}
      </div>
      <div class="select-item plain flex-row align-center justify-center cursor-pointer mb-8" @click="handleAdd">
        <gv-icon class="fz-20" name="el-icon-plus" />
      </div>
    </div>
  </gv-popup>
  <edit-baccarat ref="editBaccaratRef" :title="$t('game_data.bet.title_set_result')" :submit-fn="submitAdd" />
  <edit-general-niuniu ref="editGeneralNiuniuRef" :title="$t('game_data.bet.title_set_result')" :submit-fn="submitAdd" />
</template>
<script setup>
import { computed, shallowRef, unref } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import { $t } from '@/lang/i18n';
import { betGwmRoundNumber, betRoundNumber } from '@/api/game-data/bet';
import layer from '@/tools/layer';
import GvIcon from '@/components/gv-icon/index.vue';
import EditGeneralNiuniu from '@/views/game-data/bet-open/_components/edit-general-niuniu.vue';
import EditBaccarat from '@/views/game-data/bet-open/_components/edit-baccarat.vue';
import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT, YES_NO_VALUE } from '@/values';

const emit = defineEmits(['select']);

const popupRef = shallowRef();
const editBaccaratRef = shallowRef();
const editGeneralNiuniuRef = shallowRef();
const betInfo = shallowRef();

let cacheCallback = null;

const selectList = shallowRef([]);

const maxNumber = computed(() => {
  let result = 0;
  selectList.value?.forEach((item) => {
    result = Math.max(result, item.round_number);
  });
  return result + 1;
});

const refreshRound = async () => {
  const params = { table_id: betInfo.value.table_id, boot_id: betInfo.value.boot_id };
  layer.loading();
  const { lists } = await betRoundNumber(params);
  layer.closeLoading();
  selectList.value = lists.reverse();
};

const open = async (data, callback) => {
  betInfo.value = data;
  await refreshRound();
  popupRef.value?.open();
  cacheCallback = callback;
};

const selectItem = async (item) => {
  emit('select', item);
  if (cacheCallback) cacheCallback(item);
  popupRef.value?.close();
};

const handleAdd = async () => {
  const data = { ...unref(betInfo) };
  data.bet_result = GAME_MODEL_TYPE_BACCARAT.includes(data.game_model) ? [] : null;
  if (GAME_MODEL_TYPE_BACCARAT.includes(data.game_model)) {
    editBaccaratRef.value?.open(unref(data));
  } else if (data.game_model === GAME_MODEL.niu_niu) {
    editGeneralNiuniuRef.value?.open(unref(data));
  } else {
    const params = { id: data.id, bet_result: [] };
    submitAdd(params);
  }
};

const submitAdd = async (data) => {
  const info = unref(betInfo);
  const params = {
    boot_id: info.boot_id,
    round_number: maxNumber.value,
    bet_result: data.bet_result,
    is_close: !!info.close_time ? YES_NO_VALUE.no : YES_NO_VALUE.yes,
    close_time: info.close_time,
    map_kinds: data.map_kinds
  };
  layer.loading();
  await betGwmRoundNumber(params);
  await refreshRound();
  layer.closeLoading();
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.table-seat {
  .select-item {
    width: 100px;
    height: 50px;
    border-radius: var(--gv-border-radius-mid);
    background-color: var(--el-fill-color);

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:hover {
      background-color: var(--el-fill-color-dark);
    }

    &.plain {
      color: var(--el-color-primary);
      background-color: var(--el-bg-color);
      border: 1px solid var(--el-color-primary);

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }
    }
  }
}
</style>
