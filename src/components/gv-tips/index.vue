<template>
  <div class="gv-tips text-right">
    <el-alert v-if="!hideAlert" :title="title" :description="description" :type="type" show-icon :effect="effect" @close="handleClose" />
    <gv-icon v-else name="el-icon-question-filled" class="fz-16 cursor-pointer text-placeholder" @click="handleOpen" />
  </div>
</template>
<script>
export default { name: 'gv-tips' };
</script>
<script setup>
import { onBeforeMount, ref } from 'vue';
import { storage } from '@/tools/storage';
import { CACHE_KEY_TIPS } from '@/values/cache';
import GvIcon from '@/components/gv-icon/index.vue';
const props = defineProps({
  title: String,
  description: String,
  type: { type: String, default: 'warning' },
  effect: { type: String, default: 'dark' },
  cacheKey: String
});

const hideAlert = ref(true);

onBeforeMount(() => {
  const cacheValue = storage.get(CACHE_KEY_TIPS) ?? {};
  hideAlert.value = !!cacheValue[props.cacheKey];
});

const handleOpen = () => {
  const cacheValue = storage.get(CACHE_KEY_TIPS) ?? {};
  hideAlert.value = false;
  cacheValue[props.cacheKey] = false;
  storage.set(CACHE_KEY_TIPS, cacheValue);
};

const handleClose = () => {
  const cacheValue = storage.get(CACHE_KEY_TIPS) ?? {};
  hideAlert.value = true;
  cacheValue[props.cacheKey] = true;
  storage.set(CACHE_KEY_TIPS, cacheValue);
};
</script>
<style scoped lang="scss">
.gv-tips {
  ::v-deep(.el-alert) {
    .el-alert__title {
      text-align: left;
    }
  }
}
</style>
