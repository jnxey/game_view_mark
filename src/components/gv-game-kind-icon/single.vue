<template>
  <div class="gv-game-kind-icon" :style="wrapStyle">
    <img v-if="isMain" class="main-icon" :src="getAlbumDef(kind.icon)" alt="" />
    <img v-if="!isMain" class="sub-icon" :class="positionMap[kind.sub_position]?.class" :src="getAlbumDef(kind.icon)" alt="" />
    <div v-if="!isMain" class="sub-icon-bg" />
  </div>
</template>
<script>
export default { name: 'gv-game-kind-single-icon' };
</script>
<script setup>
import { computed } from 'vue';
import { getAlbumDef, getPX, parseDict } from '@/tools';
import { GAME_KIND_POSITION, GAME_KIND_POSITION_DICT } from '@/values';
import { isTop } from '@/views/game/_models';

const positionMap = parseDict(GAME_KIND_POSITION_DICT);

const props = defineProps({ kind: Object, size: { type: Number, default: 40 } });

const wrapStyle = computed(() => ({ width: getPX(props.size), height: getPX(props.size) }));

// 主图
const isMain = computed(() => isTop(props.kind.is_top) || props.kind.sub_position === GAME_KIND_POSITION.main);
</script>
<style lang="scss" scoped>
.gv-game-kind-icon {
  position: relative;

  .main-icon {
    width: 100%;
    height: 100%;
  }

  .sub-icon-bg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid var(--el-border-color);
  }

  .sub-icon {
    position: absolute;
    width: 30%;
    height: 30%;
    z-index: 10;

    &.left-top {
      left: 0;
      top: 0;
    }

    &.left-bottom {
      left: 0;
      bottom: 0;
    }

    &.right-top {
      right: 0;
      top: 0;
    }

    &.right-bottom {
      right: 0;
      bottom: 0;
    }
  }
}
</style>
