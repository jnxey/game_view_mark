<template>
  <gv-scene-card class="pannel-content-opeate" :class="{ baccarat: isBaccarat, general: !isBaccarat, scan: isScanCard }">
    <!--   百家乐类   -->
    <div class="kind-button-wrap" v-if="isBaccarat">
      <div class="flex-row flex-wrap">
        <template v-for="item in gameKindTop" :key="item.id">
          <gv-scene-button-simple
            class="mr-8 mb-8"
            :color="getKindColor(item.icon)"
            type="simple"
            :active="currentKindTop === item.id"
            @click="setCurrentKindTop(item)"
          >
            {{ $ti(item.name) }}
          </gv-scene-button-simple>
        </template>
      </div>
      <div class="flex-row flex-wrap">
        <template v-if="!!gameKindTopSub.length">
          <template v-for="kid in gameKindTopSub" :Key="kid">
            <gv-scene-button-simple
              class="mr-8 mb-8"
              type="primary"
              v-if="gameKindMap[kid]"
              :color="getKindColor(gameKindMap[kid].icon)"
              :active="currentKindSubMap[kid]"
              @click="setCurrentKindSub(kid)"
            >
              {{ $ti(gameKindMap[kid].name) }}
            </gv-scene-button-simple>
          </template>
        </template>
      </div>
      <div class="enter-button-wrap">
        <gv-scene-button v-if="isScanCard" class="enter-button half mb-8" type="light" @click="scanCard">
          {{ $t('scene.enter.operate_scan') }}
        </gv-scene-button>
        <gv-scene-button class="enter-button" :class="{ half: isScanCard }" type="light" @click="openSet">
          {{ $t('scene.enter.operate_bet') }}
        </gv-scene-button>
      </div>
    </div>
    <!--   通用类,niu niu等   -->
    <template v-else>
      <div class="enter-button-wrap">
        <gv-scene-button v-if="isScanCard" class="enter-button half mb-8" type="light" @click="scanCard">
          {{ $t('scene.enter.operate_scan') }}
        </gv-scene-button>
        <gv-scene-button class="enter-button" :class="{ half: isScanCard }" type="light" @click="openSet">
          {{ $t('scene.enter.operate_bet') }}
        </gv-scene-button>
      </div>
    </template>
  </gv-scene-card>
</template>
<script setup>
import GvSceneCard from '@/views/scene/enter/_components/gv-scene-card/index.vue';
import GvSceneButton from '@/views/scene/enter/_components/gv-scene-button/index.vue';
import GvSceneButtonSimple from '@/views/scene/enter/_components/gv-scene-button/simple.vue';
import { computed, inject, onBeforeUnmount, onMounted } from 'vue';
import { getKindColor } from '@/views/scene/enter/_models/kind-color';
import { checkIndexArray, deepClone, findAllChildren, mappingArrayToObject } from '@/tools';
import { useBetKindFilter } from '@/views/scene/enter/_models/bet-filter';
import { EVENTS_SCENE_AI_SCAN_SET, EVENTS_SCENE_OPENING_SET } from '@/values/events';
import eventManager from '@/tools/event-manager';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';
import { GAME_KIND_CALC, GAME_KIND_LEVEL, GAME_MODEL, GAME_MODEL_TYPE_BACCARAT, LOSS_WIN_VALUE, SCENE_SEATS } from '@/values';

const gameInfo = inject('gameInfo');
const gameKindFilter = inject('gameKindFilter');
const gameKindMap = inject('gameKindMap');
const filterCompose = inject('filterCompose');
const currentKindTop = inject('currentKindTop');
const updateCurrentKindTop = inject('updateCurrentKindTop');
const currentKindSub = inject('currentKindSub');
const updateCurrentKindSub = inject('updateCurrentKindSub');
const openSet = inject('openSet');
const isBaccarat = inject('isBaccarat');
const isScanCard = inject('isScanCard');
const openScanCard = inject('openScanCard');

// 获取顶级选项，子集选项
const { gameKindTop, gameKindTopSub } = useBetKindFilter(
  () => gameKindFilter.value,
  () => filterCompose.value,
  () => currentKindTop.value,
  () => currentKindSub.value
);

// 选中子集的map
const currentKindSubMap = computed(() => mappingArrayToObject(currentKindSub.value, null));

