<template>
  <gv-popup
    ref="popupRef"
    :title="$t('game.list.title_add')"
    width="820px"
    @confirm="handleSubmit"
    @close="handleClose"
    :confirm-button-text="buttonNext"
  >
    <el-steps :active="active" align-center class="step-wrap" process-status="finish" finish-status="success">
      <el-step :title="$t('game.list.label_step_base')" icon="" />
      <el-step :title="$t('game.list.label_step_config')" />
    </el-steps>
    <div class="tips-wrap" v-if="active === STEPS_DICT.info">
      <gv-tips class="mb-16" :title="$t('game.list.tips_add_warn')" cache-key="game-list-add-tips" />
    </div>
    <info-popup v-if="active === STEPS_DICT.info" ref="infoPopup" @success="success" />
    <config-popup v-if="active === STEPS_DICT.config" ref="configPopup" @success="success" />
  </gv-popup>
</template>
<script setup>
import { computed, nextTick, ref, shallowRef } from 'vue';
import ConfigPopup from './config.vue';
import InfoPopup from './info.vue';
import GvPopup from '@/components/gv-popup/index.vue';
import { OPERATE_TYPE } from '@/values';
import GvTips from '@/components/gv-tips/index.vue';
import { $t } from '@/lang/i18n';

const STEPS_DICT = { info: 0, config: 1 };

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const configPopup = shallowRef();
const infoPopup = shallowRef();
const active = ref(STEPS_DICT.info);

const buttonNext = computed(() => (active.value === STEPS_DICT.info ? $t('common.step_next') : $t('common.complete_btn')));

// 打开基础信息
const openInfo = async () => {
  active.value = STEPS_DICT.info;
  await nextTick();
  await infoPopup.value?.init(OPERATE_TYPE.insert);
  popupRef.value?.open();
};

// 打开配置项编辑
const openConfig = async (row) => {
  active.value = STEPS_DICT.config;
  await nextTick();
  await configPopup.value?.init(row);
  popupRef.value?.open();
};

// 提交表单
const handleSubmit = () => {
  if (active.value === STEPS_DICT.config) {
    configPopup.value?.handleSubmit();
  } else if (active.value === STEPS_DICT.info) {
    infoPopup.value?.handleSubmit();
  }
};

const close = () => {
  popupRef.value?.close();
};

const success = (res) => {
  if (active.value === STEPS_DICT.info) {
    openConfig(res);
    emit('success');
  } else {
    close();
    emit('success');
  }
};

const handleClose = () => {
  if (active.value !== STEPS_DICT.info) emit('success');
  emit('close');
};

defineExpose({ openInfo });
</script>
<style lang="scss" scoped>
.step-wrap {
  margin-bottom: 30px;
}
.tips-wrap {
  max-width: 550px;
  margin: 0 auto;
}
</style>
