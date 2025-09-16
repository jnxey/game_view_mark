<template>
  <gv-popup ref="popupRef" :title="popupTitle" auto-focus :async="true" width="500px">
    <div class="content-box">
      <gv-input-amount class="amount-input" v-model="formData.amount" :placeholder="$t('finance.tip.amount')" :prefix="currencyInfo.icon">
        <template #handler-bottom>
          <div class="flex-row align-center justify-end">
            <gv-select-currency-config-radio
              v-model="formData.currency_config_id"
              :options="currencyList"
              @change="selectCache.setItem"
              class="justify-end"
            />
          </div>
          <!--          -->
          <el-divider border-style="dashed" class="size-small" />
          <div class="flex-row align-center justify-end pb-8">
            <gv-select-options
              class="select-wrap placeholder-far"
              v-model="formData.table_id"
              :placeholder="$t('common.table_no')"
              :request="financeTableLists"
              place-top
              :empty-page="{ perm: permsMap.finance.table.view }"
            />
          </div>
          <!--            -->
          <el-divider border-style="dashed" class="size-small" />
          <div class="flex-row align-center justify-end pb-8">
            <gv-select-admin-inline
              class="select-wrap placeholder-far"
              ref="adminRef"
              v-model="formData.admin_id"
              place-top
              :placeholder="$t('common.admin_no')"
            />
          </div>
          <!--            -->
          <el-divider border-style="dashed" class="size-small" />
          <div class="flex-row align-center justify-end pb-8">
            <gv-select-user-inline class="select-wrap placeholder-far" v-model="formData.user_id" place-top :placeholder="$t('common.user_no')" />
          </div>
          <!--            -->
          <el-divider border-style="dashed" class="size-small" />
          <div class="flex-row align-center justify-end">
            <el-input class="select-wrap placeholder-far" type="textarea" v-model="formData.remark" v-place :placeholder="$t('common.remark')" />
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
import { computed, reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { getListInfoById, syncObjectData } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import GvSelectCurrencyConfigRadio from '@/components/gv-select-currency/config-radio.vue';
import { currencyConfigLists } from '@/api/currency/config';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import GvSelectAdminInline from '@/components/gv-select-admin/inline.vue';
import { financeTipSet } from '@/api/finance/tip';
import GvSelectOptions from '@/components/gv-select-options/index.vue';
import { financeTableLists } from '@/api/finance/table';
import GvSelectUserInline from '@/components/gv-select-user/inline.vue';
import { OPERATE_TYPE } from '@/values';
import { managerState } from '@/store/manager';
import { permsMap } from '@/api/perms';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const adminRef = shallowRef();
const mode = ref(OPERATE_TYPE.insert);

const popupTitle = computed(() => (mode.value === OPERATE_TYPE.update ? $t('finance.tip.title_edit') : $t('finance.tip.title_add')));

const formTemp = { id: null, table_id: null, currency_config_id: null, amount: null, admin_id: null, remark: null, user_id: null };
const formData = reactive({ ...formTemp });

const { optionsData, refresh } = useDictOptions({ currency: { api: currencyConfigLists } }, true);

// 币种列表
const currencyList = computed(() => {
  return optionsData.currency ?? [];
});

// 选中币种信息
const currencyInfo = computed(() => {
  return getListInfoById(formData.currency_config_id, currencyList.value) || {};
});

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.tip_add, () => currencyList.value);

const open = async (type, row, tableId) => {
  await refresh();
  mode.value = type;
  if (type === OPERATE_TYPE.update) syncObjectData(formData, row);
  else syncObjectData(formData, { ...formTemp, currency_config_id: selectCache.getItem() });
  if (!!tableId) {
    formData.table_id = tableId;
    formData.admin_id = managerState.user?.id;
  }
  popupRef.value?.open();
};

// 提交
const handleSubmit = async () => {
  if (!formData.amount) return layer.msgError($t('finance.tip.field_check_amount'));
  if (!formData.admin_id) return layer.msgError($t('finance.tip.field_check_admin_no'));
  if (!formData.user_id) return layer.msgError($t('finance.tip.field_check_user_no'));
  if (!formData.table_id) return layer.msgError($t('finance.tip.field_check_table_no'));
  const admin = adminRef.value?.getUsername();
  await layer.confirm($t('finance.tip.tips_confirm', { symbol: currencyInfo.value?.icon, amount: formData.amount, admin: admin }));
  const params = { ...formData };
  layer.loading();
  await financeTipSet(params);
  layer.closeLoading();
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
.select-wrap.el-select {
  ::v-deep(.el-select__wrapper) {
    box-shadow: none;
  }
}

.select-wrap.el-textarea {
  ::v-deep(.el-textarea__inner) {
    box-shadow: none;
  }
}
</style>
