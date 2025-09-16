<template>
  <gv-popup ref="popupRef" :title="title" :async="true" width="500px" auto-focus @confirm="handleSubmit" @close="handleClose">
    <div class="flex-row align-center justify-center mb-12">
      <gv-icon class="fz-24 text-warning mr-4" name="el-icon-warning-filled" />
      <span class="fz-16">{{ $t('finance.code_washing.settler_confirm_all_tips') }}</span>
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
import { onBeforeUnmount, ref, shallowRef } from 'vue';
import layer from '@/tools/layer';
import { formatServerTime, getTimeFormat, printElement } from '@/tools';
import { NUMBER_HANDLER } from '@/values';
import { financeCodeWashingSettler } from '@/api/finance/code-washing';
import { getCodeWashingTempReceipts } from '@/views/finance/code-washing-log/_models';
import { systemState } from '@/store/system';
import dayjs from 'dayjs';
import { $t } from '@/lang/i18n';
import GvIcon from '@/components/gv-icon/index.vue';
import { SELECT_CACHE_KEYS, useSelectCache } from '@/hooks/select-cache';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const formData = shallowRef({});
const title = ref();
const isPrint = ref(true);

// 选项缓存
const selectCache = useSelectCache(SELECT_CACHE_KEYS.user_chip_print_all);

const open = async (_title, _form) => {
  title.value = _title;
  formData.value = _form;
  popupRef.value?.open();
};

// 提交
const handleSubmit = async (type) => {
  await layer.confirm($t('finance.code_washing.settler_confirm_simple_tips'));
  layer.loading();
  const params = { ...formData.value, amount_type: type };
  const res = await financeCodeWashingSettler(params);
  layer.closeLoading();
  layer.msgSuccess($t('finance.code_washing.settler_success'));
  popupRef.value?.close();
  emit('success');
  if (isPrint.value && !!res[0]) {
    const infoList = res.map((info) => {
      return {
        ...info,
        web_name: systemState.config.web_name,
        start_time: dayjs(formatServerTime(info.settler_start_time)).format(getTimeFormat()),
        end_time: dayjs(formatServerTime(info.settler_end_time)).format(getTimeFormat())
      };
    });
    const temp = getCodeWashingTempReceipts(infoList);
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
