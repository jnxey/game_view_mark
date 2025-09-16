<template>
  <gv-popup ref="popupRef" :title="`【${username}】-${title}`" :async="true" width="480px" auto-focus @confirm="handleSubmit" @close="handleClose">
    <div class="flex-row align-center flex-wrap">
      <div class="mr-8 mb-8">
        <el-button plain @click="setAmount(otherInfo.total_code_washing_fee)">
          {{ $t('finance.code_washing.total_code_washing_fee') }}: {{ currencyIcon }}{{ otherInfo.total_code_washing_fee }}
        </el-button>
      </div>
      <div class="mr-8 mb-8">
        <el-button plain @click="setAmount(otherInfo.mistake_code_washing_fee)">
          {{ $t('finance.code_washing.mistake_code_washing_fee') }}: {{ currencyIcon }}{{ otherInfo.mistake_code_washing_fee }}
        </el-button>
      </div>
      <div class="mr-8 mb-8">
        <el-button plain @click="setAmount(otherInfo.balance_code_washing_fee)">
          {{ $t('finance.code_washing.balance_code_washing_fee') }}: {{ currencyIcon }}{{ otherInfo.balance_code_washing_fee }}
        </el-button>
      </div>
    </div>
    <gv-input-amount v-model="formData.total_amount" :placeholder="$t('finance.code_washing.amount')" :prefix="currencyIcon">
      <template #handler-bottom>
        <el-input type="textarea" :placeholder="$t('common.remark')" class="remark-input" :rows="2" v-model="formData.remark" />
      </template>
    </gv-input-amount>
    <div class="h-20 fz-12 text-placeholder flex-row align-center">
      {{ curBalance > 0 ? $t('finance.code_washing.tips_balance', { suffix: currencyIcon + calcAmount(curBalance, false) }) : '' }}
    </div>
    <template #footer>
      <span class="label mr-8">{{ $t('finance.code_washing.btn_print') }}</span>
      <el-switch v-model="isPrint" :active-value="true" :inactive-value="false" class="mr-8" @change="() => selectCache.setItem(isPrint)" />
      <el-button type="primary" plain @click="handleSubmit(NUMBER_HANDLER.dec)" size="large" round>
        {{ $t('finance.code_washing.settler_cash') }}
      </el-button>
      <el-button type="primary" @click="handleSubmit(NUMBER_HANDLER.inc)" size="large" round>{{ $t('finance.code_washing.settler_chip') }}</el-button>
    </template>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, onBeforeUnmount, reactive, ref, shallowRef, watch } from 'vue';
import layer from '@/tools/layer';
import { calcAmount, formatServerTime, getTimeFormat, isNumber, printElement, syncObjectData } from '@/tools';
import GvInputAmount from '@/components/gv-input-amount/index.vue';
import { NUMBER_HANDLER } from '@/values';
import { BALANCE_TYPE } from '@/views/finance/user-chip/_model';
import { financeCodeWashingSettler } from '@/api/finance/code-washing';
import { getCodeWashingTempReceipts } from '@/views/finance/code-washing-log/_models';
import { systemState } from '@/store/system';
import dayjs from 'dayjs';
import { $t } from '@/lang/i18n';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';

const amountList = [100, 500, 1000, 5000, 10000];
const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const formTemp = {
  cabinet_chip_type_id: BALANCE_TYPE.code_washing.cabinet_chip_type_id,
  code_washing_sn: null,
  time_start: null,
  time_end: null,
  filter_time: null,
  currency_config_id: null,
  user_id: null,
  total_amount: null,
  remark: null
};
const formData = reactive({ ...formTemp });
const title = ref();
const username = ref();
const currencyIcon = ref();
const otherInfo = ref({});
const isPrint = ref(true);
const totalFee = ref(0);

const curBalance = computed(() => totalFee.value - Number(formData.total_amount ?? 0));

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.user_chip_print);

const open = async (_title, _username, _currencyIcon, row, other) => {
  title.value = _title;
  username.value = _username;
  currencyIcon.value = _currencyIcon;
  otherInfo.value = { ...other };
  totalFee.value = calcAmount(other.balance_code_washing_fee + other.mistake_code_washing_fee + other.total_code_washing_fee);
  syncObjectData(formData, { ...formTemp, ...row, total_amount: totalFee.value });
  popupRef.value?.open();
};

// 设置金额
const setAmount = (amount) => {
  formData.total_amount = amount;
};

// 提交
const handleSubmit = async (type) => {
  if (!isNumber(formData.total_amount)) return layer.msgError($t('finance.code_washing.field_check_amount'));
  const { value } = await layer.password('', $t('finance.code_washing.settler_confirm_tips'));
  layer.loading();
  const params = {
    code_washing_sn: formData.code_washing_sn,
    time_start: formData.time_start,
    time_end: formData.time_end,
    remark: formData.remark,
    filter_time: formData.filter_time,
    settler_users: [
      { user_id: formData.user_id, settler_amount: formData.total_amount, currency_config_id: formData.currency_config_id, password: value }
    ],
    cabinet_chip_type_id: 1,
    amount_type: type
  };
  const res = await financeCodeWashingSettler(params);
  layer.closeLoading();
  layer.msgSuccess($t('finance.code_washing.settler_success'));
  popupRef.value?.close();
  emit('success');
  if (isPrint.value && !!res[0]) {
    const info = res[0];
    const temp = getCodeWashingTempReceipts([
      {
        ...info,
        web_name: systemState.config.web_name,
        start_time: dayjs(formatServerTime(info.settler_start_time)).format(getTimeFormat()),
        end_time: dayjs(formatServerTime(info.settler_end_time)).format(getTimeFormat())
      }
    ]);
    printElement(temp);
  }
};

const handleClose = () => {
  emit('close');
};

onBeforeUnmount(() => {
  isPrint.value = selectCache.getItem() ?? true;
});

defineExpose({ open });
</script>
<style scoped lang="scss">
.el-textarea.remark-input {
  ::v-deep(.el-textarea__inner) {
    box-shadow: none;
  }
}
</style>
