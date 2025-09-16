<template>
  <glc-hit-box class="widgets-text" :style="[wrapStyle, otherStyle]" :uid="uid" resize v-if="!!currentBonus">
    <template v-if="config.onlyTitle">
      {{ $ti(currentBonus.name) }}
    </template>
    <template v-else>{{ bonusSymbol }}{{ Math.floor(Number(currentBonus.prize_pool)) }}</template>
  </glc-hit-box>
</template>
<script>
export default { name: 'glc-widget-bonus' };
</script>
<script setup>
import { computed, inject, unref } from 'vue';
import { getPX, mappingArrayToObject } from '@/tools/index.js';
import GlcHitBox from './_hit-box.vue';
import { $ti } from '@/lang/input';

const extendData = inject('extendData');

const props = defineProps({ config: Object, extend: Object, uid: String, index: Number });

const bonusMap = computed(() => mappingArrayToObject(unref(extendData)?.bonus ?? []));
const bonusSymbol = computed(() => unref(extendData)?.bonus_symbol ?? '');

const currentBonus = computed(() => {
  const map = bonusMap.value ?? {};
  const id = props.extend.bonus_config_id;
  return map[id];
});

const wrapStyle = computed(() => {
  const bold = props.config.fontBold ? { fontWeight: 'bold' } : {};
  const italic = props.config.fontItalic ? { fontStyle: 'italic' } : {};
  return {
    top: getPX(props.config.position?.y),
    left: getPX(props.config.position?.x),
    width: getPX(props.config.size?.width),
    height: getPX(props.config.size?.height),
    color: props.config.color,
    textAlign: props.config.textAlign,
    fontSize: getPX(props.config.fontSize),
    letterSpacing: getPX(props.config.letterSpacing || 2),
    fontFamily: props.config.fontFamily,
    textShadow: props.config.textShadow ? `0.06em 1px 0px ${props.config.textShadow}` : null,
    ...bold,
    ...italic,
    zIndex: props.index
  };
});

const otherStyle = computed(() => props.config.otherStyle);
</script>
<style scoped lang="scss">
.widgets-text {
  position: absolute;
  padding: 10px;
}
</style>
