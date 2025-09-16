<template>
  <div class="config-wrap">
    <!--    -->
    <div class="config-title">
      <div class="title flex-1 fz-16 fw-bold text-main">{{ $t('user.list.label_shares_title') }}</div>
    </div>
    <!--    -->
    <div class="config-content">
      <div class="shares-type mb-16">
        <el-radio-group :model-value="sharesType" size="large">
          <el-radio
            class="custom-radio mb-4"
            v-for="item in SHARE_REBATE_VALUE_DICT"
            :key="item.value"
            :label="item.name"
            :value="item.value"
            @click="setSharesType(item.value)"
          />
        </el-radio-group>
      </div>
      <!--   支出费用比例   -->
      <div v-show="sharesType === SHARE_REBATE_VALUE.share">
        <div class="single-title mb-8">{{ $t('user.list.cost_rate') }}</div>
        <div class="mb-16">
          <gv-input-amount-placeholder v-model="costRate" class="w-160" :min="0" :max="100" :controls="false">
            <template #suffix><span>%</span></template>
          </gv-input-amount-placeholder>
        </div>
      </div>
      <!--   返点/占股 比例   -->
      <div v-show="sharesType === SHARE_REBATE_VALUE.share || sharesType === SHARE_REBATE_VALUE.rebate">
        <div class="single-title">{{ rateTitle }}</div>
        <div class="g-table">
          <div class="g-table-item title"></div>
          <template v-for="currency in optionsData.currencyConfig" :key="currency.id">
            <div class="g-table-item title">{{ $ti(currency.name) }}</div>
          </template>
          <div class="g-table-item title">{{ $t('user.list.label_shares_sync') }}</div>
        </div>
        <template v-for="game in optionsData.gameList" :key="game.id">
          <div class="g-table">
            <div class="g-table-item">{{ $ti(game.name) }}</div>
            <template v-for="currency in optionsData.currencyConfig" :key="getMultipleKey(game.id, currency.id)">
              <div class="g-table-item">
                <template v-if="configList[getConfigIndex(game.id, currency.id)]">
                  <gv-input-amount-placeholder
                    :data-command="GAME_CONFIG_MARK.shares"
                    v-model="configList[getConfigIndex(game.id, currency.id)].rate"
                    :min="0"
                    :max="100"
                    placeholder=""
                    :controls="false"
                    class="w-full"
                  >
                    <template #suffix><span>%</span></template>
                  </gv-input-amount-placeholder>
                </template>
              </div>
            </template>
            <div class="g-table-item title">
              <el-switch
                :model-value="getFollow(game.id)"
                @click="setFollow(game.id)"
                :active-value="STATUS_VALUE.normal"
                :inactive-value="STATUS_VALUE.disabled"
              />
            </div>
          </div>
        </template>
      </div>
      <!--  返点限制    -->
      <div v-show="sharesType === SHARE_REBATE_VALUE.rebate">
        <rebate-limit ref="rebateLimitRef" />
      </div>
      <!--  按量返比   -->
      <div v-show="sharesType === SHARE_REBATE_VALUE.volume">
        <volume ref="volumeRef" />
      </div>
    </div>
    <div class="config-footer">
      <el-button type="primary" @click="handleSubmit()">{{ $t('common.save_btn') }}</el-button>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, nextTick, reactive, ref, shallowRef } from 'vue';
import { SHARE_REBATE_VALUE, SHARE_REBATE_VALUE_DICT, STATUS_VALUE } from '@/values';
import { userEditAttr } from '@/api/user/list';
import layer from '@/tools/layer';
import { getMultipleKey, mappingArrayToObject, syncObjectData } from '@/tools';
import RebateLimit from '@/views/user/list/_components/_components/rebate-limit.vue';
import Volume from '@/views/user/list/_components/_components/volume.vue';
import { GAME_CONFIG_MARK } from '@/views/user/list/_components/_values';
import GvInputAmountPlaceholder from '@/components/gv-input-amount/placeholder.vue';
import { getExchangeStatus } from '@/tools/status-value';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const optionsData = inject('optionsData');
const userInfo = inject('userInfo');
const initPosition = inject('initPosition');
const rebateLimitRef = shallowRef();
const volumeRef = shallowRef();

// 默认配置模板
const configTemp = {
  id: null,
  game_id: null,
  currency_config_id: null,
  is_follow: STATUS_VALUE.disable,
  rate: 0
};

const cacheConfig = { mode: null };

// 支出费用比例
const costRate = ref();

// 配置列表
const configList = reactive([]);

// 占股类型
const sharesType = ref(SHARE_REBATE_VALUE.ordinary);

