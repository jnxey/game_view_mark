<template>
  <template v-for="(t1, x) in part.cols" :key="x">
    <template v-for="(t2, y) in part.rows" :key="getLevel2Key(x, y)">
      <!--      正常显示        -->
      <div v-if="roadList[x] && roadList[x]?.[y]" class="col-box" :style="getPositionBySize(x, y, part.boxSize)">
        <div class="road-item border" :style="{ borderColor: roadList[x][y].color }">
          <gv-icon
            v-if="!!roadList[x][y].draws.length"
            name="local-icon-road-line"
            class="draw-item-line"
            :style="{ color: markDraw.color }"
            :size="part.boxSize * 0.6"
          />
          <!--          <div v-if="roadList[x][y].draws.length" class="draw-item">-->
          <!--            {{ roadList[x][y].draws.length }}-->
          <!--          </div>-->
        </div>
      </div>
    </template>
  </template>
  <canvas id="part3-canvas" class="part-canvas" :width="part.width" :height="part.height" />
</template>
<script setup>
import { getLevel2Key } from '@/views/desk/road/baccarat/_tools/index.js';
import { useDrawGrid } from '@/views/desk/road/baccarat/_hooks/grid.js';
import { getPositionBySize, parseDict } from '@/tools';
import GvIcon from '@/components/gv-icon/index.vue';
import { GAME_KIND_MARK, GAME_KIND_MARK_DICT } from '@/values';

const { roadList, part } = defineProps({ roadList: Array, part: Object });

const markMap = parseDict(GAME_KIND_MARK_DICT);
const markDraw = markMap[GAME_KIND_MARK.draw];

useDrawGrid('part3-canvas', () => part);
</script>
<style lang="scss" scoped>
@use '@/views/desk/road/baccarat/_styles/index.scss';
</style>
