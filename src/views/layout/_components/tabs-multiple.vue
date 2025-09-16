<template>
  <div ref="tabsWrapRef" class="tabs-multiple">
    <el-tabs
      class="tabs-wrap"
      @click.right.prevent="rightClick"
      :model-value="currentTab"
      :closable="tabsListState.length > 1"
      @tab-change="handleChange"
      @tab-remove="closeClick($event)"
    >
      <template v-for="item in tabsListState" :key="item.fullPath">
        <el-tab-pane :label="$t(item.title, item.cache_query)" :name="item.fullPath" @click.right.prevent.native></el-tab-pane>
      </template>
    </el-tabs>
    <gv-command ref="commandRef">
      <div class="command-item" @click="handlerRemoveTab(commandFullPath)">{{ $t('layout.close') }}</div>
      <div class="command-item" @click="handlerRemoveOtherTab">{{ $t('layout.close_other') }}</div>
      <div class="command-item" @click="handlerRemoveAllTab">{{ $t('layout.close_all') }}</div>
    </gv-command>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { removeOtherTab, updateTab, removeAllTab, removeTab, tabsListState } from '@/store/tabs';
import { computed, ref, shallowRef, watch } from 'vue';
import GvCommand from '@/components/gv-command/index.vue';
import { $t } from '@/lang/i18n';

const route = useRoute();
const router = useRouter();
const tabsWrapRef = shallowRef();
const commandRef = shallowRef();
const commandFullPath = ref();

const currentTab = computed(() => {
  return route.fullPath;
});

watch(route, () => updateTab(route), { immediate: true });

const handleChange = (fullPath) => {
  router.push(fullPath);
};

const closeClick = (fullPath) => {
  removeTab(currentTab.value, fullPath, router);
};

const rightClick = (event) => {
  const prefix = 'tab-';
  let fullPath = '';
  let current = event.target;
  while (current && current !== tabsWrapRef.value) {
    const id = event.target.getAttribute('id');
    if (id && id.indexOf(prefix) === 0) {
      fullPath = id.replace(prefix, '');
    }
    current = current.parentNode;
  }
  if (fullPath) {
    commandRef.value.open(event);
    commandFullPath.value = fullPath;
  }
};

const handlerRemoveTab = (fullPath) => {
  removeTab(currentTab.value, fullPath, router);
  commandRef.value.close();
};

const handlerRemoveOtherTab = () => {
  removeOtherTab(commandFullPath.value || currentTab.value, router);
  commandRef.value.close();
};

const handlerRemoveAllTab = () => {
  removeAllTab(router);
  commandRef.value.close();
};
</script>
<style lang="scss" scoped>
.tabs-multiple {
  .tabs-wrap {
    ::v-deep(.el-tabs__header) {
      margin-bottom: 0;
      .el-tabs__nav {
        padding-left: 15px;
      }
    }
  }
}
</style>
