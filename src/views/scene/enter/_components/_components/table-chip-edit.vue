<template>
  <gv-popup ref="popupRef" :title="submitBtn" auto-focus :async="true" width="500px">
    <div class="content-box">
      <gv-input-amount class="amount-input" v-model="amount" :placeholder="$t('scene.enter.label_tc_amount')" :prefix="currencyInfo.icon">
        <template #handler-bottom>
          <div class="flex-row align-center justify-end">
            <gv-select-currency-config-radio v-model="currency" :options="optionsData.currency" @change="selectCache.setItem" class="justify-end" />
          </div>
        </template>
      </gv-input-amount>
    </div>
    <template #footer>
      <el-button @click="handleClose" size="large" round>{{ $t('common.close_btn') }}</el-button>
      <el-button type="primary" @click="handleSubmit" size="large" round>
        {{ submitBtn }}
      </el-button>
    </template>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, ref, shallowRef, toRaw } from 'vue';
import layer from '@/tools/layer';
import { getListInfoById } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import GvSelectCurrencyConfigRadio from '@/components/gv-select-currency/config-radio.vue';
import { NUMBER_HANDLER } from '@/values';
import { currencyConfigLists } from '@/api/currency/config';
import { financeTableIncDec } from '@/api/finance/table';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const amount = ref();
const currency = ref();
const otherInfo = ref({});
const mode = ref(NUMBER_HANDLER.inc);

const submitBtn = computed(() => (mode.value === NUMBER_HANDLER.inc ? $t('scene.enter.operate_chip_inc') : $t('scene.enter.operate_chip_dec')));

// 币种列表
const { optionsData, refresh } = useDictOptions({ currency: { api: currencyConfigLists } }, true);

// 选中币种信息
const currencyInfo = computed(() => {
  return getListInfoById(currency.value, optionsData.currency ?? []) || {};
});

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.table_chip_eidt, () => optionsData.currency);

const open = async (type, info) => {
  await refresh();
  mode.value = type;
  currency.value = selectCache.getItem();
  otherInfo.value = info;
  popupRef.value?.open();
};

// 重置值
const reset = () => {
  amount.value = null;
};

// 提交
const handleSubmit = async () => {
  if (!amount.value) return layer.msgError($t('scene.enter.tips_enter_amount'));
  const { table_id, report_game_check_id = 0, report_game_close_id = 0 } = otherInfo.value;
  await layer.confirm($t('scene.enter.tips_confirm_chip_inc_dec', { submit: submitBtn.value, icon: currencyInfo.value?.icon, amount: amount.value }));
  const params = {
    table_id: table_id,
    currency_config_id: currency.value,
    number: amount.value,
    type: mode.value,
    report_game_check_id,
    report_game_close_id
  };
  layer.loading();
  await financeTableIncDec(params);
  layer.closeLoading();
  reset();
  emit('success');
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
};

const handleClose = () => {
  popupRef.value?.close();
};

defineExpose({ open });
</script>
