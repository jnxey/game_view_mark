<template>
  <div class="recorders">
    <el-scrollbar>
      <div class="flex-row align-top flex-wrap">
        <template v-for="item in optionsData.recorders" :key="item.id">
          <div class="recorder-box cursor-pointer" @click="setCurrentRecorders(item)">
            <div class="mb-4">
              <span class="fz-16 fw-bold">{{ item.model_number }}</span>
              <span class="fz-14 ml-4">({{ item.brand }})</span>
            </div>
            <div class="fz-14">IP: {{ item.ip }}_{{ item.port }}</div>
          </div>
        </template>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { useDictOptions } from '@/hooks/dict';
import { financeCameraLists } from '@/api/finance/video-recorder';

const emits = defineEmits(['setCurrent']);

const { optionsData } = useDictOptions({ recorders: { api: financeCameraLists } });

// 选择当前的录像机
const setCurrentRecorders = (info) => {
  emits('setCurrent', info);
};
</script>
<style scoped lang="scss">
.recorders {
  width: 1000px;
  height: 560px;
  padding: 10px;

  .recorder-box {
    min-width: 180px;
    padding: 15px;
    margin-right: 20px;
    margin-bottom: 20px;
    color: var(--el-primary-text-color);
    border-radius: var(--gv-border-radius-big);
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-color-primary);

    &:hover {
      background-color: var(--el-color-primary-dark-2);
    }
  }
}
</style>