// 比例标题
const rateTitle = computed(() => {
  if (sharesType.value === SHARE_REBATE_VALUE.share) {
    return $t('user.list.label_shares_share');
  } else if (sharesType.value === SHARE_REBATE_VALUE.rebate) {
    return $t('user.list.label_shares_rebate');
  }
});

// 每个kind、currency对应的配置列表索引
const source = computed(() => {
  const result = {};
  configList.forEach((item, index) => {
    if (!result[item.game_id]) result[item.game_id] = {};
    result[item.game_id][item.currency_config_id] = index;
  });
  return result;
});

// 初始化
const init = async (values, limitList, volume, rate) => {
  sharesType.value = userInfo.value?.is_shares;
  cacheConfig.mode = userInfo.value?.is_shares;
  cacheConfig.values = values;
  cacheConfig.limitList = limitList;
  cacheConfig.volume = volume;
  costRate.value = rate;
  resetConfig(values, limitList, volume);
};

// 重置值
const resetConfig = async (values, limitList, volume) => {
  await nextTick();
  const _configList = checkConfigList(values.map((val) => syncObjectData({ ...configTemp }, val)));
  configList.splice(0);
  configList.push(..._configList);
  rebateLimitRef.value?.init(limitList);
  volumeRef.value?.init(volume);
};

// 检查是否有新增的货币
const checkConfigList = (_configList) => {
  const gameList = optionsData.gameList ?? [];
  const currency = optionsData.currencyConfig ?? [];
  const currencyMap = mappingArrayToObject(currency);
  const gameConfig = {};
  const result = [];
  _configList.forEach((item) => {
    if (!currencyMap[item.currency_config_id]) return;
    if (!gameConfig[item.game_id]) gameConfig[item.game_id] = {};
    gameConfig[item.game_id][item.currency_config_id] = item;
    result.push(item);
  });
  gameList.forEach((game) => {
    currency.forEach((cur) => {
      if (!gameConfig[game.id]?.[cur.id]) result.push({ ...configTemp, game_id: Number(game.id), currency_config_id: cur.id });
    });
  });
  return result;
};

// 根据gameId, currencyId获取索引
const getConfigIndex = (gameId, currencyId) => {
  return source.value[gameId]?.[currencyId];
};

// 设置游戏跟随状态
const setSharesType = (type) => {
  sharesType.value = type;
  if (sharesType.value === cacheConfig.mode) {
    // 设置备份值
    resetConfig(cacheConfig.values ?? [], cacheConfig.limitList ?? [], cacheConfig.volume ?? []);
  } else {
    resetConfig([], [], []); // 清空配置
  }
  initPosition();
};

// 获取游戏跟随状态
const getFollow = (gameId) => {
  for (let i = 0; i < configList.length; i++) {
    const config = configList[i];
    if (config.game_id === gameId) return config.is_follow;
  }
  return STATUS_VALUE.disable;
};

// 设置游戏跟随状态
const setFollow = (gameId) => {
  const current = getFollow(gameId);
  for (let i = 0; i < configList.length; i++) {
    const config = configList[i];
    if (config.game_id === gameId) config.is_follow = getExchangeStatus(current);
  }
};

// 设置值到全部
const setValueToAll = (value) => {
  for (let i = 0; i < configList.length; i++) {
    configList[i].rate = value;
  }
};

// 设置值到全部
const setRebateToAll = (value) => {
  rebateLimitRef.value?.setValueToAll(value);
};

// 提交表单
const handleSubmit = async (loading = true) => {
  const validVolume = volumeRef.value.verify();
  if (!validVolume) {
    layer.msgWarning($t('user.list.tips_shares_rebate'));
    layer.closeLoading();
    return Promise.reject();
  }
  const data = sharesType.value === SHARE_REBATE_VALUE.share || sharesType.value === SHARE_REBATE_VALUE.rebate ? configList : [];
  const cRate = sharesType.value === SHARE_REBATE_VALUE.share ? costRate.value : 0;
  const params = { user_id: userInfo.value?.id, attr_name: 'shares', data: data, is_shares: sharesType.value, cost_rate: cRate };
  if (loading) layer.loading();
  await userEditAttr(params);
  if (sharesType.value === SHARE_REBATE_VALUE.rebate) await rebateLimitRef.value.handleSubmit(sharesType.value);
  if (sharesType.value === SHARE_REBATE_VALUE.volume) await volumeRef.value.handleSubmit(sharesType.value);
  if (loading) layer.closeLoading();
  if (loading) layer.msgSuccess($t('common.save_success'));
};

defineExpose({ open, init, setValueToAll, setRebateToAll, handleSubmit });
</script>
<style lang="scss" scoped>
@use '../_style/index.scss';
</style>
