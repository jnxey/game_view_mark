<template>
  <gv-popup
    ref="popupRef"
    :title="$t('finance.user_chip.btn_currency_exchange')"
    :async="true"
    width="550px"
    @confirm="handleSubmit"
    @close="handleClose"
    :confirm-button-text="$t('finance.user_chip.btn_confirm_exchange')"
  >
    <el-form ref="formRef" :rules="rules" :model="formData" label-width="100px">
      <el-form-item :label="$t('common.user_no')" prop="username">
        <el-input v-model="formData.username" class="w-full" v-trim clearable :placeholder="$t('finance.user_chip.user_or_name')" />
      </el-form-item>
      <div class="flex-row align-center">
        <div class="flex-1">
          <el-form-item :label="'· ' + $t('common.from')" prop="from_currency_config_id">
            <gv-select-currency-config
              v-model="formData.from_currency_config_id"
              :options="currency"
              :disabled-option="{ [formData.to_currency_config_id]: true }"
              @change="currencyChange"
              :placeholder="$t('common.currency_config_no')"
            />
          </el-form-item>
          <el-form-item :label="'· ' + $t('common.to')" prop="to_currency_config_id">
            <gv-select-currency-config
              v-model="formData.to_currency_config_id"
              :options="currency"
              :disabled-option="{ [formData.from_currency_config_id]: true }"
              @change="currencyChange"
              :placeholder="$t('common.currency_config_no')"
            />
          </el-form-item>
        </div>
        <div class="exchange-button text-center w-80">
          <gv-icon class="exchange-icon cursor-pointer fw-bold text-main" name="local-icon-sort" @click="flipCurrency" />
        </div>
      </div>
      <el-form-item :label="$t('finance.user_chip.exchange_rate')" prop="rate">
        <el-input-number
          v-model="formData.rate"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          :precision="4"
          controls-position="right"
          :placeholder="$t('finance.user_chip.exchange_rate')"
          class="w-full"
          @change="cacheRate"
        />
      </el-form-item>
      <el-form-item :label="$t('finance.user_chip.exchange_amount')" prop="exchange_amount">
        <el-input-number
          v-model="formData.exchange_amount"
          :min="0"
          :max="Number.MAX_SAFE_INTEGER"
          :precision="2"
          controls-position="right"
          :placeholder="$t('finance.user_chip.amount')"
          class="w-full"
        >
          <template #prefix v-if="currencyFromIcon">
            <span class="pr-4">{{ currencyFromIcon }}</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item :label="$t('finance.user_chip.exchange_amount_ex')" prop="exchange_amount">
        <span class="text-warning">{{ currencyToIcon }} {{ formatThousand(amountTo) }}</span>
      </el-form-item>
      <el-form-item :label="$t('common.remark')" prop="remark">
        <el-input type="textarea" v-model="formData.remark" :placeholder="$t('common.remark')" />
      </el-form-item>
    </el-form>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { useDelay } from '@/hooks/delay';
import { formatThousand, getListInfoById, syncObjectData, toFixedDecimals } from '@/tools';
import { financeCurrencyExchangeSet } from '@/api/finance/currency-exchange';
import GvIcon from '@/components/gv-icon/index.vue';
import GvSelectCurrencyConfig from '@/components/gv-select-currency/config.vue';
import { storage } from '@/tools/storage';
import { CACHE_EXCHANGE_CURRENCY, CACHE_EXCHANGE_RATE } from '@/values/cache';
import { getRateUSD } from '@/lang';
import { $t } from '@/lang/i18n';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';

const rateUSD = getRateUSD();

const emit = defineEmits(['success', 'close']);
const formRef = shallowRef();
const popupRef = shallowRef();

const props = defineProps({ currency: Array });

const formTemp = { username: null, from_currency_config_id: null, to_currency_config_id: null, rate: null, remark: '', exchange_amount: null };
const formData = reactive({ ...formTemp });

const rules = {};

