<template>
  <template v-if="!isFold">
    <slot />
  </template>
  <el-button plain @click="toggle" :class="`${foldClass} ${firstItem && isFold ? 'no-mg' : ''}`">
    <span v-if="!!foldText" class="mr-4">{{ foldText }}</span>
    <gv-icon class="fold-icon" :class="{ open: !isFold }" name="local-icon-fold-open" />
  </el-button>
</template>
<script>
export default { name: 'gv-buttons-fold' };
</script>
<script setup>
import { onBeforeMount, ref, defineProps } from 'vue';
import { storage } from '@/tools/storage';
import GvIcon from '@/components/gv-icon/index.vue';

const CACHE_GV_BUTTONS_FOLD_KEY = 'CACHE_GV_BUTTONS_FOLD_KEY';

const emits = defineEmits(['statusChange']);
const props = defineProps({ uniKey: String, foldText: String, foldClass: String, firstItem: Boolean });
const isFold = ref();

const getCacheValue = () => {
  const cache = storage.get(CACHE_GV_BUTTONS_FOLD_KEY) ?? {};
  return cache[props.uniKey];
};

const toggle = () => {
  isFold.value = !isFold.value;
  const cache = storage.get(CACHE_GV_BUTTONS_FOLD_KEY) ?? {};
  cache[props.uniKey] = isFold.value;
  storage.set(CACHE_GV_BUTTONS_FOLD_KEY, cache);
  emits('statusChange');
};

onBeforeMount(() => {
  isFold.value = getCacheValue() ?? true;
});
</script>
<style scoped lang="scss">
.no-mg {
  margin-left: 0;
}

.fold-icon {
  transform: rotate(-90deg);

  &.open {
    transform: rotate(90deg);
  }
}
</style>
