<template>
  <div class="gv-game-kind-icon" :style="wrapStyle">
    <img class="main-icon" :src="getAlbumDef(mainIcon)" :style="wrapStyle" alt="" />
    <template v-for="item in subIcons">
      <img class="sub-icon" :class="item.position" :src="getAlbumDef(item.icon)" :style="subStyle" alt="" />
    </template>
  </div>
</template>
<script>
export default { name: 'gv-game-kind-icon' };
</script>
<script setup>
import { computed } from 'vue';
import { getAlbumDef, getPX, parseDict } from '@/tools';
import { GAME_KIND_POSITION, GAME_KIND_POSITION_DICT } from '@/values';
import { isTop } from '@/views/game/_models';

const props = defineProps({ kinds: Object, compose: Array, size: { type: Number, default: 40 }, percent: { type: Boolean, default: false } });

const getSize = (size) => (props.percent ? size + '%' : getPX(size));

const wrapStyle = computed(() => ({ width: getSize(props.size), height: getSize(props.size) }));

const subStyle = computed(() => ({ height: getSize(props.size * 0.25) }));

// 组合信息列表
const composeList = computed(() => {
  const result = [];
  props.compose.forEach((id) => {
    const kind = props.kinds?.[id];
    if (!!kind) result.push({ ...kind });
  });
  return result;
});

// 主图
const mainIcon = computed(() => {
  let result = null;
  composeList.value.forEach((item) => {
    if (!result && isTop(item.is_top)) {
      result = item.icon;
    }
    if (!isTop(item.is_top) && item.sub_position === GAME_KIND_POSITION.main) {
      result = item.icon;
    }
  });
  return result;
});

// 子图
const subIcons = computed(() => {
  const result = [];
  const positionMap = parseDict(GAME_KIND_POSITION_DICT);
  composeList.value.forEach((item) => {
    if (!isTop(item.is_top) && item.sub_position !== GAME_KIND_POSITION.main) {
      result.push({ icon: item.icon, position: positionMap[item.sub_position]?.class });
    }
  });
  return result;
});
</script>
<style lang="scss" scoped>
.gv-game-kind-icon {
  position: relative;
  .main-icon {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
  }
  .sub-icon {
    position: absolute;

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
