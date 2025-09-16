<template>
  <div class="good-list flex-row align-top flex-wrap text-main">
    <div class="good-item cursor-pointer mb-16" v-for="item in stockData" :key="item.id">
      <div class="good-img">
        <img :src="getAlbumDef(item.image)" alt="" />
      </div>
      <div class="good-number flex-row align-center">
        <span class="fz-10 text-regular">{{ item.number }}</span>
      </div>
      <div class="good-title pt-8 pl-8 pr-8">
        <span class="fz-16">{{ item.name }}</span>
      </div>
      <div class="good-amount pt-8 pl-8">
        <span class="fz-20 fw-bold text-warning">{{ item.unit }}{{ item.price }}</span>
      </div>
      <div class="plus-btn">
        <el-button type="primary" plain circle icon="Plus" :disabled="checkDisabled(item)" @click="addGood(item)" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { getAlbumDef } from '@/tools';
import { inject } from 'vue';

const stockData = inject('stockData');
const selectedMap = inject('selectedMap');
const addGood = inject('addGood');

const checkDisabled = (good) => {
  const number = selectedMap[good.id]?.number ?? 0;
  return number >= good.number;
};
</script>
<style lang="scss" scoped>
.good-list {
  border-right: 1px solid var(--el-border-color);

  .good-item {
    position: relative;
    width: 160px;
    height: 230px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: var(--gv-border-radius-big);
    border: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
    transition: transform 0.3s linear;
    overflow: hidden;

    .good-title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .good-img {
      width: 160px;
      height: 160px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .good-number {
      position: absolute;
      top: 140px;
      right: 0;
      height: 20px;
      padding: 0 5px;
      border-radius: 5px 0 0 0;
      background-color: var(--el-fill-color);
    }

    .plus-btn {
      position: absolute;
      bottom: 12px;
      right: 5px;
    }

    &:hover {
      box-shadow: var(--el-box-shadow-light);
    }
  }
}
</style>
