<template>
  <gv-popup ref="popupRef" :title="$t('game_data.bet.btn_gwm')" :async="true" width="500px" @confirm="handleSubmit" @close="handleClose">
    <div class="edit-gwm" v-if="fromInfo">
      <el-form ref="formRef" label-width="150px">
        <el-form-item :label="$t('game_data.bet.current_info')">
          <span class="text-placeholder mr-4">{{ $t('common.table_no') }}</span>
          <span class="mr-8">{{ fromInfo.table_name }},</span>
          <span class="text-placeholder mr-4">{{ $t('common.boot_no') }}</span>
          <span class="mr-8">{{ fromInfo.boot_number }}</span>
        </el-form-item>
        <el-form-item :label="$t('common.round_no')">
          <div class="flex-row align-center w-full">
            <select-round-btn
              v-model:round-number="formData.round_number"
              v-model:open-id="formData.open_id"
              :from-info="fromInfo"
              custom-class="flex-1 mr-8"
            />
            <gv-bet-result-show :open-id="formData.open_id" :size="32" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('common.user_no')">
          <gv-select-user-inline ref="userInlineRef" v-model="formData.user_id" :clearable="false" :placeholder="$t('common.user_no')" />
        </el-form-item>
        <el-form-item :label="$t('game_data.bet.gwm_time')">
          <el-date-picker v-model="formData.bet_time" class="flex-1" type="datetime" value-format="x" :placeholder="$t('common.time_select')" />
        </el-form-item>
        <el-form-item :label="$t('game_data.bet.kind_no')">
          <el-radio-group v-model="formData.gameKindMainId" @change="() => (formData.gameKindSubId = null)">
            <el-radio class="custom-radio mb-4" v-for="item in gameKindTop" :value="item.id">
              {{ $ti(item.name) }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('game_data.bet.kind_sub_no')" v-if="gameKindMap[formData.gameKindMainId]?.sub_calc === GAME_KIND_CALC.sub">
          <el-radio-group v-model="formData.gameKindSubId">
            <el-radio class="custom-radio mb-4" v-for="item in gameKindSub" :value="item.id">
              {{ $ti(item.name) }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('game_data.bet.bet_currency_config')">
          <gv-select-currency-config-radio class="w-full" v-model="formData.currency_config_id" :options="currencyConfig" />
        </el-form-item>
        <el-form-item :label="$t('game_data.bet.bet_kind_amount')">
          <el-input-number class="flex-1 mr-8" v-model="formData.amount" :min="0" :max="Number.MAX_SAFE_INTEGER" controls-position="right" />
          <el-radio-group v-model="formData.is_nn_win">
            <el-radio class="custom-radio" v-for="item in LOSS_WIN_VALUE_DICT" :value="item.value">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </gv-popup>
  <table-bonus ref="tableBonusRef" />
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, nextTick, provide, reactive, shallowRef, unref } from 'vue';
import { delayExec, formatServerTime, isEmpty, isNumber, mappingArrayToObject, resolveServerTime, syncObjectData } from '@/tools';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { useBetBase } from '@/views/scene/enter/_models/bet-base';
import { useBetBaseFilter } from '@/views/scene/enter/_models/bet-filter';
import layer from '@/tools/layer';
import { GAME_KIND_CALC, LOSS_WIN_VALUE, LOSS_WIN_VALUE_DICT } from '@/values';
import GvSelectCurrencyConfigRadio from '@/components/gv-select-currency/config-radio.vue';
import { betBonusGwm, betGwm } from '@/api/game-data/bet';
import TableBonus from '@/views/scene/enter/_components/_components/table-bonus.vue';
import { checkBonusAmountBySetting } from '@/tools/bonus';
import { isTop } from '@/views/game/_models';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';
import SelectRoundBtn from '@/views/game-data/bet/_components/select-round-btn.vue';
import GvBetResultShow from '@/components/gv-bet-result-show/index.vue';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const fromInfo = shallowRef();
const userInlineRef = shallowRef();
const tableBonusRef = shallowRef();

const tempData = {
  bet_id: null,
  table_id: null,
  bet_time: null,
  boot_number: null,
  round_number: null,
  open_id: null,
  user_id: null,
  is_nn_win: null,
  gameKindMainId: null,
  gameKindSubId: null,
  currency_config_id: null,
  amount: null
};
const formData = reactive({ ...tempData });

const tableId = computed(() => fromInfo.value?.table_id);

// 基础信息
const {
  tableInfo,
  gameConfig,
  gameKind,
  gameCompose,
  currencyConfig,
  bonusList,
  bonusSetting,
  refreshTableInfo,
  refreshGameConfig,
  refreshGameKind,
  refreshKindCompose,
  refreshCurrencyConfig,
  refreshBonusList
} = useBetBase(() => tableId.value);

// 获取过滤的数据
const { gameKindFilter } = useBetBaseFilter(
  () => gameKind.value,
  () => gameConfig.value,
  () => gameCompose.value
);

const gameKindMap = computed(() => mappingArrayToObject(gameKind.value));

const gameKindSub = computed(() => gameKindFilter.value.filter((val) => val.sub_main_id === formData.gameKindMainId));

// 获取顶级选项
const gameKindTop = computed(() => {
  return gameKindFilter.value?.filter((val) => isTop(val.is_top));
});

const open = async (info) => {
  fromInfo.value = info;
  await nextTick();
  await delayExec(300);
  layer.loading();
  await refreshTableInfo();
  await refreshGameConfig();
  await refreshGameKind();
  await refreshKindCompose();
  await refreshCurrencyConfig();
  await refreshBonusList();
  layer.closeLoading();
  const { bet_id, table_id, create_time, boot_number, round_number, open_id, user_id, is_nn_win, currency_config_id } = info;
  syncObjectData(formData, {
    ...tempData,
    bet_id,
    table_id,
    bet_time: formatServerTime(create_time),
    boot_number,
    round_number,
    open_id,
    user_id,
    is_nn_win,
    currency_config_id
  });
  popupRef.value?.open();
  await delayExec(500);
  userInlineRef.value?.setTableData([{ id: info.user_id, username: info.username }]);
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
  const kindMap = gameKindMap.value;
  const setting = unref(bonusSetting);
  const realMainId = kindMap[formData.gameKindMainId]?.sub_calc === GAME_KIND_CALC.sub ? formData.gameKindSubId : formData.gameKindMainId;
  const checkBonus = !!formData.bonus ? checkBonusAmountBySetting(Number(formData.bonus), setting) : true;
  if (!realMainId) return layer.msgError($t('game_data.bet.field_check_kind_no'));
  if (isEmpty(formData.amount) && isEmpty(formData.bonus)) return layer.msgError($t('game_data.bet.field_check_amount'));
  if (!checkBonus)
    return layer.msgError($t('game_data.bet.field_check_bonus', { icon: setting.icon, min: setting.mini_amount, max: setting.max_multiple }));
  await layer.confirm($t('game_data.bet.tips_gwm_confirm'));
  const { bet_id, table_id, boot_number, round_number, open_id, bet_time, amount, bonus, bonus_id, bonus_profit } = formData;
  const params = {
    copy_id: bet_id,
    table_id,
    boot_number,
    round_number,
    open_id,
    bet_time: resolveServerTime(bet_time),
    bet_info: [
      { user_id: formData.user_id, currency_config_id: formData.currency_config_id, amount: isNumber(amount) ? amount : 0, game_kind_id: realMainId }
    ]
  };
  layer.loading();
  await betGwm(params);
  layer.closeLoading();
  layer.msgSuccess($t('game_data.bet.gwm_success'));
  popupRef.value?.close();
  emit('success');
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
