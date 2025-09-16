<template>
  <template v-for="(t1, x) in part.cols" :key="x">
    <template v-for="(t2, y) in part.rows" :key="getLevel2Key(x, y)">
      <div v-if="roadList[x] && roadList[x]?.[y]" class="col-box" :style="getPositionBySize(x, y, part.boxSize)">
        <!--      正常显示        -->
        <div class="road-item border" :style="{ borderColor: roadList[x][y].color, color: roadList[x][y].color }" />
      </div>
    </template>
  </template>
  <canvas id="part7-canvas" class="part-canvas" :width="part.width" :height="part.height" />
</template>
<script setup>
import { getLevel2Key } from '@/views/desk/road/baccarat/_tools/index.js';
import { useDrawGrid } from '@/views/desk/road/baccarat/_hooks/grid.js';
import { getPositionBySize } from '@/tools';
const { roadList, part } = defineProps({ roadList: Array, part: Object });

useDrawGrid('part7-canvas', () => part);
</script>
<style lang="scss" scoped>
@use '@/views/desk/road/baccarat/_styles/index.scss';
</style>
