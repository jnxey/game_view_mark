<template>
  <div class="road-baccarat" v-if="!!openingInfo && !!tableInfo">
    <!--  header  -->
    <content-header :style="layout.header" />
    <!--  content  -->
    <div class="content-box">
      <!--   part1   -->
      <div id="part1-grid" class="grid-box grid-1" :style="layout.part1">
        <!--  完整路  -->
        <div class="content-wrap" :style="layout.part1_content">
          <div class="normal" :style="layout.part1_normal">
            <road-part1 :road-list="part1Road" :part="part1" />
          </div>
        </div>
      </div>
      <!--   part2   -->
      <div class="grid-box grid-2 none-border" :style="layout.part2">
        <content-count
          :ar-size="part1.boxSize"
          :count="roadCount"
          :part4preview="part4FormatPreview"
          :part5preview="part5FormatPreview"
          :part6preview="part6FormatPreview"
        />
      </div>
      <!--   part3   -->
      <div class="grid-box grid-3" :style="layout.part3">
        <div class="content-wrap" :style="layout.part3_content">
          <div class="normal" :style="layout.part3_normal">
            <road-part3 :road-list="part3Road" :part="part3" />
          </div>
        </div>
      </div>
      <!--   part4   -->
      <div class="grid-box grid-4 left-top" :style="layout.part4">
        <div class="content-wrap" :style="layout.part4_content">
          <div class="normal" :style="layout.part4_normal">
            <road-part4 :road-list="part4Road" :part="part4" />
          </div>
        </div>
      </div>
      <!--   part5   -->
      <div class="grid-box grid-5 right-top" :style="layout.part5">
        <div class="content-wrap" :style="layout.part5_content">
          <div class="normal" :style="layout.part5_normal">
            <road-part5 :road-list="part5Road" :part="part5" />
          </div>
        </div>
      </div>
      <!--   part6   -->
      <div class="grid-box grid-6 left-bottom" :style="layout.part6">
        <div class="content-wrap" :style="layout.part6_content">
          <div class="normal" :style="layout.part6_normal">
            <road-part6 :road-list="part6Road" :part="part6" />
          </div>
        </div>
      </div>
      <!--   part7   -->
      <div class="grid-box grid-7 right-bottom" :style="layout.part7">
        <div class="content-wrap" :style="layout.part7_content">
          <div class="normal" :style="layout.part7_normal">
            <road-part7 :road-list="part7Road" :part="part7" />
          </div>
        </div>
      </div>
    </div>
    <dialog-add ref="dialogAddRef" />
  </div>
</template>
<script setup>
import { computed, inject, nextTick, reactive, ref, watch } from 'vue';
import { chunkArray, delayExec, splitArrayByValue } from '@/tools/index.js';
import RoadPart1 from './_components/road-part1.vue';
import RoadPart3 from './_components/road-part3.vue';
import RoadPart4 from './_components/road-part4.vue';
import RoadPart5 from './_components/road-part5.vue';
import RoadPart6 from './_components/road-part6.vue';
import { useGridLayout } from './_hooks/layout.js';
import { useFilterList, useFormatList, usePreviewList } from './_hooks/index.js';
import DialogAdd from './_components/dialog-add.vue';
import RoadPart7 from './_components/road-part7.vue';
import { GAME_KIND_MARK } from '@/values';
import ContentHeader from './_components/content-header.vue';
import ContentCount from './_components/content-count.vue';

const tableInfo = inject('tableInfo');
const gameInfo = inject('gameInfo');
const gameKind = inject('gameKind');
const openingInfo = inject('openingInfo');

const dialogAddRef = ref(null);
const roadFullList = reactive([]); // 完整路列表
const roadList = reactive([]); // 路-列表-部分有合并
const cacheAddItem = []; // 缓存的路单项

// 路单统计
const roadCount = computed(() => {
  const count = {};
  roadFullList.forEach((item) => {
    item?.bet_result.forEach((kindId) => {
      if (!count[kindId]) count[kindId] = 0;
      count[kindId] = count[kindId] + 1;
    });
  });
  return count;
});

// 路单布局
const { layout, part1, part3, part4, part5, part6, part7, setPartCols } = useGridLayout();

// 显示的路的列表，切割类型的路
const roadSplit = computed(() => splitArrayByValue(roadList, 'value'));

// part1
// main路的列表
const part1Road = computed(() => {
  return chunkArray(roadFullList, part1.rows);
});

// part3
// 大路的列表
const part3Road = useFilterList(() => roadSplit.value, part3.rows);

// part4
// 格式化问路列表
const part4Format = useFormatList(() => roadSplit.value, 1);
// 问路预测
const part4FormatPreview = usePreviewList(() => roadList, 1);

// 过滤后的数据
const part4Road = useFilterList(() => part4Format.value, part4.rows);

// part5
// 格式化问路列表
const part5Format = useFormatList(() => roadSplit.value, 3);
// 问路预测
const part5FormatPreview = usePreviewList(() => roadList, 3);

// 过滤后的数据
const part5Road = useFilterList(() => part5Format.value, part5.rows);

// part6
// 格式化问路列表
const part6Format = useFormatList(() => roadSplit.value, 2);
// 问路预测
const part6FormatPreview = usePreviewList(() => roadList, 2);

// 过滤后的数据
const part6Road = useFilterList(() => part6Format.value, part6.rows);

// part7
// main小路的列表
const part7Road = computed(() => {
  return chunkArray(roadFullList, part7.rows);
});

