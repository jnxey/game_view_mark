<template>
  <gv-popup ref="popupRef" :title="`【${username}】-${title}`" :async="true" width="500px" auto-focus @confirm="handleSubmit" @close="handleClose">
    <gv-input-amount v-model="formData.total_amount" :placeholder="$t('finance.user_chip.amount')" :prefix="currencyIcon">
      <template #handler-top>
        <div v-if="!!currencyInfo" class="currency-info flex-row align-center mb-12">
          <el-avatar :size="18" :src="getBaseImagUrl(currencyInfo.image)" />
          <span class="ml-4">{{ currencyInfo.abbreviation }}-</span>
          <span class="text-placeholder">{{ $ti(currencyInfo.currency_name) }}</span>
          <el-tag class="ml-4">{{ currencyTypeMap[currencyInfo.type]?.name }}</el-tag>
        </div>
        <div v-if="!!amountInfo" class="amount-box flex-1 mb-12">
          <span>{{ $t('finance.user_chip.balance_now') }}:</span>
          <span v-if="!!currencyBalance" class="ml-8 fs-italic fw-bold text-main">{{ currencyIcon }}{{ currencyBalance }}</span>
          <span v-else class="ml-8 fs-italic fw-bold text-main">-</span>
        </div>
        <div v-if="!!amountInfo" class="amount-box flex-1 mb-12">
          <span>{{ $t('finance.user_chip.deposit_now') }}:</span>
          <span class="ml-8 fs-italic fw-bold text-main">{{ currencyIcon }}{{ currencyDeposit }}</span>
        </div>
        <div v-if="!!amountInfo" class="amount-box mb-12">
          <span>{{ $t('finance.user_chip.sign_amount') }}:</span>
          <template v-for="item in currencyConfig" :key="item.id">
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
        <el-input type="textarea" :placeholder="$t('common.remark')" class="remark-input" :rows="2" v-model="formData.remark" />
        <div v-if="hasPatter" class="p-8 flex-row justify-end">
          <el-radio-group v-model="formData.pattern" @change="(value) => selectCache.setItem(value)">
            <el-radio class="custom-radio" v-for="(item, index) in CURRENCY_TYPE_DICT" :key="index" :label="item.name" :value="item.value" />
          </el-radio-group>
        </div>
      </template>
    </gv-input-amount>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, nextTick, reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { getBaseImagUrl, mappingArrayToObject, parseDict, syncObjectData } from '@/tools';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import { financeAmountInfo, financeUserChipSet } from '@/api/finance/user-chip';
import { $t } from '@/lang/i18n';
import { GLOBAL_DICT } from '@/store/global-dict';
import { $ti } from '@/lang/input';
import { CURRENCY_TYPE, CURRENCY_TYPE_DICT, NUMBER_HANDLER } from '@/values';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import { BALANCE_TYPE } from '@/views/finance/user-chip/_model';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const formTemp = {
  cabinet_chip_type_id: null,
  currency_config_id: null,
  user_ids: [],
  amount_type: null,
  total_amount: null,
  pattern: null,
  remark: null
};
const formData = reactive({ ...formTemp });
const title = ref();
const username = ref();
const currencyIcon = ref();
const amountInfo = ref();

const currencyTypeMap = parseDict(CURRENCY_TYPE_DICT);

const { optionsData, refresh } = useDictOptions({ currency: { api: currencyConfigLists } }, true);

const currencyConfig = computed(() => optionsData.currency);

const currencyInfo = computed(() => {
  const cMap = GLOBAL_DICT.value.currency_config.map;
  return cMap[formData.currency_config_id];
});

const currencyBalance = computed(() => {
  const cMap = GLOBAL_DICT.value.currency_config.map;
  const isChips = cMap[formData.currency_config_id]?.type === CURRENCY_TYPE.chips;
  if (!amountInfo.value || !isChips) return null;
  return amountInfo.value[formData.currency_config_id]?.chip_balance;
});

const currencyDeposit = computed(() => {
  return amountInfo.value[formData.currency_config_id]?.deposit_amount;
});

// 是否显示现金 筹码参数选项
const hasPatter = computed(() => {
  return formData.cabinet_chip_type_id === BALANCE_TYPE.sign_amount.cabinet_chip_type_id && formData.amount_type === NUMBER_HANDLER.dec;
});

// 是否显示金额信息
const hasAmountInfo = computed(() => {
  return [
    BALANCE_TYPE.sign_amount.cabinet_chip_type_id,
    BALANCE_TYPE.point_amount.cabinet_chip_type_id,
    BALANCE_TYPE.cabinet_buy.cabinet_chip_type_id
  ].includes(formData.cabinet_chip_type_id);
});

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.user_chip_balance_pattern, () => CURRENCY_TYPE_DICT, 'value');

const open = async (_title, _username, _currencyIcon, row) => {
  await refresh();
  title.value = _title;
  username.value = _username;
  currencyIcon.value = _currencyIcon;
  syncObjectData(formData, { ...formTemp, ...row });
  await nextTick();
  if (hasPatter.value) formData.pattern = selectCache.getItem();
  getAmountInfo(_username);
  popupRef.value?.open();
};

// 拉取会员签单信息
const getAmountInfo = async (username) => {
  if (!username || !hasAmountInfo.value) return (amountInfo.value = null);
  const info = await financeAmountInfo({ username: username, amount_key: 'chip_balance,sign_amount,deposit_amount' });
  amountInfo.value = !!info.balance ? mappingArrayToObject(info.balance, 'currency_config_id') : null;
};

// 提交
const handleSubmit = async () => {
  if (!formData.total_amount) return layer.msgError($t('finance.user_chip.field_check_amount'));
  await layer.confirm(`${$t('common.confirm_btn')}【${username.value}】-${title.value} ${currencyIcon.value} ${formData.total_amount}`);
  layer.loading();
  await financeUserChipSet({ ...formData });
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.el-textarea.remark-input {
  ::v-deep(.el-textarea__inner) {
    box-shadow: none;
  }
}
</style>
