<template>
  <gv-popup
    ref="popupRef"
    :title="title"
    :async="true"
    width="600px"
    auto-focus
    :confirm-button-text="title"
    @confirm="handleSubmit"
    @close="handleClose"
  >
    <gv-input-amount v-model="formData.total_amount" :placeholder="$t('finance.user_chip.amount')" :prefix="currencyIcon">
      <template #amount-show="{ amount, format }">
        <div class="empty"></div>
      </template>
      <template #handler-top v-if="mode === NUMBER_HANDLER.dec">
        <div v-if="!!amountInfo" class="balance-amount flex-row align-center">
          <div class="amount-box flex-1 mb-12">
            <span>{{ $t('finance.user_chip.balance_now') }}:</span>
            <span v-if="!!currencyBalance" class="ml-8 fs-italic fw-bold text-main">{{ currencyIcon }}{{ currencyBalance }}</span>
            <span v-else class="ml-8 fs-italic fw-bold text-main">-</span>
          </div>
          <div v-if="!!currencyBalanceRemit" class="amount-box flex-1 mb-12">
            <span>{{ $t('finance.user_chip.balance_remit') }}:</span>
            <span class="ml-8 fs-italic fw-bold text-main" :class="{ 'text-danger': Number(currencyBalanceRemit) < 0 }">
              {{ currencyIcon }}{{ currencyBalanceRemit }}
            </span>
          </div>
        </div>
        <div v-if="!!amountInfo" class="amount-box mb-12">
          <span>{{ $t('finance.user_chip.sign_amount') }}:</span>
          <template v-for="item in currency" :key="item.id">
            <span
              v-if="!!Number(amountInfo[item.id]?.sign_amount)"
              class="ml-8 fs-italic"
              :style="{ color: item.color || 'var(--el-text-color-primary)' }"
            >
              {{ $ti(item.name) }} {{ amountInfo[item.id]?.sign_amount }}
            </span>
          </template>
        </div>
      </template>
      <template #handler-bottom>
        <!--     币种     -->
        <div class="fz-12 text-placeholder p-8">{{ title }}{{ $t('common.currency_config_no') }}</div>
        <div class="flex-row justify-start">
          <gv-select-currency-config-radio
            v-model="formData.currency_config_id"
            :options="usedCurrency"
            @change="
              (value) => {
                selectCache.setItem(value);
                getAmountInfo();
                setRemitInOutCurrency(value);
              }
            "
          />
        </div>
        <!--     取出币种     -->
        <template v-if="mode === NUMBER_HANDLER.inc && !!currencyOut">
          <div class="fz-12 text-placeholder p-8">{{ $t('finance.user_chip.take_out') }}{{ $t('common.currency_config_no') }}</div>
          <div class="flex-row justify-start">
            <gv-select-currency-config-radio v-model="formData.to_currency_config_id" :options="currencyOut" />
          </div>
        </template>
        <!--    会员号/姓名      -->
        <el-divider border-style="dashed" class="size-small" />
        <div class="flex-row align-center">
          <el-input
            v-model="formData.username"
            class="input-box w-full placeholder-far"
            v-place
            v-trim
            clearable
            :placeholder="$t('finance.user_chip.user_or_name')"
            @blur="getAmountInfo"
          />
        </div>
        <!--     汇款方式     -->
        <el-divider border-style="dashed" class="size-small" />
        <div class="flex-row align-center">
          <gv-select-options
            class="input-box w-full placeholder-far"
            v-model="formData.remittance_type_id"
            place-top
            :request="financeRemitTypeLists"
            :placeholder="$t('finance.user_chip.remit_type')"
          />
        </div>
        <!--    手续费    -->
        <el-divider border-style="dashed" class="size-small" />
        <div class="flex-row align-center">
          <el-input-number
            v-model="formData.commission"
            class="input-box w-full placeholder-far"
            v-place
            :placeholder="$t('finance.user_chip.commission')"
            :min="0"
            :max="Number.MAX_SAFE_INTEGER"
            :controls="false"
          />
        </div>
        <!--    手机号      -->
        <el-divider border-style="dashed" class="size-small" />
        <div class="flex-row align-center">
          <el-input v-model="formData.mobile" class="input-box w-full placeholder-far" v-place :placeholder="$t('finance.user_chip.mobile')" />
        </div>
        <!--    备注      -->
        <el-divider border-style="dashed" class="size-small" />
        <div class="flex-row align-center">
          <el-input v-model="formData.remark" class="input-box w-full placeholder-far" type="textarea" v-place :placeholder="$t('common.remark')" />
        </div>
      </template>
    </gv-input-amount>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { calcAmount, mappingArrayToObject, syncObjectData, toAwait } from '@/tools';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import { financeAmountInfo, financeUserChipSet } from '@/api/finance/user-chip';
import { $t } from '@/lang/i18n';
import { BALANCE_TYPE } from '@/views/finance/user-chip/_model';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import GvSelectCurrencyConfigRadio from '@/components/gv-select-currency/config-radio.vue';
import { financeRemitTypeLists } from '@/api/finance/remit-type';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { userCheckRepeat } from '@/api/user/list';
import { CURRENCY_TYPE, NUMBER_HANDLER, YES_NO_VALUE } from '@/values';
import { $ti } from '@/lang/input';

