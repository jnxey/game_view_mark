<template>
  <el-dropdown ref="dropdownRef" trigger="click" class="w-full" :popper-class="popperClass">
    <span class="link">{{ $t('components.gv_input_currency.btn_setting') }}</span>
    <template #dropdown>
      <el-scrollbar max-height="50vh">
        <el-dropdown-menu :style="{ width: getPX(width) }">
          <el-dropdown-item v-for="item in currency" :key="item.code" @click="setCurrency(item)">
            <div class="flex-row align-center">
              <img class="icon-country mr-12" :src="getCurrencyImage(item.image)" alt="" />
              {{ item.code }}-
              <span class="text-placeholder">{{ item.name }}</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-scrollbar>
    </template>
  </el-dropdown>
</template>
<script>
export default { name: 'gv-input-currency' };
</script>
<script setup>
import { computed, shallowRef } from 'vue';
import { getCurrencyImage, getPX } from '@/tools';
import { language } from '@/lang';
import { $t } from '@/lang/i18n';

const dropdownRef = shallowRef();

const emit = defineEmits(['selectCurrency']);

const currency = computed(() => {
  return language.currency.currencies;
});

const setCurrency = (item) => {
  emit('selectCurrency', item);
};
</script>
<style lang="scss" scoped>
.icon-country {
  width: 32px;
  height: 32px;
}
</style>
