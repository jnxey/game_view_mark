<template>
  <gv-popup
    ref="popupRef"
    :title="$t('components.gv_select_currency.title_config')"
    width="360px"
    :confirm-button-text="null"
    :cancel-button-text="null"
    @close="cacheCallback = null"
    click-modal-close
  >
    <div class="currency-base-button flex-row flex-wrap align-center justify-around">
      <div
        class="currency-item flex-col align-center cursor-pointer mb-8"
        v-for="(item, index) in currency"
        :key="index"
        :class="{ disabled: !!currentDisabled[item.id] }"
        @click="selectItem(item)"
      >
        <el-avatar :size="40" :src="getBaseImagUrl(item.image)" />
        <div class="text-center pt-8">
          <span class="ml-4">{{ item.abbreviation }}-</span>
          <span class="text-placeholder">{{ $ti(item.name) }}</span>
        </div>
      </div>
    </div>
  </gv-popup>
</template>
<script>
export default { name: 'gv-select-currency-base-popup' };
</script>
<script setup>
import { computed, shallowRef } from 'vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyBaseLists } from '@/api/currency/base';
import GvPopup from '@/components/gv-popup/index.vue';
import { getBaseImagUrl } from '@/tools';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';
import { YES_NO_VALUE } from '@/values';

const props = defineProps({ options: Array, virtual: { type: Boolean, default: false } });
const popupRef = shallowRef();
const currentDisabled = shallowRef({});
const emit = defineEmits(['select']);

let cacheCallback = null;

const { optionsData, refresh } = useDictOptions(
  { base: { api: currencyBaseLists, params: { virtual_status: props.virtual ? null : YES_NO_VALUE.no } } },
  !!props.options
);

const currency = computed(() => {
  if (!!props.options) return props.options;
  return optionsData.base;
});

const open = (callback, disabled) => {
  popupRef.value?.open();
  cacheCallback = callback;
  currentDisabled.value = disabled ?? {};
};

const selectItem = async (item) => {
  if (!!currentDisabled.value[item.id]) return;
  emit('select', item.id);
  if (cacheCallback) cacheCallback(item.id);
  popupRef.value?.close();
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.currency-base-button {
  .currency-item {
    width: 150px;
    padding: 10px;
    border-radius: var(--gv-border-radius-mid);
    background-color: var(--el-fill-color);

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:hover {
      background-color: var(--el-fill-color-dark);
    }
  }
}
</style>