// 设置顶级配置项选中
const setCurrentKindTop = (item) => {
  updateCurrentKindTop(currentKindTop.value === item.id ? null : item.id);
  updateCurrentKindSub([]); // 清空子集选项
};

// 选中子集
const setCurrentKindSub = (kid) => {
  const subs = deepClone(currentKindSub.value ?? []);
  const composeList = filterCompose.value[currentKindTop.value]?.composeList ?? [];
  const opposeList = filterCompose.value[currentKindTop.value]?.opposeList;
  const key = subs.findIndex((val) => val === kid);
  const exclude = [];
  // 移除此项及其子项
  const eChildren = (value) => {
    const k = subs.indexOf(value);
    if (checkIndexArray(k)) {
      subs.splice(k, 1);
      const allKid = findAllChildren(composeList, value);
      allKid.forEach(({ id }) => {
        const k = subs.indexOf(id);
        if (checkIndexArray(k)) subs.splice(k, 1);
      });
    }
  };
  if (checkIndexArray(key)) {
    eChildren(kid);
  } else {
    subs.push(kid);
    // 移除排斥的项
    opposeList.forEach((oppose) => {
      const k = oppose.indexOf(kid);
      if (checkIndexArray(k)) exclude.push(...oppose.filter((val) => val !== kid));
    });
    exclude.forEach((id) => eChildren(id));
  }
  updateCurrentKindSub(subs);
};

// AI识牌选中
const aiScanSet = (hits) => {
  if (GAME_MODEL_TYPE_BACCARAT.includes(gameInfo.value?.game_model)) {
    if (!hits.length) return;
    // 百家乐
    const map = gameKindMap.value;
    const subs = [];
    let top = null;
    hits.forEach((item) => {
      if (map[item.id]?.is_top === GAME_KIND_LEVEL.top) top = item.id;
      else subs.push(item.id);
    });
    // 补充计算类型为子项的ID
    const suffix = [];
    const composeList = filterCompose.value[top]?.composeList ?? [];
    const composeMap = mappingArrayToObject(composeList);
    subs.forEach((id) => {
      const pid = composeMap[id]?.pid;
      if (map[pid] && map[pid]?.sub_calc === GAME_KIND_CALC.sub) suffix.push(pid);
    });
    subs.push(...suffix);
    // 设置值
    updateCurrentKindTop(top);
    updateCurrentKindSub(subs);
  }
};

// 扫牌
const scanCard = () => {
  openScanCard();
};

// 清空选中项
const clearCurrent = () => {
  updateCurrentKindTop(null);
  updateCurrentKindSub([]);
};

onMounted(() => {
  // 监听录入操作
  eventManager.on(EVENTS_SCENE_OPENING_SET, clearCurrent);
  eventManager.on(EVENTS_SCENE_AI_SCAN_SET, aiScanSet);
});

onBeforeUnmount(() => {
  eventManager.off(EVENTS_SCENE_OPENING_SET, clearCurrent);
  eventManager.off(EVENTS_SCENE_AI_SCAN_SET, aiScanSet);
});
</script>
<style lang="scss" scoped>
.pannel-content-opeate {
  position: relative;
  width: 100%;

  &.general {
    min-height: 90px;

    &.scan {
      min-height: 120px;
    }

    .kind-button-wrap {
      padding-right: 160px;
    }

    .enter-button-wrap {
      position: absolute;
      right: 15px;
      top: 15px;
    }

    .enter-button.gv-scene-button {
      width: 150px;
      height: 60px;

      ::v-deep(.text) {
        height: 60px;
        font-size: 28px;
      }

      &.half {
        height: 40px;
        font-size: 22px;

        ::v-deep(.text) {
          height: 40px;
          font-size: 22px;
        }
      }
    }
  }

  &.baccarat {
    min-height: 140px;

    .kind-button-wrap {
      padding-right: 160px;
    }

    .enter-button-wrap {
      position: absolute;
      right: 15px;
      top: 15px;
    }

    .enter-button.gv-scene-button {
      width: 150px;
      height: 110px;

      ::v-deep(.text) {
        height: 110px;
        font-size: 28px;
      }

      &.half {
        height: 50px;
        font-size: 22px;

        ::v-deep(.text) {
          height: 50px;
          font-size: 22px;
        }
      }
    }
  }
}
</style>
