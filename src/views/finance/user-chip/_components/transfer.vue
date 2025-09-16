<template>
  <gv-popup
    ref="popupRef"
    :title="$t('finance.user_chip.btn_transfer')"
    :async="true"
    width="500px"
    auto-focus
    @confirm="handleSubmit"
    @close="handleClose"
  >
    <gv-input-amount v-model="formData.total_amount" :placeholder="$t('finance.user_chip.amount')" :prefix="currencyInfo.icon">
      <template #handler-bottom>
        <div class="flex-row align-center justify-end">
          <gv-select-currency-config-radio
            v-model="formData.currency_config_id"
            :options="currencyListChip"
            @change="selectCache.setItem"
            class="justify-end"
          />
        </div>
        <el-divider border-style="dashed" class="size-small" />
        <div class="flex-row align-center justify-end pb-8">
          <gv-select-user-inline
            ref="userOldRef"
            class="select-user"
            v-model="formData.user_id_old"
            :placeholder="$t('finance.user_chip.transfer_from')"
          />
          <gv-icon name="el-icon-right" class="fz-24 ml-8 mr-8" />
          <gv-select-user-inline
            ref="userNewRef"
            class="select-user"
            v-model="formData.user_id_new"
            :placeholder="$t('finance.user_chip.transfer_to')"
          />
        </div>
        <el-divider border-style="dashed" class="size-small" />
        <div class="flex-row align-center">
          <el-input type="textarea" :placeholder="$t('common.remark')" class="remark-input" :rows="2" v-model="formData.remark" />
        </div>
      </template>
    </gv-input-amount>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { getListInfoById, isArray, mappingArrayToObject, syncObjectData } from '@/tools';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import { financeTransfer } from '@/api/finance/user-chip';
import { useDictOptions } from '@/hooks/dict';
import { CURRENCY_TYPE } from '@/values';
import GvSelectCurrencyConfigRadio from '@/components/gv-select-currency/config-radio.vue';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { currencyConfigLists } from '@/api/currency/config';
import GvIcon from '@/components/gv-icon/index.vue';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import { $t } from '@/lang/i18n';
import { GLOBAL_DICT } from '@/store/global-dict';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const userOldRef = shallowRef();
const userNewRef = shallowRef();
const formTemp = { currency_config_id: null, user_id_old: null, user_id_new: null, total_amount: null, exchange_type: null, remark: null };
const formData = reactive({ ...formTemp });

const { optionsData, refresh } = useDictOptions({ currency: { api: currencyConfigLists } }, true);

// 币种列表
const currencyList = computed(() => optionsData.currency);

// 币种列表
const currencyListChip = computed(() => {
  return isArray(currencyList.value) ? currencyList.value.filter((val) => val.type === CURRENCY_TYPE.chips) : [];
});

// 币种Map
const currencyMap = computed(() => mappingArrayToObject(currencyList.value ?? []));

// 选中币种信息
const currencyInfo = computed(() => {
  return getListInfoById(formData.currency_config_id, currencyListChip.value ?? []) || {};
});

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.user_chip_transfer, () => currencyListChip.value);

const open = async (exchange_type, userId, currencyConfig) => {
  await refresh();
  const cMap = currencyMap.value;
  if (cMap[currencyConfig]?.type === CURRENCY_TYPE.cash) currencyConfig = null;
  const currencyId = selectCache.getItem();
  syncObjectData(formData, {
    ...formTemp,
    currency_config_id: currencyConfig ?? currencyId,
    user_id_old: userId ?? null,
    exchange_type: exchange_type
  });
  popupRef.value?.open();
};

// 提交
const handleSubmit = async () => {
  if (!formData.total_amount) return layer.msgError($t('finance.user_chip.field_check_amount'));
  if (!formData.user_id_old) return layer.msgError($t('finance.user_chip.field_check_transfer_from'));
  if (!formData.user_id_new) return layer.msgError($t('finance.user_chip.field_check_transfer_to'));
  const oldName = userOldRef.value?.getUsername();
  const newName = userNewRef.value?.getUsername();
  await layer.confirm(
    $t('finance.user_chip.tips_confirm_transfer', { currency: currencyInfo.value?.icon, amount: formData.total_amount, from: oldName, to: newName })
  );
  layer.loading();
  await financeTransfer({ ...formData });
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
.select-user.el-select {
  ::v-deep(.el-select__wrapper) {
    box-shadow: none;
  }
}
.el-textarea.remark-input {
  ::v-deep(.el-textarea__inner) {
    box-shadow: none;
  }
}
</style>
