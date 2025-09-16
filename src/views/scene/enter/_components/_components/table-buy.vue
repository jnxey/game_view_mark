<template>
  <gv-popup ref="popupRef" :title="$t('scene.enter.title_chip_buy')" auto-focus :async="true" width="500px">
    <div class="content-box">
      <gv-input-amount class="amount-input" v-model="amount" :placeholder="$t('scene.enter.label_tc_amount')" :prefix="currencyInfo.icon">
        <template #handler-bottom>
          <div class="flex-row align-center justify-end">
            <gv-select-currency-config-radio v-model="currency" :options="currencyList" @change="selectCache.setItem" class="justify-end" />
          </div>
          <el-divider border-style="dashed" class="size-small" />
          <div class="flex-row align-center justify-end pb-8">
            <gv-select-user-inline ref="usernameRef" class="select-user" v-model="userId" :placeholder="$t('scene.enter.label_tc_buy_user_no')" />
          </div>
        </template>
      </gv-input-amount>
    </div>
    <template #footer>
      <el-button @click="handleClose" size="large" round>{{ $t('common.close_btn') }}</el-button>
      <el-button type="primary" @click="handleSubmit" size="large" round>{{ $t('common.confirm_btn') }}</el-button>
    </template>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { getListInfoById, isArray } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import GvSelectCurrencyConfigRadio from '@/components/gv-select-currency/config-radio.vue';
import { CURRENCY_TYPE, NUMBER_HANDLER } from '@/values';
import { currencyConfigLists } from '@/api/currency/config';
import { financeTableSetUserCabinet } from '@/api/finance/table';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const usernameRef = shallowRef();
const amount = ref();
const currency = ref();
const userId = ref();
const tableInfo = ref({});

const { optionsData, refresh } = useDictOptions({ currency: { api: currencyConfigLists } }, true);

// 币种列表
const currencyList = computed(() => {
  return isArray(optionsData.currency) ? optionsData.currency.filter((val) => val.type === CURRENCY_TYPE.chips) : [];
});

// 选中币种信息
const currencyInfo = computed(() => {
  return getListInfoById(currency.value, optionsData.currency ?? []) || {};
});

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.table_buy, () => currencyList.value);

const open = async (info) => {
  await refresh();
  currency.value = selectCache.getItem();
  userId.value = null;
  tableInfo.value = info;
  popupRef.value?.open();
};

// 重置值
const reset = () => {
  amount.value = null;
};

// 提交
const handleSubmit = async () => {
  if (!amount.value) return layer.msgError($t('scene.enter.tips_enter_amount'));
  if (!userId.value) return layer.msgError($t('scene.enter.tips_enter_user_no'));
  const username = usernameRef.value?.getUsername();
  await layer.confirm($t('scene.enter.tips_confirm_buy', { username: username, icon: currencyInfo.value?.icon, amount: amount.value }));
  const params = {
    table_id: tableInfo.value.id,
    currency_config_id: currency.value,
    total_amount: amount.value,
    amount_type: NUMBER_HANDLER.inc,
    user_id: userId.value
  };
  layer.loading();
  await financeTableSetUserCabinet(params);
  layer.closeLoading();
  reset();
  emit('success');
  popupRef.value?.close();
  layer.msgSuccess($t('common.save_success'));
};

const handleClose = () => {
  popupRef.value?.close();
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.select-user.el-select {
  ::v-deep(.el-select__wrapper) {
    box-shadow: none;
  }
}
</style>
