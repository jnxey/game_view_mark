<template>
  <div class="gv-input-number-range">
    <div class="title mb-16 fz-14 fw-bold flex-row align-center">
      <el-avatar v-if="icon" :src="getBaseImagUrl(icon)" :size="20" class="mr-8" />
      <span>{{ title }}</span>
    </div>
    <template v-for="(config, index) in configList" :key="config.INDEX">
      <div v-if="!!index" class="range-item flex-row align-center mb-12">
        <div class="item-box left flex-row align-center">
          <div class="w-60 text-placeholder fz-12">-{{ configList[index - 1]?.value ?? '[Empty]' }}</div>
        </div>
        <div class="item-box separator small">
          <gv-icon class="mr-4" name="el-icon-right" />
        </div>
        <div class="item-box middle flex-row align-center">
          <template v-if="index === maxConfigLength">
            <div class="w-80 text-placeholder fz-12">MAX</div>
          </template>
          <template v-else>
            <el-input-number
              v-model="configList[index].value"
              :min="Math.max(1, configList[index - 1]?.value + 1)"
              :max="Number.MAX_SAFE_INTEGER"
              :controls="false"
              class="w-80"
            >
              <template #prefix><span>-</span></template>
            </el-input-number>
          </template>
        </div>
        <div class="item-box separator text-right text-placeholder fz-12">{{ $t('components.gv_input_rebate_range.rebates') }}</div>
        <div class="item-box right flex-row align-center">
          <el-input-number v-model="configList[index].rebate" :min="0" :max="100" :controls="false" class="w-80">
            <template #suffix>%</template>
          </el-input-number>
        </div>
        <el-button class="ml-8" icon="Plus" circle v-if="index === maxConfigSecond" @click="insertNew(index)" />
        <el-button
          class="ml-8"
          type="danger"
          icon="Delete"
          circle
          plain
          v-if="index === maxConfigSecond && configList.length > 3"
          @click="deleteNew(index)"
        />
      </div>
    </template>
  </div>
</template>
<script>
export default { name: 'gv-input-rebate-range' };
</script>
<script setup>
import { computed, reactive } from 'vue';
import { deepClone, getArrayLastKey, getBaseImagUrl, isArray } from '@/tools';
import { $t } from '@/lang/i18n';
import GvIcon from '@/components/gv-icon/index.vue';

const props = defineProps({ currencyId: Number, title: String, icon: String });

const temp = computed(() => {
  return [
    { id: null, value: 0, rebate: 0, currency_id: props.currencyId },
    { id: null, value: null, rebate: null, currency_id: props.currencyId },
    { id: null, value: null, rebate: null, currency_id: props.currencyId }
  ];
});

const configList = reactive([]);

const maxConfigLength = computed(() => configList.length - 1);
const maxConfigSecond = computed(() => configList.length - 2);

const init = (value) => {
  if (!isArray(value) || !value.length) {
    configList.splice(0);
    configList.push(...deepClone(temp.value));
  } else {
    const cList = [...value];
    cList.reverse();
    cList.forEach((item, index) => {
      if (!index) {
        cList[index] = { ...item, value: 0, rebate: 0 };
      } else if (index === getArrayLastKey(cList)) {
        cList[index] = { ...item, value: null };
      } else {
        cList[index] = { ...item, value: Math.abs(Number(item.min)) };
      }
    });
    configList.splice(0);
    configList.push(...cList);
  }
};

// 检查列表是否为空
const checkEmpty = () => {
  let empty = true;
  configList.forEach((item) => {
    if (!!item.value) empty = false;
    if (!!item.rebate) empty = false;
  });
  return empty;
};

// 获取负值
const getValue = (value) => {
  return -1 * value;
};

// 获取配置消息
const getConfig = () => {
  if (checkEmpty(configList)) {
    return [];
  } else {
    const result = [];
    configList.forEach((item, index) => {
      if (!index) {
        result.push({ ...item, min: 0, max: Number.MAX_SAFE_INTEGER });
      } else if (index === getArrayLastKey(configList)) {
        result.push({ ...item, min: Number.MIN_SAFE_INTEGER, max: getValue(configList[index - 1].value) });
      } else {
        result.push({ ...item, min: getValue(item.value), max: getValue(configList[index - 1].value) });
      }
    });
    result.reverse();
    return result;
  }
};

const insertNew = async (index) => {
  const item = { id: null, value: null, rebate: null, currency_id: props.currencyId };
  configList.splice(index + 1, 0, item);
};

const deleteNew = async (index) => {
  configList.splice(index, 1);
};

defineExpose({ init, getConfig });
</script>
<style lang="scss" scoped>
.gv-input-number-range {
  padding: 15px;
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color);

  .item-box {
    &.separator {
      width: 50px;
      margin: 0 5px;
      white-space: nowrap;
      word-break: keep-all;

      &.small {
        width: 20px;
      }
    }
  }

  ::v-deep(.el-input__wrapper) {
    padding-left: 5px;
    padding-right: 5px;

    .el-input__prefix-inner > :last-child {
      margin-right: 4px;
    }
  }
}
</style>
