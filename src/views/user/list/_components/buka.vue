<template>
  <gv-popup
    ref="popupRef"
    :title="$t('user.list.title_buka', { username: userInfo.username })"
    :async="true"
    width="500px"
    auto-focus
    @confirm="handleSubmit"
    @close="handleClose"
  >
    <div class="content-box">
      <gv-input-amount class="amount-input" v-model="formData.fee" :placeholder="$t('user.list.label_buka_input')" :prefix="currencyInfo.icon">
        <template #handler-bottom>
          <div class="flex-row align-center justify-end">
            <gv-select-currency-base-radio v-model="formData.currency_id" @change="selectCache.setItem" class="justify-end" />
          </div>
        </template>
      </gv-input-amount>
    </div>
  </gv-popup>
</template>
<script setup>
import { userEditAttr } from '@/api/user/list';
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { getListInfoById, syncObjectData } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import { currencyBaseLists } from '@/api/currency/base';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import GvSelectCurrencyBaseRadio from '@/components/gv-select-currency/base-radio.vue';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const formTemp = { fee: '', currency_id: null };
const formData = reactive({ ...formTemp });
const userInfo = ref({});

// 币种列表
const { optionsData, refresh } = useDictOptions({ currency: { api: currencyBaseLists } }, true);

// 选中币种信息
const currencyInfo = computed(() => {
  return getListInfoById(formData.currency_id, optionsData.currency ?? []) || {};
});

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.table_chip_eidt, () => optionsData.currency);

const open = async (row) => {
  await refresh();
  const currencyId = selectCache.getItem();
  userInfo.value = row;
  syncObjectData(formData, { ...formTemp, currency_id: currencyId });
  popupRef.value?.open();
};

// 提交
const handleSubmit = async () => {
  if (!formData.fee || formData.fee <= 0) return layer.msgError($t('user.list.tips_enter_buka'));
  await layer.confirm($t('user.list.tips_confirm_buka', { username: userInfo.value?.username, icon: currencyInfo.value?.icon, fee: formData.fee }));
  const params = { user_id: userInfo.value.id, attr_name: 'buka', data: [{ ...formData }] };
  layer.loading();
  await userEditAttr(params);
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
.content-box {
}
</style>
