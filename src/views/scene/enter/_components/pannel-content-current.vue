<template>
  <div class="pannel-content-current" :style="panelContentTopStyle">
    <!--    -->
    <div class="count-every">
      <div class="count-content w-full mb-12" v-for="(sat, index) in formatPlayerCount" :key="index">
        <div v-if="!!sat" class="flex-row align-center flex-nowrap">
          <template v-for="(item, _index) in sat" :key="getMultipleKey(index, _index)">
            <div class="bet-item flex-row align-center mr-16">
              <hexagon-icon class="hexagon-icon" :color="getKindColor(item.icon)" :size="32" />
              <div class="ml-8">
                <div class="fz-24 fw-bold scene-text-main-color">{{ item.amount ?? 0 }}</div>
                <div class="name flex-row align-center fz-18 pt-4 text-placeholder" v-if="item.kindName">
                  {{ $ti(item.kindName) }}-{{ $ti(item.currencyName) }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import HexagonIcon from '@/views/scene/enter/_components/_components/hexagon-icon.vue';
import { computed, inject } from 'vue';
import { getKindColor } from '@/views/scene/enter/_models/kind-color';
import { generateUUID, getMultipleKey } from '@/tools';
import { panelContentTopStyle } from '@/views/scene/enter/_models/enter-layout';
import { $ti } from '@/lang/input';

const gameKindFilter = inject('gameKindFilter');
const currencyConfig = inject('currencyConfig');
const currentPlayerCount = inject('currentPlayerCount');

const formatPlayerCount = computed(() => {
  const result = [];
  const kinds = gameKindFilter.value ?? [];
  const currency = currencyConfig.value ?? [];
  const playerCount = currentPlayerCount.value ?? {};
  kinds.forEach((kind) => {
    currency.forEach((curr, index) => {
      if (!!playerCount?.[kind.id]?.[curr.id]) {
        if (!result[index]) result[index] = [];
        result[index].push({
          key: getMultipleKey(kind.id, curr.id),
          amount: playerCount?.[kind.id]?.[curr.id],
          icon: kind.icon,
          kindName: kind.name,
          currencyName: curr.name
        });
      }
    });
  });
  if (!result.length) {
    const temp = [];
    Array.from({ length: 4 }).forEach(() => {
      temp.push({ key: generateUUID(), amount: 0 });
    });
    result[0] = [...temp];
  }
  return result;
});
</script>
<style lang="scss" scoped>
.pannel-content-current {
}
</style>
