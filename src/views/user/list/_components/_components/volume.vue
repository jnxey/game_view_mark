<template>
  <div class="rebate-limit">
    <div class="flex-row align-center">
      <div class="single-title flex-1">{{ $t('user.list.label_volume_title') }}</div>
      <div class="flex-row align-center">
        <span class="mr-8">{{ $t('user.list.label_volume_sync') }}</span>
        <el-switch v-model="volumeIsFollow" :active-value="STATUS_VALUE.normal" :inactive-value="STATUS_VALUE.disabled" />
      </div>
    </div>
    <template v-for="currency in optionsData.currencyBase" :key="currency.id">
      <div class="g-table-item mb-16">
        <gv-input-rebate-range
          :ref="(vm) => setRangeVm(vm, currency.id)"
          :currency-id="currency.id"
          :title="$ti(currency.name)"
          :icon="currency.image"
        />
      </div>
    </template>
  </div>
</template>
<script setup>
import { inject, nextTick, reactive, ref, shallowRef } from 'vue';
import { SHARE_REBATE_VALUE, STATUS_VALUE } from '@/values';
import { userEditAttr } from '@/api/user/list';
import { isNumber, syncObjectData } from '@/tools';
import GvInputRebateRange from '@/components/gv-input-rebate-range/index.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const optionsData = inject('optionsData');
const userInfo = inject('userInfo');

const formRef = shallowRef();

// 默认配置模板
const configTemp = { id: null, currency_id: null, min: 0, max: 0, rebate: 0 };

// 配置列表
const configList = reactive([]);
// 配置列表-货币切割
const configMap = reactive({});
// 范围组件的实体
const configVM = shallowRef({});
// 是否同步下级
const volumeIsFollow = ref(false);

// 初始化
const init = async (values) => {
  volumeIsFollow.value = userInfo.value?.volume_is_follow;
  const _configList = values.map((val) => syncObjectData({ ...configTemp }, val));
  _configList.sort((a, b) => a.min - b.min);
  configList.splice(0);
  configList.push(..._configList);
  initConfigMap();
};

// 每个kind、currency对应的配置列表索引
const initConfigMap = async () => {
  await nextTick();
  const currency = optionsData.currencyBase ?? [];
  currency.forEach((item) => {
    configMap[item.id] = [];
  });
  configList.forEach((item) => {
    configMap[item.currency_id].push(item);
  });
  currency.forEach((item) => {
    if (configVM.value[item.id]) configVM.value[item.id].init(configMap[item.id]);
  });
};

// 设置实体
const setRangeVm = (vm, id) => {
  configVM.value[id] = vm;
};

// 获取实体配置
const getRangeVmConfig = () => {
  const currency = optionsData.currencyBase ?? [];
  const result = [];
  currency.forEach((item) => {
    if (configVM.value[item.id]) {
      const list = configVM.value[item.id].getConfig() ?? [];
      result.push(...list);
    }
  });
  return result;
};

// 验证参数
const verify = () => {
  const configList = getRangeVmConfig();
  let valid = true;
  configList.forEach((item) => {
    if (!isNumber(item.min)) valid = false;
    if (!isNumber(item.max)) valid = false;
    if (!isNumber(item.rebate)) valid = false;
  });
  return valid;
};

// 提交表单
const handleSubmit = async (sharesType) => {
  const configList = getRangeVmConfig();
  const params = {
    user_id: userInfo.value?.id,
    attr_name: 'volume',
    is_shares: sharesType,
    volume_is_follow: volumeIsFollow.value,
    data: sharesType === SHARE_REBATE_VALUE.volume ? configList : []
  };
  await userEditAttr(params);
};

defineExpose({ open, init, verify, handleSubmit });
</script>
<style lang="scss" scoped>
@use '../_style/index.scss';
</style>
