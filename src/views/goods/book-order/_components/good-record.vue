<template>
  <div class="good-record text-main">
    <!--    -->
    <div class="car-item flex-row align-center p-16 mb-16" v-for="item in recordData" :key="item.id">
      <el-avatar shape="square" :size="40" fit="cover" :src="getAlbumDef(item?.stock_image)" />
      <div class="flex-1 flex-w0 ml-8">
        <div class="fz-16 mb-8 fw-bold flex-row align-center">
          <span class="mr-8">{{ item?.stock_name }}</span>
          <el-tag :type="statusMap[item.status]?.tag">{{ statusMap[item.status]?.name }}</el-tag>
        </div>
        <div class="fz-16">{{ item?.number }} * {{ item?.unit }}{{ item?.price }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject } from 'vue';
import { getAlbumDef, parseDict } from '@/tools';
import { STOCK_ORDER_STATUS_DICT } from '@/values';

const recordData = inject('recordData');

const statusMap = parseDict(STOCK_ORDER_STATUS_DICT);

console.log(statusMap);
</script>
<style scoped lang="scss">
.good-record {
  .car-item {
    border-bottom: 1px solid var(--el-border-color);
  }
}
</style>
