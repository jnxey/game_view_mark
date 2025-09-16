<template>
  <gv-popup ref="popupRef" :title="popupTitle" :width="popupWidth" @confirm="handleSubmit" @close="handleClose">
    <config-popup v-show="editType === EDIT_TYPE_DICT.config" ref="configPopup" @success="success" />
    <info-popup v-show="editType === EDIT_TYPE_DICT.info" ref="infoPopup" @success="success" />
  </gv-popup>
</template>
<script setup>
import { computed, nextTick, ref, shallowRef } from 'vue';
import ConfigPopup from './config.vue';
import InfoPopup from './info.vue';
import GvPopup from '@/components/gv-popup/index.vue';
import { OPERATE_TYPE } from '@/values';
import { $t } from '@/lang/i18n';

const EDIT_TYPE_DICT = { config: 'config', info: 'info' };

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const configPopup = shallowRef();
const infoPopup = shallowRef();
const editType = ref(EDIT_TYPE_DICT.info);

const popupTitle = computed(() => (editType.value === EDIT_TYPE_DICT.info ? $t('game.list.title_edit') : $t('game.list.title_config')));

const popupWidth = computed(() => (editType.value === EDIT_TYPE_DICT.config ? '820px' : '550px'));

// 打开基础信息编辑
const openInfo = async (row) => {
  editType.value = EDIT_TYPE_DICT.info;
  popupRef.value?.open();
  await nextTick();
  await infoPopup.value?.init(OPERATE_TYPE.update, row);
};

// 打开配置项编辑
const openConfig = async (row) => {
  editType.value = EDIT_TYPE_DICT.config;
  if (configPopup.value?.init) {
    await configPopup.value?.init(row);
    popupRef.value?.open();
  } else {
    popupRef.value?.open();
    await nextTick();
    await configPopup.value?.init(row);
  }
};

// 提交表单
const handleSubmit = () => {
  if (editType.value === EDIT_TYPE_DICT.config) {
    configPopup.value?.handleSubmit();
  } else {
    infoPopup.value?.handleSubmit();
  }
};

const close = () => {
  popupRef.value?.close();
};

const success = () => {
  close();
  emit('success');
};

const handleClose = () => {
  emit('close');
};

defineExpose({ openInfo, openConfig });
</script>
