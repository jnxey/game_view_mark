<template>
  <gv-popup ref="popupRef" title="收码" :async="true" :width="getPX(wrapWidth)" :show-footer="false">
    <div class="content-wrap flex-row align-center flex-wrap justify-around pb-16" :style="{ width: getPX(contentWidth) }">
      <div v-for="currency in currencyBaseUsed" :key="currency.id" class="gv-custom-table fz-14" :style="{ width: getPX(singleSize) }">
        <el-divider content-position="left">{{ currency.icon }}</el-divider>
        <table>
          <tbody v-if="!!closeInfoShow[currency.id]">
            <tr>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_chip_sm_number') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.chips]?.sm_number }}</td>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_cash_sm_number') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.cash]?.sm_number }}</td>
            </tr>
            <tr>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_chip_bet_profit_loss') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.chips]?.bet_profit_loss }}</td>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_cash_bet_profit_loss') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.cash]?.bet_profit_loss }}</td>
            </tr>
            <tr>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_chip_inc_code') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.chips]?.inc_code }}</td>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_cash_inc_code') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.cash]?.inc_code }}</td>
            </tr>
            <tr>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_chip_dec_code') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.chips]?.dec_code }}</td>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_cash_dec_code') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.cash]?.dec_code }}</td>
            </tr>
            <tr>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_chip_inc_dec_count') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.chips]?.inc_dec_count }}</td>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_cash_inc_dec_count') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.cash]?.inc_dec_count }}</td>
            </tr>
            <tr>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_chip_code_washing') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.chips]?.code_washing }}</td>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_cash_code_washing') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.cash]?.code_washing }}</td>
            </tr>
            <tr>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_chip_code_washing_fee') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.chips]?.code_washing_fee }}</td>
              <td class="left">{{ currency.icon }}{{ $t('scene.enter.label_close_cash_code_washing_fee') }}</td>
              <td class="left">{{ closeInfoShow[currency.id][CURRENCY_TYPE.cash]?.code_washing_fee }}</td>
            </tr>
            <tr>
              <td class="left" colspan="2">{{ currency.icon }}{{ $t('scene.enter.label_close_bet_profit_loss') }}</td>
              <td class="left" colspan="2">
                {{
                  getCount(
                    closeInfoShow[currency.id][CURRENCY_TYPE.chips]?.bet_profit_loss,
                    closeInfoShow[currency.id][CURRENCY_TYPE.cash]?.bet_profit_loss
                  )
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex-row justify-center pb-16">
      <el-button type="primary" size="large" round @click="handleSubmit">{{ $t('scene.enter.label_close_btn') }}</el-button>
    </div>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, inject, ref, shallowRef, unref } from 'vue';
import { reportGameCloseGet, reportGameCloseSet } from '@/api/report/game-check';
import layer from '@/tools/layer';
import { calcAmount, getPX, getWindowSize, mappingArrayToObject } from '@/tools';
import { CURRENCY_TYPE } from '@/values';
import { $t } from '@/lang/i18n';

const singleSize = 420;

const tableInfo = inject('tableInfo');
const openingInfo = inject('openingInfo');
const currencyBase = inject('currencyBase');
const currencyConfig = inject('currencyConfig');
const handleNextBoot = inject('handleNextBoot');

const emit = defineEmits(['success', 'close']);

const popupRef = shallowRef();
const closeInfo = shallowRef();
const currentValue = ref({});

// 支持的基础货币
const currencyBaseUsed = computed(() => {
  const map = {};
  const baseList = currencyBase.value ?? [];
  const configList = currencyConfig.value ?? [];
  configList.forEach((item) => (map[item.currency_id] = true));
  return baseList.filter((val) => map[val.id]);
});

// 支持的基础货币-map
const currencyConfigMap = computed(() => mappingArrayToObject(unref(currencyConfig)));

// 收码信息展示
const closeInfoShow = computed(() => {
  const result = {};
  const close = closeInfo.value ?? [];
  const baseList = currencyBaseUsed.value;
  const configMap = currencyConfigMap.value;
  baseList.forEach((currency) => {
    close.forEach((item) => {
      if (currency.id === item.currency_id) {
        const type = configMap[item.currency_config_id]?.type;
        if (!result[currency.id]) result[currency.id] = {};
        result[currency.id][type] = { ...item };
      }
    });
  });
  return result;
});

// 外层宽度
const wrapWidth = computed(() => Math.min(getWindowSize().width * 0.8, currencyBaseUsed.value.length * (singleSize + 20) + 40));

// 内容宽度
const contentWidth = computed(() => currencyBaseUsed.value.length * (singleSize + 20));

// 打开
const open = async (tableId) => {
  layer.loading();
  currentValue.value = {};
  const lists = await reportGameCloseGet({ table_id: tableId });
  closeInfo.value = lists.map((item) => {
    Object.keys(item).forEach((p) => (item[p] = Number(item[p])));
    item.inc = item.inc_code;
    item.dec = item.dec_code;
    return { ...item, inc_dec_count: calcAmount(item.inc + item.dec * -1) };
  });
  layer.closeLoading();
  popupRef.value?.open();
};

// 处理合计
const getCount = (n1, n2) => {
  return calcAmount(Number(n1 || 0) + Number(n2 || 0));
};

// 提交
const handleSubmit = async () => {
  await layer.confirm($t('scene.enter.tips_confirm_close'));
  const { id, table_type_id, game_id } = tableInfo.value;
  const { boot_number } = openingInfo.value;
  const params = { table_id: id, table_type_id, game_id, boot_number };
  params.data = unref(closeInfo);
  layer.loading();
  await reportGameCloseSet(params);
  layer.closeLoading();
  handleNextBoot();
  layer.msgSuccess($t('scene.enter.tips_close_success'));
  popupRef.value?.close();
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.content-wrap {
  margin: 0 auto;
}
</style>
