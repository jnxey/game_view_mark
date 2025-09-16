<template>
  <gv-popup ref="popupRef" :title="$t('common.modify_btn')" :async="true" width="500px" @confirm="handleSubmit" @close="handleClose">
    <div class="edit-gwm" v-if="fromInfo">
      <el-form ref="formRef" label-width="100px">
        <el-form-item :label="$t('game_data.bet.current_info')">
          <span class="text-placeholder mr-4">{{ $t('common.table_no') }}</span>
          <span class="mr-8">{{ fromInfo.table_name }},</span>
          <span class="text-placeholder mr-4">{{ $t('common.boot_no') }}</span>
          <span class="mr-8">{{ fromInfo.boot_number }},</span>
          <span class="text-placeholder mr-4">{{ $t('common.round_no') }}</span>
          <span class="mr-8">{{ fromInfo.round_number }}</span>
        </el-form-item>
        <el-form-item :label="$t('common.user_no')">
          <gv-select-user-inline ref="userInlineRef" v-model="formData.user_id" :clearable="false" :placeholder="$t('common.user_no')" disabled />
        </el-form-item>
        <template v-if="!!bonusList?.length">
          <el-form-item :label="$t('game_data.bet.bet_bonus_amount')">
            <el-input-number
              class="flex-1"
              v-model="formData.bonus"
              :min="0"
              :max="Number.MAX_SAFE_INTEGER"
              controls-position="right"
              @blur="canClearBonusResult"
            />
            <el-button type="primary" class="ml-8" v-if="!!formData.bonus" @click="openBonusSelect">
              {{ !!formData.bonus_id ? $t('common.prizes_awarded', { index: getBonusIndex(formData.bonus_id) }) : $t('common.prize_draw') }}
            </el-button>
          </el-form-item>
          <el-form-item :label="$t('game_data.bet.bet_bonus_profit')">
            <div class="flex-1 flex-col justify-start">
              <el-input-number
                class="w-full"
                v-model="formData.bonus_profit"
                :min="Number.MIN_SAFE_INTEGER"
                :max="Number.MAX_SAFE_INTEGER"
                controls-position="right"
              />
              <div class="text-tips">{{ $t('game_data.bet.tips_bonus_profit_enter') }}</div>
            </div>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </gv-popup>
  <table-bonus ref="tableBonusRef" />
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, nextTick, provide, reactive, shallowRef, unref } from 'vue';
import { delayExec, isEmpty, isNumber, mappingArrayToObject, syncObjectData } from '@/tools';
import { useBetBase } from '@/views/scene/enter/_models/bet-base';
import { useBetBaseFilter } from '@/views/scene/enter/_models/bet-filter';
import layer from '@/tools/layer';
import { GAME_KIND_CALC, LOSS_WIN_VALUE_DICT } from '@/values';
import GvSelectCurrencyConfigRadio from '@/components/gv-select-currency/config-radio.vue';
import { betBonusModify, betModify } from '@/api/game-data/bet';
import TableBonus from '@/views/scene/enter/_components/_components/table-bonus.vue';
import { checkBonusAmountBySetting } from '@/tools/bonus';
import { isTop } from '@/views/game/_models';
import { $t } from '@/lang/i18n';
import SelectRoundBtn from '@/views/game-data/bet/_components/select-round-btn.vue';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import GvBetResultShow from '@/components/gv-bet-result-show/index.vue';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const fromInfo = shallowRef();
const tableBonusRef = shallowRef();

const tempData = {
  id: null,
  round_number: null,
  bonus: null,
  bonus_id: null,
  open_id: null,
  user_id: null,
  bonus_profit: null
};
const formData = reactive({ ...tempData });

const tableId = computed(() => fromInfo.value?.table_id);

// 基础信息
const { currencyConfig, bonusList, bonusSetting, refreshTableInfo, refreshCurrencyConfig, refreshBonusList } = useBetBase(() => tableId.value);

const open = async (info) => {
  fromInfo.value = info;
  await nextTick();
  await delayExec(300);
  layer.loading();
  await refreshTableInfo();
  await refreshCurrencyConfig();
  await refreshBonusList();
  layer.closeLoading();
  if (!bonusList.value?.length) return layer.msgError($t('game_data.bet.tips_bonus_empty'));
  const { bet_id, bonus_amount, bonus_profit_loss, bonus_result, open_id, user_id, round_number } = info;
  syncObjectData(formData, {
    ...tempData,
    id: bet_id,
    bonus: !!Number(bonus_amount) ? Number(bonus_amount) : null,
    bonus_id: !!bonus_result ? bonus_result[0] : null,
    round_number,
    open_id,
    user_id,
    bonus_profit: !!Number(bonus_profit_loss) ? Number(bonus_profit_loss) : null
  });
  popupRef.value?.open();
};

// 打开彩金选中
const openBonusSelect = () => {
  tableBonusRef.value?.open(formData.bonus_id, (rowId) => {
    formData.bonus_id = rowId;
  });
};

// 判断是否清空彩金结果
const canClearBonusResult = () => {
  if (!formData.bonus) formData.bonus_id = null;
};

// 提交
const handleSubmit = async () => {
  const setting = unref(bonusSetting);
  const checkBonus = !!formData.bonus ? checkBonusAmountBySetting(Number(formData.bonus), setting) : true;
  if (!checkBonus)
    return layer.msgError($t('game_data.bet.field_check_bonus', { icon: setting.icon, min: setting.mini_amount, max: setting.max_multiple }));
  await layer.confirm($t('game_data.bet.tips_edit_bonus_confirm'));
  const { id, bonus, bonus_id, bonus_profit, round_number, open_id, user_id } = formData;
  const bonusResult = !!bonus_id ? [bonus_id] : [];
  const params = {
    id: id,
    bonus_amount: isNumber(bonus) ? bonus : 0,
    bonus_result: bonusResult,
    open_id,
    user_id,
    bonus_profit_loss: isNumber(bonus_profit) ? bonus_profit : 0,
    round_number
  };
  layer.loading();
  await betBonusModify(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

// 获取彩金ID索引
const getBonusIndex = (id) => {
  if (!id) return '';
  const index = bonusList.value?.findIndex((val) => val.id === id) ?? 0;
  return index + 1;
};

// 取消
const handleClose = () => {};

defineExpose({ open });

provide('bonusList', bonusList);
</script>
<style scoped lang="scss">
.currency-border {
  min-height: 32px;
  border-bottom-right-radius: var(--el-border-radius-base);
  border-bottom-left-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color);
  border-top: none;
}
</style>
