<template>
  <teleport to="#app">
    <div v-if="isVisible" class="chip-change-summary" :style="contentStyle">
      <div class="title fz-16 fw-bold" ref="elRef">{{ $t('finance.user_chip_log.summary_title') }}</div>
      <el-scrollbar max-height="60vh">
        <div class="flex-row flex-nowrap">
          <div v-if="!summaryMap.hasValue" class="flex-row justify-center w-full">
            <el-empty :image-size="50" />
          </div>
          <template v-for="item in currencyConfig" :key="item.id">
            <div v-if="!!summaryMap[item.id]" class="currency-box mr-16">
              <div class="flex-col">
                <div class="currency-title flex-row align-center mb-8">
                  <el-avatar :size="22" :src="item.image" />
                  <span class="fz-16 fw-bold ml-8">{{ $ti(item.name) }}</span>
                </div>
                <div class="currency-chip flex-row align-center mb-16">
                  <span class="fw-bold">{{ $t('finance.user_chip.chip_balance') }}</span>
                  <span class="ml-8">{{ $t('common.log_before_value') }}</span>
                  <span class="ml-4 fw-bold text-warning">{{ beforeValue[item.id]?.before_value }}</span>
                  <!--                  -->
                  <span class="ml-8">{{ $t('log.change_value') }}</span>
                  <span class="ml-4 fw-bold text-warning">{{ calcAmount(summaryMap.sum[item.id] ?? 0, false) }}</span>
                  <span class="ml-8">{{ $t('common.log_after_value') }}</span>
                  <span class="ml-4 fw-bold text-warning">
                    {{ calcAmount((summaryMap.sum[item.id] ?? 0) + Number(beforeValue[item.id]?.before_value), false) }}
                  </span>
                </div>
                <div class="summary-box flex-row align-top flex-nowrap">
                  <div class="flex-col mr-8">
                    <div
                      class="summary-item flex-row align-center flex-nowrap mb-8"
                      v-for="action in financeActionSplit[0]"
                      :key="getMultipleKey(item.id, action.value)"
                    >
                      <span class="label fz-14">{{ action.name }}</span>
                      <span class="fz-14 ml-8">
                        <gv-profit :value="summaryMap[item.id]?.map?.[action.value]" />
                      </span>
                    </div>
                  </div>
                  <div class="flex-col mr-8">
                    <div
                      class="summary-item flex-row align-center flex-nowrap mb-8"
                      v-for="action in financeActionSplit[1]"
                      :key="getMultipleKey(item.id, action.value)"
                    >
                      <span class="label fz-14">{{ action.name }}</span>
                      <span class="fz-14 ml-8">
                        <gv-profit :value="summaryMap[item.id]?.map?.[action.value]" />
                      </span>
                    </div>
                  </div>
                  <div class="flex-col">
                    <div
                      class="summary-item flex-row align-center flex-nowrap mb-8"
                      v-for="action in financeActionSplit[2]"
                      :key="getMultipleKey(item.id, action.value)"
                    >
                      <span class="label fz-14">{{ action.name }}</span>
                      <span class="fz-14 ml-8">
                        <gv-profit :value="summaryMap[item.id]?.map?.[action.value]" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </el-scrollbar>
      <div class="close-icon p-4 cursor-pointer" @click="close">
        <gv-icon class="fz-24" name="el-icon-circle-close" />
      </div>
    </div>
  </teleport>
</template>
<script setup>
import { computed, nextTick, onBeforeUnmount, ref, shallowRef } from 'vue';
import { calcAmount, chunkArray, getMultipleKey, getPX, mappingArrayToObject } from '@/tools';
import { $ti } from '@/lang/input';
import { FINANCE_ACTION } from '@/views/finance/user-chip-log/_models/finance';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';
import { useDrag } from '@/hooks/drag';
import GvProfit from '@/components/gv-profit/index.vue';
import { onDeactivated } from '@vue/runtime-core';

const financeActionSplit = chunkArray(
  FINANCE_ACTION.filter((item) => !item.no_count),
  Math.ceil(FINANCE_ACTION.length / 3)
);

const props = defineProps({ currencyConfig: Array });

const isVisible = ref(false);
const beforeValue = ref({});
const summaryList = ref([]);
const elRef = shallowRef();

const { pointer, resetPointer, setDragDom } = useDrag();

const contentStyle = computed(() => {
  return { top: getPX(pointer.y), left: getPX(pointer.x) };
});

const summaryMap = computed(() => {
  const cList = props.currencyConfig ?? [];
  const sList = summaryList.value ?? [];
  const result = {};
  const sum = {};
  cList.forEach((item) => {
    sum[item.id] = 0;
    sList.forEach((sItem) => {
      if (item.id === sItem.currency_config_id) {
        if (!result[item.id]) result[item.id] = { image: item.image, name: item.name, map: {} };
        FINANCE_ACTION.forEach((action) => {
          result[item.id].map[action.value] = sItem['total_' + action.value] ?? '0.00';
          sum[item.id] = sum[item.id] + Number(sItem['total_' + action.value] ?? 0);
        });
      }
    });
  });
  console.log({ ...result, sum, hasValue: !!sList.length }, '-------------111');
  return { ...result, sum, hasValue: !!sList.length };
});

const open = async (info) => {
  beforeValue.value = mappingArrayToObject(info?.before_value ?? {}, 'currency_config_id');
  summaryList.value = info?.process_value ?? [];
  isVisible.value = true;
  await nextTick();
  const trigger = document.body.querySelector('#chip-change-summary-trigger');
  if (!trigger) {
    setDragDom(elRef.value, { x: 250, y: 280 });
  } else {
    const rect = trigger.getBoundingClientRect();
    setDragDom(elRef.value, { x: rect.x, y: rect.y });
  }
};

const close = () => {
  resetPointer();
  summaryList.value = [];
  isVisible.value = false;
};

onDeactivated(() => close());

defineExpose({ open, close });
</script>
<style scoped>
.chip-change-summary {
  position: fixed;
  top: 0;
  left: 0;
  margin-top: 40px;
  min-width: 200px;
  max-width: 80vw;
  border-radius: var(--gv-border-radius-mid);
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  box-shadow: var(--gv-box-shadow-bottom);
  z-index: 10;

  .title {
    padding: 16px;
    user-select: none;
    cursor: move;
  }

  .currency-box {
    padding-left: 16px;
    padding-bottom: 16px;
    width: fit-content;

    .summary-box {
      max-width: 80vw;
      width: fit-content;
    }

    .summary-item {
      min-width: 180px;
      white-space: nowrap;
      word-break: keep-all;

      .label {
        min-width: 100px;
      }
    }
  }

  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    color: var(--el-text-color-secondary);

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
