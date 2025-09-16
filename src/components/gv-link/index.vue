<template>
  <component :is="type" v-bind="linkProps"><slot /></component>
</template>
<script>
export default { name: 'gv-link' };
</script>
<script setup>
import { isExternal, isObject } from '@/tools';
import { computed, defineProps } from 'vue';

const props = defineProps({ to: [String, Object], replace: Boolean });

const isExternalLink = computed(() => {
  return typeof !isObject(props.to) && isExternal(props.to);
});

const type = computed(() => {
  if (isExternalLink.value) return 'a';
  return 'router-link';
});

const linkProps = computed(() => {
  if (isExternalLink.value) {
    return { href: props.to, target: '_blank' };
  }
  return props;
});
</script>
