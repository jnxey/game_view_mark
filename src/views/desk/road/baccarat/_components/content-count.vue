<template>
  <div class="content-count flex-row align-top">
    <!--    -->
    <div class="ask-road flex-row align-top pl-8 pr-8" :style="cWrapHeight">
      <div class="flex-1">
        <!--   title   -->
        <div class="ar-item banker fz-20 fw-bold" :style="{ ...arItemStyle, backgroundColor: bankerInfo.color }">
          {{ $ti(gameKindMain[GAME_KIND_MARK.master]?.name) ?? 'B' }}
        </div>
        <div class="ar-item part4" v-if="part4preview.master" :style="{ ...arItemStyle, borderColor: part4preview.master?.color }" />
        <div class="ar-item part6" v-if="part6preview.master" :style="{ ...arItemStyle, backgroundColor: part6preview.master?.color }" />
        <div class="ar-item part5" v-if="part5preview.master" :style="{ ...arItemStyle, color: part5preview.master?.color }">
          <gv-icon name="local-icon-road-line" class="line-icon" :size="arSize * 0.8" />
        </div>
      </div>
      <div class="flex-1 ml-8">
        <!--   title   -->
        <div class="ar-item player fz-20 fw-bold" :style="{ ...arItemStyle, backgroundColor: playerInfo.color }">
          {{ $ti(gameKindMain[GAME_KIND_MARK.player]?.name) ?? 'P' }}
        </div>
        <div class="ar-item part4" v-if="part4preview.player" :style="{ ...arItemStyle, borderColor: part4preview.player?.color }" />
        <div class="ar-item part6" v-if="part6preview.player" :style="{ ...arItemStyle, backgroundColor: part6preview.player?.color }" />
        <div class="ar-item part5" v-if="part5preview.player" :style="{ ...arItemStyle, color: part5preview.player?.color }">
          <gv-icon name="local-icon-road-line" class="line-icon" :size="arSize * 0.8" />
        </div>
      </div>
    </div>
    <!--    -->
    <el-scrollbar class="count-road flex-1 ml-16" :style="cWrapHeight">
      <div class="title pt-16 pb-16 fz-24 fw-bold">{{ $t('desk.road.title_count') }}</div>
      <div class="flex-row align-top flex-wrap">
        <template v-for="kind in gameKind">
          <template v-if="gameKindSelect[kind.id] && kind.sub_calc !== GAME_KIND_CALC.sub">
            <div class="p-8 flex-row align-center mr-16">
              <gv-game-kind-single-icon class="kind-item" :kind="kind" :size="40" />
              <span class="ml-8 fz-24 count-number">{{ count[kind.id] ?? 0 }}</span>
            </div>
          </template>
        </template>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { computed, inject, unref } from 'vue';
import { getPX, parseDict } from '@/tools';
import { GAME_KIND_CALC, GAME_KIND_MARK, GAME_KIND_MARK_DICT } from '@/values';
import GvIcon from '@/components/gv-icon/index.vue';
import GvGameKindSingleIcon from '@/components/gv-game-kind-icon/single.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const gameKind = inject('gameKind');
const gameKindMap = inject('gameKindMap');
const gameKindSelect = inject('gameKindSelect');

const markMap = parseDict(GAME_KIND_MARK_DICT);
const bankerInfo = markMap[GAME_KIND_MARK.master];
const playerInfo = markMap[GAME_KIND_MARK.player];

const props = defineProps({ arSize: Number, count: Object, part4preview: Object, part5preview: Object, part6preview: Object });

const arItemStyle = computed(() => ({ width: getPX(props.arSize * 1.4), height: getPX(props.arSize * 1.4) }));

const cWrapHeight = computed(() => ({ height: getPX(props.arSize * 6) }));

const gameKindMain = computed(() => {
  const result = {};
  unref(gameKind)?.forEach((kind) => {
    if (!unref(gameKindSelect)[kind.id]) return;
    if (kind.card_pattern === GAME_KIND_MARK.master) result[GAME_KIND_MARK.master] = kind;
    if (kind.card_pattern === GAME_KIND_MARK.player) result[GAME_KIND_MARK.player] = kind;
  });
  return result;
});
</script>

<style scoped lang="scss">
.content-count {
  padding-left: 20px;
  .ask-road {
    border-radius: var(--gv-border-radius-mid);
    background-color: var(--desk-baccarat-layout-border-bg);
    box-shadow: 0 0 0 5px var(--desk-baccarat-layout-border-color);

    .ar-item {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transform: scale(0.8);

      &.banker,
      &.player {
        color: var(--desk-baccarat-bg-text-color);
      }

      &.part4 {
        transform: scale(0.6);
        border: 5px solid transparent;
      }

      &.part6 {
        transform: scale(0.6);
      }
    }
  }

  .count-road {
    padding: 5px 15px;
    border-radius: var(--gv-border-radius-big);
    background-color: var(--desk-baccarat-table-info-bg-color-2);
    backdrop-filter: blur(5px);

    .title {
      color: var(--desk-baccarat-bg-text-color);
    }

    .count-number {
      color: var(--desk-baccarat-table-info-text-color);
    }
  }
}
</style>
