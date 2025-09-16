<template>
  <div class="gv-scene-number flex-row align-center justify-center" :style="{ width: getPX(width) }">
    <div class="number-item flex-row align-center justify-center fz-16" :style="boxStyle" v-for="(item, index) in valueArray" :key="index">
      {{ item }}
    </div>
  </div>
</template>
<script>
export default { name: 'gv-scene-number' };
</script>
<script setup>
import { getPX } from '@/tools';
import { computed, ref } from 'vue';

const props = defineProps({
  value: String,
  width: Number
});

const valueArray = computed(() => {
  return props.value.split('');
});

const boxSize = computed(() => {
  if (props.width / valueArray.value.length < 32) {
    return 20;
  } else {
    return 30;
  }
});

const boxStyle = computed(() => {
  return { width: getPX(boxSize.value), height: getPX(boxSize.value) };
});
</script>
<style lang="scss" scoped>
.gv-scene-number {
  .number-item {
    margin: 2px;
    border: 1px solid rgb(15, 174, 198);
    color: rgb(244, 250, 251);
    background-image: linear-gradient(to bottom, rgb(6, 48, 64), rgba(14, 149, 199, 0.8), rgb(6, 48, 64));
  }
}
</style>
