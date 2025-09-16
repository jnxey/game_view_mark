<template>
  <gv-drag-area ref="dragAreaRef" class="compose-set-wrap" content-class="content-padding">
    <template #content>
      <gv-mind-map :tree-data="treeData" row-key="id" @trigger-add="handleAdd" @trigger-del="handleDel" :show-handle="showHandle">
        <template #title="{ row }">
          <div class="flex-row align-center">
            <el-avatar :src="getBaseImagUrl(allItemsMap[row.id]?.icon)" :size="20" />
            <span v-if="!!allItemsMap[row.id]?.name" class="ml-12">{{ $ti(allItemsMap[row.id]?.name) }}</span>
            <span v-else class="ml-12 text-del-line">{{ $t('game.kind.label_deleted') }}</span>
          </div>
        </template>
      </gv-mind-map>
    </template>
    <template #other>
      <span class="oppose-button cursor-pointer" @click="openAddOppose">
        <span class="add-text fz-12">{{ $t('game.kind.btn_compose_oppose') }}</span>
        <gv-icon class="fz-16 add-icon" name="el-icon-plus" />
      </span>
      <div class="oppose-wrap">
        <el-scrollbar>
          <div class="oppose-item" v-for="(list, index) in opposeList" :key="getMultipleKey(index, list.join('-'))">
            <div class="item flex-row align-center" v-for="(item, _index) in list" :key="getMultipleKey(index, _index, item)">
              <el-avatar :src="getBaseImagUrl(allItemsMap[item]?.icon)" :size="20" />
              <span v-if="!!allItemsMap[item]?.name" class="ml-12 flex-w0">{{ $ti(allItemsMap[item]?.name) }}</span>
              <span v-else class="ml-12 flex-w0 text-del-line">{{ $t('game.kind.label_deleted') }}</span>
            </div>
            <span class="close-icon flex-row align-center justify-center cursor-pointer" @click="handleDelOppose(index)">
              <gv-icon name="el-icon-close" class="fz-12" />
            </span>
          </div>
        </el-scrollbar>
      </div>
    </template>
  </gv-drag-area>
  <kind-select ref="kindSelectRef" />
  <kind-oppose-select ref="kindOpposeSelectRef" @success="handleAddOppose" />
</template>
<script setup>
import { computed, reactive, ref, shallowRef, watch } from 'vue';
import GvMindMap from '@/components/gv-mind-map/index.vue';
import {
  arrayToTree,
  checkIndexArray,
  deepClone,
  findAllChildren,
  getBaseImagUrl,
  getMultipleKey,
  mappingArrayToObject,
  removeElements
} from '@/tools';
import KindSelect from './kind-select.vue';
import { GAME_KIND_POSITION } from '@/values';
import { isTop } from '@/views/game/_models';
import GvDragArea from '@/components/gv-drag-area/index.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import KindOpposeSelect from '@/views/game/kind/_components/_components/kind-oppose-select.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const emit = defineEmits(['change', 'close']);
const kindSelectRef = shallowRef();
const kindOpposeSelectRef = shallowRef();
const dragAreaRef = shallowRef();
const allItems = shallowRef([]);
const topId = ref();
const composeList = reactive([]);
const opposeList = reactive([]);
const treeData = computed(() => arrayToTree(composeList)); // { id: 1, children: [...] }

// 配置项 MAP
const allItemsMap = computed(() => mappingArrayToObject(allItems.value));

// 当前可选择的配置
const selectItems = computed(() => {
  const aMap = allItemsMap.value ?? {};
  return allItems.value.filter((item) => {
    return !isTop(item.is_top) && item.game_model === aMap[topId.value]?.game_model;
  });
});

// 当前可选择的配置
const disableItems = computed(() => {
  const result = {};
  const map = mappingArrayToObject(composeList);
  allItems.value.forEach((item) => {
    if (item.sub_position === GAME_KIND_POSITION.main && item.sub_main_id !== topId.value) result[item.id] = true;
    if (!!map[item.id]) result[item.id] = true;
  });
  return result;
});

// 重置treeData
const resetValue = (id, content) => {
  composeList.splice(0);
  opposeList.splice(0);
  if (content) {
    composeList.push(...(content.composeList ?? []));
    opposeList.push(...(content.opposeList ?? []));
  } else {
    composeList.push({ id: id, pid: 0 });
  }
};

// 打开
const open = async (id, content, list) => {
  allItems.value = list;
  topId.value = id;
  resetValue(id, content);
  dragAreaRef.value?.resetPointer();
};

// 判断是否显示add，del按钮
const showHandle = (item) => {
  const result = { add: true, del: true };
  if (item.id === topId.value) result.del = false;
  return result;
};

// 新增
const handleAdd = async (item) => {
  kindSelectRef.value?.open(selectItems.value, disableItems.value, (select) => {
    composeList.push({ id: select.id, pid: item.id });
  });
};

// 删除
const handleDel = async (item) => {
  const key = composeList.findIndex((val) => val.id === item.id);
  if (checkIndexArray(key)) composeList.splice(key, 1);
  const children = findAllChildren(composeList, item.id);
  const map = mappingArrayToObject(children);
  removeElements(composeList, (val) => !!map[val.id]);
};

// 打开-同级互斥组合
const openAddOppose = async () => {
  kindOpposeSelectRef.value?.open(allItemsMap.value, composeList);
};

// 新增-同级互斥组合
const handleAddOppose = async (list) => {
  opposeList.push(list);
};

// 删除-同级互斥组合
const handleDelOppose = async (index) => {
  opposeList.splice(index, 1);
};

watch(
  [composeList, opposeList],
  () => {
    emit('change', topId.value, deepClone({ composeList, opposeList }));
  },
  { deep: true }
);

defineExpose({ open });
</script>
<style lang="scss" scoped>
.compose-set-wrap {
  width: 100%;
  height: 300px;
  background-color: var(--el-fill-color);

  ::v-deep(.content-padding) {
    padding-left: 30px;
    padding-top: 20px;
  }

  .oppose-wrap {
    position: absolute;
    top: 50px;
    right: 0;
    bottom: 8px;
    width: 140px;
    z-index: 10;

    .oppose-item {
      position: relative;
      margin: 8px;
      padding: 4px 0;
      border-radius: var(--gv-border-radius-big);
      box-shadow: var(--el-box-shadow-light);
      color: var(--el-text-color);
      background-color: var(--el-bg-color);
      overflow: hidden;

      .item {
        padding: 4px 8px;
        white-space: nowrap;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .close-icon {
        position: absolute;
        top: 0;
        right: 0;
        padding: 5px;
        z-index: 10;

        &:hover {
          color: var(--el-primary-text-color);
          border-radius: 0 0 0 var(--gv-border-radius-big);
          background-color: var(--el-color-primary);
        }
      }
    }
  }

  .oppose-button {
    position: absolute;
    top: 8px;
    right: 8px;
    max-width: 32px;
    min-width: 32px;
    height: 32px;
    line-height: 32px;
    border-radius: 16px;
    box-shadow: var(--el-box-shadow-light);
    color: var(--el-text-color);
    background-color: var(--el-bg-color);
    user-select: none;
    z-index: 10;

    .add-text {
      display: none;
      padding-left: 16px;
      padding-right: 32px;
      white-space: nowrap;
    }

    .add-icon {
      position: absolute;
      right: 8px;
      top: 8px;
    }

    &:hover {
      max-width: 300px;
      color: var(--el-primary-text-color);
      background-color: var(--el-color-primary);
      .add-text {
        display: inline;
        color: var(--el-primary-text-color);
      }
    }
  }
}
</style>