// 获取下一个路单的位置，物理位置
const getNextPart1 = () => {
  const wrap = document.getElementById('part1-grid');
  if (!wrap) return;
  const rect = wrap.getBoundingClientRect();
  const len = roadFullList.length + 1;
  const x = Math.floor(len / part1.rows);
  if (!(len % part1.rows)) {
    const y = part1.rows - 1;
    return { rect: rect, x: x - 1, y: y, translate: part1.translate, boxSize: part1.boxSize };
  } else {
    const y = (len % part1.rows) - 1;
    return { rect: rect, x: x, y: y, translate: part1.translate, boxSize: part1.boxSize };
  }
};

// 获取大陆最后一个的位置π
const findLastItem = (road, lastIndex) => {
  if (!lastIndex) return 0;
  for (let i = road.length - 1; i >= 0; i--) {
    for (let j = 0; j < road[i].length; j++) {
      if (road[i][j]?.index === lastIndex) return i;
    }
  }
  return 0;
};

// 添加RoadList
const addRoadListValue = (item) => {
  if (item.value === GAME_KIND_MARK.draw) {
    const lastKey = roadList.length - 1;
    const lastItem = roadList[lastKey];
    if (!lastItem) return;
    lastItem.draws.push(item);
    roadList[lastKey] = { ...lastItem };
  } else {
    // 其他单需要保存和单
    roadList.push({ ...item, draws: [], index: roadList.length });
  }
};

// 重置路单数据
const resetRoadData = (list) => {
  roadFullList.splice(0);
  roadList.splice(0);
  roadFullList.push(...list);
  roadFullList.forEach((item) => {
    addRoadListValue(item);
  });
};

// 同步路单操作数据
const syncRoadData = async (item) => {
  const show = dialogAddRef.value?.getShow();
  const sync = dialogAddRef.value?.getSync();
  if (show && sync && !item.bet_result?.length) {
    dialogAddRef.value?.close();
  } else if (!show || sync) {
    dialogAddRef.value?.open(item, true);
  }
};

// 添加新的路单数据
const addRoadData = async (item) => {
  const show = dialogAddRef.value?.getShow();
  const sync = dialogAddRef.value?.getSync();
  if (show && !sync) return cacheAddItem.push(item);
  dialogAddRef.value?.open(item, false);
  await delayExec(1500);
  const next = getNextPart1();
  dialogAddRef.value?.move(next, () => {
    roadFullList.push({ ...item });
    // 问路，路单-和处理
    addRoadListValue(item);
    if (!!cacheAddItem.length) {
      addRoadData(cacheAddItem.shift());
    }
  });
};

watch(
  () => roadSplit.value,
  () => {
    nextTick(() => {
      // part1
      setPartCols(part1, part1Road.value.length + 1);

      // part3
      const roadListLastIndex = roadList[roadList.length - 1]?.index;
      const lastPart3Line = findLastItem(part3Road.value, roadListLastIndex) + 1;
      setPartCols(part3, lastPart3Line + 1);

      // part4
      const part4Last = part4Format.value[part4Format.value.length - 1] || [];
      const part4LastIndex = part4Last[part4Last.length - 1]?.index;
      const lastPart4Line = findLastItem(part4Road.value, part4LastIndex) + 1;
      setPartCols(part4, lastPart4Line + 1);

      // part5
      const part5Last = part5Format.value[part5Format.value.length - 1] || [];
      const part5LastIndex = part5Last[part5Last.length - 1]?.index;
      const lastPart5Line = findLastItem(part5Road.value, part5LastIndex) + 1;
      setPartCols(part5, lastPart5Line + 1);

      // part6
      const part6Last = part6Format.value[part6Format.value.length - 1] || [];
      const part6LastIndex = part6Last[part6Last.length - 1]?.index;
      const lastPart6Line = findLastItem(part6Road.value, part6LastIndex) + 1;
      setPartCols(part6, lastPart6Line + 1);

      // part7
      setPartCols(part7, part7Road.value.length + 1);
    });
  },
  {
    immediate: true
  }
);

defineExpose({ resetRoadData, addRoadData, syncRoadData });
</script>
<style lang="scss">
@use './_theme/index.scss';
</style>
<style lang="scss" scoped>
@use './_styles/index.scss';

.road-baccarat {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url('@/assets/images/scene/enter-bg.jpg');
  background-size: cover;

  .content-box {
    position: relative;
    width: 100vw;
    height: calc(100vh - 60px);

    .grid-box {
      position: absolute;
      box-sizing: border-box;
      border-radius: var(--gv-border-radius-mid);
      box-shadow: 0 0 0 5px var(--desk-baccarat-layout-border-color);

      &.none-border {
        box-shadow: none;
      }

      &.left-top {
        border-radius: var(--gv-border-radius-mid) var(--gv-border-radius-mid) 0 var(--gv-border-radius-mid);
        box-shadow: -3px -3px 0 2px var(--desk-baccarat-layout-border-color);
      }

      &.left-bottom {
        border-radius: var(--gv-border-radius-mid) 0 var(--gv-border-radius-mid) var(--gv-border-radius-mid);
        box-shadow: -3px 3px 0 2px var(--desk-baccarat-layout-border-color);
      }

      &.right-top {
        border-radius: var(--gv-border-radius-mid) var(--gv-border-radius-mid) var(--gv-border-radius-mid) 0;
        box-shadow: 3px -3px 0 2px var(--desk-baccarat-layout-border-color);
      }

      &.right-bottom {
        border-radius: 0 var(--gv-border-radius-mid) var(--gv-border-radius-mid) var(--gv-border-radius-mid);
        box-shadow: 3px 3px 0 2px var(--desk-baccarat-layout-border-color);
      }
    }
  }
}
</style>
