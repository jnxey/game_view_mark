<template>
  <div class="road-niuniu" v-if="!!openingInfo && !!tableInfo">
    <!--  header  -->
    <content-header class="mb-16" />
    <content-road class="mb-16" :road-list="roadList" />
    <content-count class="mb-16" :road-list="roadList" />
  </div>
</template>
<script setup>
import { inject, reactive } from 'vue';
import ContentHeader from './_components/content-header.vue';
import ContentRoad from './_components/content-road.vue';
import ContentCount from '@/views/desk/road/niuniu/_components/content-count.vue';

const tableInfo = inject('tableInfo');
const gameInfo = inject('gameInfo');
const gameKind = inject('gameKind');
const openingInfo = inject('openingInfo');

const roadList = reactive([]);

// 重置路单数据
const resetRoadData = (list) => {
  roadList.splice(0);
  roadList.push(...list);
};

// 添加新的路单数据
const addRoadData = async (item) => {
  roadList.push(item);
};

defineExpose({ resetRoadData, addRoadData });
</script>
<style lang="scss">
@use './_theme/index.scss';
</style>
<style scoped lang="scss">
.road-niuniu {
  min-width: 100vw;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--desk-niuniu-layout-border-bg);

  .road-content {
    position: relative;
    padding: 20px;
    border-radius: var(--gv-border-radius-big);
    background-image: var(--desk-niuniu-content-bg);

    .master-bg {
      position: absolute;
      top: 16px;
      left: 10px;
      right: 10px;
      border-radius: var(--gv-border-radius-mid);
      background-color: var(--desk-niuniu-master-bg);
    }

    .road-wrap {
      position: relative;
      .road-col {
        &.first {
          position: sticky;
          left: 0;
        }
      }

      .road-item {
        .road-icon {
          width: 90%;
          height: 90%;
        }

        .name {
          width: 90%;
          height: 90%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          color: var(--el-primary-text-color);
          box-sizing: var(--el-box-shadow-light);
          background-color: var(--desk-niuniu-title-bg);
        }
      }
    }
  }
}
</style>
