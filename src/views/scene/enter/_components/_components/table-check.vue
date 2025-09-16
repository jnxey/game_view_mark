<template>
  <gv-popup
    ref="popupRef"
    :title="$t('scene.enter.title_check')"
    :async="true"
    :width="getPX(wrapWidth)"
    custom-class="near-top"
    max-height="calc(92vh - 80px)"
    :show-footer="false"
  >
    <div class="content-wrap flex-row align-top flex-wrap justify-around pb-16" :style="{ width: getPX(contentWidth) }">
      <div v-for="currency in currencyBaseUsed" :key="currency.id" class="gv-custom-table padding-small fz-14" :style="{ width: getPX(singleSize) }">
        <table>
          <thead>
            <tr>
              <th class="title">{{ $t('scene.enter.label_check_face_value') }}</th>
              <th class="title">{{ $t('scene.enter.label_check_number') }}</th>
              <th class="title">{{ $t('scene.enter.label_check_count') }}</th>
              <th class="title w-120">{{ $t('scene.enter.label_check_chip_inc_dec') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="4">
                <div class="flex-row">
                  <div class="flex-1 flex-row align-center text-primary">
                    <el-avatar :size="18" :src="getBaseImagUrl(currency.image)" />
                    <span class="ml-8">{{ currency.icon }}{{ $ti(currency.name) }} {{ $t('scene.enter.label_check_chip') }}</span>
                  </div>
                  <div class="flex-1 flex-row align-center justify-end">
                    <span>{{ $t('scene.enter.label_check_gap') }}：</span>
                    <span class="gap-amount fz-16 fw-bold" :class="{ fit: !currentGap[getMultipleKey(currency.id, CURRENCY_TYPE.chips)] ?? 0 }">
                      {{ currentGap[getMultipleKey(currency.id, CURRENCY_TYPE.chips)] ?? 0 }}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
            <tr
              v-for="(item, index) in faceConfigMap[getMultipleKey(currency.id, CURRENCY_TYPE.chips)] ?? []"
              :key="getMultipleKey(currency.id, item.id)"
            >
              <td>{{ item.name }}</td>
              <td>
                <el-input-number
                  class="w-full v-keyboard-wrap"
                  v-model="currentValue[getMultipleKey(currency.id, item.id, CURRENCY_TYPE.chips)]"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  step-strictly
                  :controls="false"
                  size="small"
                />
              </td>
              <td>
                {{ getFaceCount(item.value, currentValue[getMultipleKey(currency.id, item.id, CURRENCY_TYPE.chips)]) }}
              </td>
              <td v-if="!index" :rowspan="faceConfigMap[getMultipleKey(currency.id, CURRENCY_TYPE.chips)]?.length" class="left inc-dec-td">
                <div class="virtual-box fz-10">
                  {{ $t('scene.enter.label_check_chip_inc') }}
                  <span class="text-warning ml-4">
                    {{ tableIncDecCount[getMultipleKey(currency.id, CURRENCY_TYPE.chips, NUMBER_HANDLER.inc)] ?? 0 }}
                  </span>
                </div>
                <div class="virtual-box border fz-10">
                  {{ $t('scene.enter.label_check_chip_dec') }}
                  <span class="text-warning ml-4">
                    {{ tableIncDecCount[getMultipleKey(currency.id, CURRENCY_TYPE.chips, NUMBER_HANDLER.dec)] ?? 0 }}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div class="flex-row">
                  <div class="flex-1 flex-row align-center text-primary">
                    <el-avatar :size="18" :src="getBaseImagUrl(currency.image)" />
                    <span class="ml-8">{{ currency.icon }}{{ $ti(currency.name) }} {{ $t('scene.enter.label_check_cash') }}</span>
                  </div>
                  <div class="flex-1 flex-row align-center justify-end">
                    <span>{{ $t('scene.enter.label_check_gap') }}：</span>
                    <span class="gap-amount fz-16 fw-bold" :class="{ fit: !currentGap[getMultipleKey(currency.id, CURRENCY_TYPE.cash)] }">
                      {{ currentGap[getMultipleKey(currency.id, CURRENCY_TYPE.cash)] }}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
            <tr
              v-for="(item, index) in faceConfigMap[getMultipleKey(currency.id, CURRENCY_TYPE.cash)] ?? []"
              :key="getMultipleKey(currency.id, item.id)"
            >
              <td>{{ item.name }}</td>
              <td>
                <el-input-number
                  class="w-full v-keyboard-wrap"
                  v-model="currentValue[getMultipleKey(currency.id, item.id, CURRENCY_TYPE.cash)]"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  step-strictly
                  :controls="false"
                  size="small"
                />
              </td>
              <td>
                {{ getFaceCount(item.value, currentValue[getMultipleKey(currency.id, item.id, CURRENCY_TYPE.cash)]) }}
              </td>
              <td v-if="!index" :rowspan="faceConfigMap[getMultipleKey(currency.id, CURRENCY_TYPE.cash)]?.length" class="left inc-dec-td">
                <div class="virtual-box fz-10">
                  {{ $t('scene.enter.label_check_cash_inc') }}
                  <span class="text-warning ml-4">
                    {{ tableIncDecCount[getMultipleKey(currency.id, CURRENCY_TYPE.cash, NUMBER_HANDLER.inc)] ?? 0 }}
                  </span>
                </div>
                <div class="virtual-box border fz-10">
                  {{ $t('scene.enter.label_check_cash_dec') }}
                  <span class="text-warning ml-4">
                    {{ tableIncDecCount[getMultipleKey(currency.id, CURRENCY_TYPE.cash, NUMBER_HANDLER.dec)] ?? 0 }}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="left">
                <span>{{ $t('scene.enter.label_check_count') }}：</span>
                <span class="gap-amount fz-16 fw-bold" :class="{ fit: !currentAllGap[currency.id] }">{{ currentAllGap[currency.id] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex-row justify-center pb-16">
      <el-button :type="submitDanger ? 'danger' : 'primary'" size="large" round @click="handleSubmit">
        {{ $t('scene.enter.label_check_btn') }}
      </el-button>
    </div>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, inject, ref, shallowRef, unref } from 'vue';
import { reportGameCheckGet, reportGameCheckSet } from '@/api/report/game-check';
import layer from '@/tools/layer';
import { calcAmount, getBaseImagUrl, getMultipleKey, getPX, getWindowSize, mappingArrayToObject } from '@/tools';
import { formatFaceConfig } from '@/views/scene/enter/_models/face-config';
import { CURRENCY_TYPE, NUMBER_HANDLER } from '@/values';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const singleSize = 400;

const tableInfo = inject('tableInfo');
const openingInfo = inject('openingInfo');
const faceConfig = inject('faceConfig');
const currencyBase = inject('currencyBase');
const currencyConfig = inject('currencyConfig');
const handleNextBoot = inject('handleNextBoot');

const emit = defineEmits(['success', 'close']);

const popupRef = shallowRef();
const checkInfo = shallowRef();
const currentValue = ref({});
const currencyEditIdMap = ref({});
// 外层宽度
const wrapWidth = computed(() => Math.min(getWindowSize().width * 0.8, currencyBaseUsed.value.length * (singleSize + 20) + 40));
// 内容宽度
const contentWidth = computed(() => currencyBaseUsed.value.length * (singleSize + 20));
// 币种map
const currencyConfigMap = computed(() => mappingArrayToObject(unref(currencyConfig)));
// 面值
const faceConfigMap = computed(() => formatFaceConfig(unref(faceConfig), unref(currencyConfigMap)));

// 增减码统计数据
const tableIncDecCount = computed(() => {
  const result = {};
  const cMap = currencyConfigMap.value;
  const countList = checkInfo.value?.table_inc_dec_count ?? [];
  countList.forEach((item) => {
    const cId = cMap[item.currency_config_id].currency_id;
    const cType = cMap[item.currency_config_id].type;
    const key = getMultipleKey(cId, cType, item.type);
    result[key] = Number(item.sum_number);
  });
  return result;
});

// 支持的基础货币
const currencyBaseUsed = computed(() => {
  const map = {};
  const baseList = currencyBase.value ?? [];
  const configList = currencyConfig.value ?? [];
  configList.forEach((item) => (map[item.currency_id] = true));
  return baseList.filter((val) => map[val.id]);
});

// 差距计算
const currentGap = computed(() => {
  const result = {};
  const currency = currencyBaseUsed.value ?? [];
  const base = checkInfo.value?.table_base_use;
  const value = currentValue.value;
  currency.forEach((c) => {
    const chips = faceConfigMap.value[getMultipleKey(c.id, CURRENCY_TYPE.chips)] ?? [];
    const cash = faceConfigMap.value[getMultipleKey(c.id, CURRENCY_TYPE.cash)] ?? [];
    // chips
    const chipId = getConfigId(c.id, CURRENCY_TYPE.chips);
    // cash
    const cashId = getConfigId(c.id, CURRENCY_TYPE.cash);
    // 当前台面余额
    const chipAmount = Number(base[chipId]?.base_number ?? 0);
    const cashAmount = Number(base[cashId]?.base_number ?? 0);
    // 当前输入金额总计
    let chipCount = 0;
    let cashCount = 0;
    chips.forEach((p) => (chipCount += (value[getMultipleKey(c.id, p.id, CURRENCY_TYPE.chips)] ?? 0) * Number(p.value)));
    cash.forEach((p) => (cashCount += (value[getMultipleKey(c.id, p.id, CURRENCY_TYPE.cash)] ?? 0) * Number(p.value)));
    // 设置
    result[getMultipleKey(c.id, CURRENCY_TYPE.chips)] = calcAmount(chipCount - chipAmount);
    result[getMultipleKey(c.id, CURRENCY_TYPE.cash)] = calcAmount(cashCount - cashAmount);
  });
  return result;
});

// 总差距计算
const currentAllGap = computed(() => {
  const result = {};
  const currency = currencyBaseUsed.value ?? [];
  const gap = currentGap.value;
  currency.forEach((c) => {
    result[c.id] = calcAmount(gap[getMultipleKey(c.id, CURRENCY_TYPE.chips)] + gap[getMultipleKey(c.id, CURRENCY_TYPE.cash)]);
  });
  return result;
});

// 按钮置为危险状态
const submitDanger = computed(() => {
  const gap = currentGap.value;
  let count = 0;
  Object.keys(gap).forEach((p) => (count = calcAmount(count + gap[p])));
  return !!count;
});

// 获取面值合计
const getFaceCount = (value, count) => {
  return Math.floor(Number(value ?? 0) * Number(count ?? 0)) || '';
};

// 通过基础货币ID和货币类型获取币种ID
const getConfigId = (cid, type) => {
  const currency = currencyConfig.value ?? [];
  const key = currency.findIndex((val) => val.currency_id === cid && val.type === type);
  return currency[key]?.id;
};

// 打开
const open = async (tableId, _checkInfo, value, editIdMap) => {
  if (!!_checkInfo) {
    checkInfo.value = _checkInfo;
    currentValue.value = value ?? {};
    currencyEditIdMap.value = editIdMap ?? {};
  } else {
    layer.loading();
    currentValue.value = {};
    currencyEditIdMap.value = {};
    checkInfo.value = await reportGameCheckGet({ table_id: tableId });
    layer.closeLoading();
  }
  popupRef.value?.open();
};

// 提交
const handleSubmit = async () => {
  await layer.confirm(submitDanger.value ? $t('scene.enter.tips_confirm_check_gap') : $t('scene.enter.tips_confirm_check'));
  const { id, table_type_id, game_id } = tableInfo.value;
  const { boot_number, report_game_close_id = 0, check_id = null } = openingInfo.value;
  const params = { id: check_id, table_id: id, table_type_id, report_game_close_id, game_id, boot_number, remark: '' };
  const checkData = [];
  const currency = currencyConfig.value;
  const base = checkInfo.value?.table_base_use;
  const gapMap = currentGap.value;
  const incDecCount = tableIncDecCount.value;
  const current = currentValue.value;
  currency.forEach((c) => {
    const key = getMultipleKey(c.currency_id, c.type);
    const gap = gapMap[getMultipleKey(c.currency_id, c.type)];
    const system = Number(base[c.id]?.base_number ?? 0);
    const checkExtend = [];
    const faceList = faceConfigMap.value[key] ?? [];
    faceList.forEach((f) => {
      const cur = currencyConfigMap.value[f.currency_config_id];
      const key = getMultipleKey(c.currency_id, f.id, cur.type);
      checkExtend.push({ game_check_id: f.id, number: current[key] ?? 0 });
    });
    checkData.push({
      id: currencyEditIdMap.value[c.id],
      currency_id: c.currency_id,
      currency_config_id: c.id,
      manual_value: calcAmount(system + gap),
      system_value: system,
      gap: gap,
      inc_code: incDecCount[getMultipleKey(c.currency_id, c.type, NUMBER_HANDLER.inc)] ?? 0,
      dec_code: incDecCount[getMultipleKey(c.currency_id, c.type, NUMBER_HANDLER.dec)] ?? 0,
      check_extend: checkExtend
    });
  });
  params.data = checkData;
  layer.loading();
  await reportGameCheckSet(params);
  layer.closeLoading();
  layer.msgSuccess($t('scene.enter.tips_check_success'));
  popupRef.value?.close();
  handleNextBoot();
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.content-wrap {
  margin: 0 auto;

  ::v-deep(.el-input__wrapper) {
    padding-left: 5px;
    padding-right: 5px;
  }

  .gap-amount {
    color: var(--el-color-danger);

    &.fit {
      color: var(--el-text-color-placeholder);
    }
  }

  .inc-dec-td {
    padding: 0;
    vertical-align: top;

    .virtual-box {
      padding: 5px 8px;
      line-height: 1.5;

      &.border {
        border-top: 1px solid var(--el-border-color);
        border-bottom: 1px solid var(--el-border-color);
      }
    }
  }
}
</style>
