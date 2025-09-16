<template>
  <div class="config-wrap">
    <!--    -->
    <div class="config-title flex-row align-center">
      <div class="title flex-1 fz-16 fw-bold text-main">{{ $t('user.list.label_redeem_title') }}</div>
    </div>
    <!--    -->
    <div class="config-content">
      <div class="g-table">
        <div class="g-table-item title"></div>
        <template v-for="currency in optionsData.currencyConfig" :key="currency.id">
          <div class="g-table-item title">{{ $ti(currency.name) }}</div>
        </template>
        <div class="g-table-item title">{{ $t('user.list.label_redeem_sync') }}</div>
      </div>
      <template v-for="game in optionsData.gameList" :key="game.id">
        <div class="g-table">
          <div class="g-table-item">{{ $ti(game.name) }}</div>
          <template v-for="currency in optionsData.currencyConfig" :key="getMultipleKey(game.id, currency.id)">
            <div class="g-table-item">
              <template v-if="configList[getConfigIndex(game.id, currency.id)]">
                <gv-input-amount-placeholder
                  v-model="configList[getConfigIndex(game.id, currency.id)].rate"
                  :min="0"
                  :max="100"
                  :controls="false"
                  placeholder=""
                  class="w-full"
                  :data-command="GAME_CONFIG_MARK.redeem"
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
    <!--    -->
    <div class="config-footer">
      <el-button type="primary" @click="handleSubmit()">{{ $t('common.save_btn') }}</el-button>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, reactive } from 'vue';
import { STATUS_VALUE } from '@/values';
import { userEditAttr } from '@/api/user/list';
import layer from '@/tools/layer';
import { getMultipleKey, mappingArrayToObject, syncObjectData } from '@/tools';
import { GAME_CONFIG_MARK } from '@/views/user/list/_components/_values';
import GvInputAmountPlaceholder from '@/components/gv-input-amount/placeholder.vue';
import { getExchangeStatus } from '@/tools/status-value';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const optionsData = inject('optionsData');
const userInfo = inject('userInfo');

// 默认配置模板
const configTemp = { id: null, game_id: null, currency_config_id: null, is_follow: STATUS_VALUE.disable, rate: 0 };

// 配置列表
const configList = reactive([]);

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
const init = async (values) => {
  const _configList = checkConfigList(values.map((val) => syncObjectData({ ...configTemp }, val)));
  configList.splice(0);
  configList.push(..._configList);
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

// 提交表单
const handleSubmit = async (loading = true) => {
  const params = { user_id: userInfo.value?.id, attr_name: 'integral', data: configList };
  if (loading) layer.loading();
  await userEditAttr(params);
  if (loading) layer.closeLoading();
  if (loading) layer.msgSuccess($t('common.save_success'));
};

defineExpose({ open, init, setValueToAll, handleSubmit });
</script>
<style lang="scss" scoped>
@use '../_style/index.scss';
</style>
