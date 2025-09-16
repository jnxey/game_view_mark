<template>
  <template v-for="(t1, x) in part.cols" :key="x">
    <template v-for="(t2, y) in part.rows" :key="getLevel2Key(x, y)">
      <div v-if="roadList[x] && roadList[x]?.[y]" class="col-box" :style="getPositionBySize(x, y, part.boxSize)">
        <div class="road-item">
          <gv-game-kind-icon :kinds="gameKindMap" :compose="roadList[x][y].bet_result" :size="100" percent />
        </div>
      </div>
    </template>
  </template>
  <canvas id="part1-canvas" class="part-canvas" :width="part.width" :height="part.height" />
</template>
<script setup>
import { getLevel2Key } from '@/views/desk/road/baccarat/_tools/index.js';
import { useDrawGrid } from '@/views/desk/road/baccarat/_hooks/grid.js';
import { getPositionBySize } from '@/tools';
import { inject } from 'vue';
import GvGameKindIcon from '@/components/gv-game-kind-icon/index.vue';

const gameKindMap = inject('gameKindMap');

const { roadList, part } = defineProps({ roadList: Array, part: Object });

useDrawGrid('part1-canvas', () => part);
</script>
<style lang="scss" scoped>
@use '@/views/desk/road/baccarat/_styles/index.scss';
</style>
