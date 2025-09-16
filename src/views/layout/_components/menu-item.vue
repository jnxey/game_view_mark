<template>
  <template v-if="!route.meta.hidden">
    <gv-link v-if="!hasShowChild" :to="{ path: `${routePath}${queryStr}`, params: queryParams }">
      <el-menu-item :index="routePath">
        <gv-icon class="menu-item-icon" :size="16" v-if="routeMeta?.icon" :name="routeMeta?.icon" />
        <template #title>
          <span :class="{ 'fw-bold': first }">{{ $t(routeMeta?.title) }}</span>
        </template>
      </el-menu-item>
    </gv-link>
    <el-sub-menu v-else :index="routePath">
      <template #title>
        <gv-icon class="menu-item-icon" :size="16" v-if="routeMeta?.icon" :name="routeMeta?.icon" />
        <span :class="{ 'fw-bold': first }">{{ $t(routeMeta?.title) }}</span>
      </template>
      <menu-item v-for="item in route?.children" :key="resolvePath(item.path)" :route="item" :route-path="resolvePath(item.path)" />
    </el-sub-menu>
  </template>
</template>
<script>
export default { name: 'menu-item' };
</script>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';
import GvLink from '@/components/gv-link/index.vue';
import { isExternal, getNormalPath, objectToQuery, getJSON } from '@/tools';
import { computed } from 'vue';
import { $t } from '@/lang/i18n';
import { isObject } from '@vue/shared';
import { base64 } from '@/tools/base64';

const props = defineProps({ route: Object, routePath: String, first: Boolean });

const hasShowChild = computed(() => {
  const children = props.route.children ?? [];
  return !!children.filter((item) => !item.meta?.hidden).length;
});

const routeMeta = computed(() => {
  return props.route.meta;
});

const resolvePath = (path) => {
  if (isExternal(path)) return path;
  return getNormalPath(path);
};

const queryStr = computed(() => {
  const queryObj = props.route.meta?.query ?? {};
  const result = objectToQuery(queryObj);
  return result ? '?' + result : '';
});

const queryParams = computed(() => {
  if (props.routePath?.indexOf(':uni') >= 0) {
    const qString = isObject(props.route.meta?.query) ? JSON.stringify(props.route.meta?.query) : 'all';
    return { uni: base64.encode(qString) };
  } else {
    return {};
  }
});
</script>
<style lang="scss" scoped></style>
