<template>
  <gv-popup ref="popupRef" :title="`【${name}】-${title}`" :async="true" width="500px" auto-focus @confirm="handleSubmit" @close="handleClose">
    <gv-input-amount v-model="formData.total_amount" :placeholder="$t('finance.user_chip.amount')" :prefix="currencyIcon">
      <template #handler-bottom>
        <el-input type="textarea" :placeholder="$t('common.remark')" class="remark-input" :rows="2" v-model="formData.remark" />
      </template>
    </gv-input-amount>
    <template #footer>
      <el-button type="danger" plain @click="handleSubmit(NUMBER_HANDLER.dec)" size="large" round>
        {{ $t('finance.user_chip.btn_confirm_take') }}
      </el-button>
      <el-button type="primary" @click="handleSubmit(NUMBER_HANDLER.inc)" size="large" round>
        {{ $t('finance.user_chip.btn_confirm_save') }}
      </el-button>
    </template>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { reactive, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { parseDict, syncObjectData } from '@/tools';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import { NUMBER_HANDLER, NUMBER_HANDLER_DICT } from '@/values';
import { financeCabinetChipSetAmount } from '@/api/finance/cabinet-chip';
import { $t } from '@/lang/i18n';
const balanceHandlerDict = parseDict(NUMBER_HANDLER_DICT);
const emits = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const formTemp = { id: null, total_amount: null, remark: '' };
const formData = reactive({ ...formTemp });
const title = ref();
const name = ref();
const currencyIcon = ref();

const open = async (_title, _name, _currencyIcon, row) => {
  title.value = _title;
  name.value = _name;
  currencyIcon.value = _currencyIcon;
  syncObjectData(formData, { ...formTemp, ...row });
  popupRef.value?.open();
};

// 提交
const handleSubmit = async (type) => {
  if (!formData.total_amount) return layer.msgError($t('finance.user_chip.field_check_amount'));
  const { value } = await layer.password(
    `${$t('common.confirm_btn')}【${name.value}-${title.value}】${balanceHandlerDict[type].name} ${currencyIcon.value} ${formData.total_amount}`
  );
  layer.loading();
  await financeCabinetChipSetAmount({ ...formData, amount_type: type, password: value });
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
  popupRef.value?.close();
  emits('success');
};

const handleClose = () => {
  emits('close');
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