const emit = defineEmits(['success', 'close']);
const props = defineProps({ currency: Array });

const popupRef = shallowRef();
const formTemp = {
  cabinet_chip_type_id: null,
  currency_config_id: null,
  username: null,
  amount_type: null,
  total_amount: null,
  commission: null,
  mobile: null,
  remark: null,
  to_currency_config_id: null,
  remittance_type_id: null
};
const formData = reactive({ ...formTemp });
const mode = ref();
const title = ref();
const amountInfo = ref();

const currencyMap = computed(() => mappingArrayToObject(props.currency));

const currencyCash = computed(() => {
  const currency = props.currency ?? [];
  return currency.filter((val) => val.type === CURRENCY_TYPE.cash);
});

const usedCurrency = computed(() => {
  return mode.value === NUMBER_HANDLER.inc ? currencyCash.value : props.currency;
});

const currencyOut = computed(() => {
  const currency = props.currency ?? [];
  const currencyId = currencyMap.value[formData.currency_config_id]?.currency_id;
  if (!currencyId) return null;
  return currency.filter((val) => val.currency_id === currencyId);
});

const currencyIcon = computed(() => currencyMap.value[formData.currency_config_id]?.icon);

const currencyBalance = computed(() => {
  const isChips = currencyMap.value[formData.currency_config_id]?.type === CURRENCY_TYPE.chips;
  if (!amountInfo.value || !isChips) return null;
  return amountInfo.value[formData.currency_config_id]?.chip_balance;
});

const currencyBalanceRemit = computed(() => {
  const isChips = currencyMap.value[formData.currency_config_id]?.type === CURRENCY_TYPE.chips;
  if (!amountInfo.value || !formData.total_amount || !isChips) return null;
  return calcAmount(Number(amountInfo.value[formData.currency_config_id]?.chip_balance) - formData.total_amount, false);
});

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.user_chip_remit, () => usedCurrency.value ?? []);

// 打开弹窗
const open = async (type, params) => {
  mode.value = type;
  title.value = BALANCE_TYPE.cabinet_remit.amount_types[type];
  const currency_config_id = params.currency_config_id ?? selectCache.getItem();
  if (mode.value === NUMBER_HANDLER.inc) {
    // 汇入
    syncObjectData(formData, { ...formTemp, ...params, currency_config_id: currency_config_id, to_currency_config_id: currency_config_id });
  } else {
    // 汇出
    syncObjectData(formData, { ...formTemp, ...params, currency_config_id: currency_config_id });
  }
  popupRef.value?.open();
  getAmountInfo();
};

// 拉取会员签单信息
const getAmountInfo = async () => {
  if (!formData.username) return (amountInfo.value = null);
  const info = await financeAmountInfo({ username: formData.username, amount_key: 'chip_balance,sign_amount' });
  amountInfo.value = !!info.balance ? mappingArrayToObject(info.balance, 'currency_config_id') : null;
};

// 提交
const handleSubmit = async () => {
  if (!formData.total_amount) return layer.msgError($t('finance.user_chip.field_check_amount'));
  if (!formData.username) return layer.msgError($t('finance.user_chip.field_check_person'));
  if (!formData.remittance_type_id) return layer.msgError($t('finance.user_chip.field_check_remit_type'));
  layer.loading();
  const [checkUser, err] = await toAwait(userCheckRepeat({ repeat_field: 'username', value: formData.username }));
  layer.closeLoading();
  if (!checkUser) {
    await layer.confirm($t('finance.user_chip.tips_check_username_normal'));
  } else {
    await layer.confirm(`${$t('common.confirm_btn')}${title.value} ${currencyIcon.value}${formData.total_amount}`);
  }
  layer.loading();
  const params = {
    cabinet_chip_type_id: BALANCE_TYPE.cabinet_remit.cabinet_chip_type_id,
    currency_config_id: formData.currency_config_id,
    to_currency_config_id: formData.to_currency_config_id,
    user_ids: [formData.username],
    amount_type: mode.value,
    mobile: formData.mobile,
    remark: formData.remark,
    total_amount: formData.total_amount,
    commission: formData.commission, //手续费
    remittance_type_id: formData.remittance_type_id
  };
  await financeUserChipSet(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

// 汇入设置取出币种
const setRemitInOutCurrency = (value) => {
  if (mode.value === NUMBER_HANDLER.inc) formData.to_currency_config_id = value;
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.balance-amount {
}

.input-box.el-input-number,
.input-box.el-input {
  ::v-deep(.el-input__wrapper) {
    box-shadow: none;
    padding-left: 12px;
  }
}

.input-box.el-select {
  ::v-deep(.el-select__wrapper) {
    box-shadow: none;
  }
}

.input-box.el-textarea {
  ::v-deep(.el-textarea__inner) {
    box-shadow: none;
  }
}
</style>