const clearValidate = useDelay(() => formRef.value?.clearValidate(), 10);

const currencyFromIcon = computed(() => {
  const currency = getListInfoById(formData.from_currency_config_id, props.currency);
  return currency.icon;
});

const currencyToIcon = computed(() => {
  const currency = getListInfoById(formData.to_currency_config_id, props.currency);
  return currency.icon;
});

const amountTo = computed(() => {
  if (!formData.exchange_amount || !formData.rate) {
    return '0';
  } else {
    return (formData.exchange_amount * formData.rate).toFixed(2);
  }
});

const open = async (name) => {
  const cache = storage.get(CACHE_EXCHANGE_CURRENCY) ?? {};
  syncObjectData(formData, { ...formTemp, username: name, from_currency_config_id: cache.from, to_currency_config_id: cache.to });
  setDefaultRate();
  popupRef.value?.open();
  clearValidate();
};

// 翻转
const flipCurrency = () => {
  const from = formData.from_currency_config_id;
  formData.from_currency_config_id = formData.to_currency_config_id;
  formData.to_currency_config_id = from;
  setDefaultRate();
};

// 缓存当前货币选项
const cacheCurrency = () => {
  storage.set(CACHE_EXCHANGE_CURRENCY, { from: formData.from_currency_config_id, to: formData.to_currency_config_id });
};

// 缓存当前汇率
const cacheRate = () => {
  if (!formData.from_currency_config_id || !formData.to_currency_config_id) return;
  const from = getListInfoById(formData.from_currency_config_id, props.currency);
  const to = getListInfoById(formData.to_currency_config_id, props.currency);
  if (!from.id || !to.id) return;
  const keyName = from.abbreviation + '_' + to.abbreviation;
  const cache = storage.get(CACHE_EXCHANGE_RATE) ?? {};
  cache[keyName] = formData.rate;
  storage.set(CACHE_EXCHANGE_RATE, cache);
};

// 设置默认汇率
const setDefaultRate = () => {
  if (!formData.from_currency_config_id || !formData.to_currency_config_id) return;
  const cache = storage.get(CACHE_EXCHANGE_RATE) ?? {};
  const from = getListInfoById(formData.from_currency_config_id, props.currency);
  const to = getListInfoById(formData.to_currency_config_id, props.currency);
  if (!from.id || !to.id) return;
  const keyName = from.abbreviation + '_' + to.abbreviation;
  if (cache[keyName]) {
    formData.rate = cache[keyName];
  } else if (rateUSD[from.abbreviation] && rateUSD[to.abbreviation]) {
    const fRate = rateUSD[from.abbreviation];
    const tRate = rateUSD[to.abbreviation];
    const rate = tRate / fRate;
    formData.rate = toFixedDecimals(rate, rate > 1 ? 2 : 4);
  }
};

// 币种变更
const currencyChange = () => {
  cacheCurrency();
  setDefaultRate();
};

// 提交
const handleSubmit = async () => {
  if (!formData.username) return layer.msgError($t('finance.user_chip.field_check_user'));
  if (!formData.from_currency_config_id || !formData.to_currency_config_id) return layer.msgError($t('finance.user_chip.field_check_currency'));
  if (!formData.rate) return layer.msgError($t('finance.user_chip.field_check_exchange_rate'));
  if (!formData.exchange_amount) return layer.msgError($t('finance.user_chip.field_check_exchange_amount'));
  await layer.confirm($t('finance.user_chip.tips_confirm_exchange_currency'));
  layer.loading();
  await financeCurrencyExchangeSet(formData);
  layer.closeLoading();
  layer.msgSuccess($t('finance.user_chip.exchange_currency_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.exchange-icon {
  position: relative;
  top: -10px;
  font-size: 50px;
  padding: 10px;
  user-select: none;
  border-radius: 50%;
  background-color: var(--el-fill-color);
  &:hover {
    background-color: var(--el-fill-color-dark);
  }
}
</style>
