<template>
  <el-scrollbar>
    <div class="gv-user-tree" :style="{ minWidth: minTreeWidth }">
      <div class="flex-row pl-8 pr-8 mb-12">
        <el-input v-trim v-model="query" class="w-full" :placeholder="$t('components.gv_user_tree.placeholder_user_no')" @input="onQueryChanged">
          <template #suffix>
            <gv-icon v-show="!!loading" name="el-icon-loading" class="loading-icon" />
            <gv-icon v-show="!loading" name="el-icon-refresh" class="cursor-pointer" @click="getTreeList" />
          </template>
        </el-input>
      </div>
      <el-tree-v2
        ref="treeRef"
        class="tree-wrap pl-8 pr-8"
        :props="options"
        :height="contentHeight"
        :filter-method="filterMethod"
        highlight-current
        :item-size="32"
        :indent="16"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
        @current-change="currentChange"
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
          <element-tree-line :node="node" :showLabelLine="false" :treeData="treeList" :indent="16">
            <template v-slot:node-label>
              <span
                class="ml-4"
                :style="{ color: LEVEL_COLOR_MAP[data.level_path] }"
                :class="{ 'no-leaf-text fw-bold': !node.isLeaf, 'fw-bold': data.bold }"
              >
                {{ node.label }}
              </span>
              <span v-if="!node.isLeaf" class="ml-4 text-placeholder">({{ data.children.length }})</span>
            </template>
          </element-tree-line>
        </template>
      </el-tree-v2>
    </div>
  </el-scrollbar>
</template>
<script>
export default { name: 'gv-user-tree' };
</script>
<script setup>
import { computed, onMounted, ref, shallowRef, h, reactive, nextTick } from 'vue';
import { userAllUser } from '@/api/user/list';
import { arrayToTree, checkIndexArray, delayExec, findAllParent, getPX, pageReload } from '@/tools';
import GvIcon from '@/components/gv-icon/index.vue';
import { SYSTEM_PARENT_TOP, USER_TREE_ALL_KEY, LEVEL_COLOR_MAP } from '@/values';
import { getElementLabelLine } from 'element-tree-line';
import 'element-tree-line/dist/style.css';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';
import { useWebsocket } from '@/hooks/websocket';
import { debounce } from 'throttle-debounce';

const ElementTreeLine = getElementLabelLine(h);

const emits = defineEmits(['selected']);

const props = defineProps({
  title: String,
  height: Number,
  offset: Number,
  allTitle: { type: String, default: $t('components.gv_user_tree.all_title') }
});

const options = {
  value: 'id',
  label: 'username',
  children: 'children',
  class: (data) => (data.LEVEL === 1 ? 'level-node-1' : '')
};

const treeList = ref([]);
const treeMap = ref({});
const treeExpanded = reactive([]);
const treeRef = shallowRef();
const query = ref('');
const loading = ref(false);

// 扩展宽度起始值
const extendWidthLevelStart = 5;

// 已经展开的最大层级
const maxLevelExpanded = computed(() => {
  let result = extendWidthLevelStart;
  treeExpanded.forEach((id) => {
    const isExtend = getSubExpand(id);
    if (!isExtend) return;
    const item = treeMap.value[id];
    result = Math.max(result, item?.LEVEL);
  });
  return result;
});

// 树形结构最小宽度
const minTreeWidth = computed(() => getPX(220 + (maxLevelExpanded.value - extendWidthLevelStart) * 20));

// 树高度
const contentHeight = computed(() => {
  return props.height - props.offset - 120;
});

// 获取树形数据
const getTreeList = async () => {
  loading.value = true;
  const resList = await userAllUser();
  loading.value = false;
  const expanded = [];
  const map = {};
  treeList.value = arrayToTree(resList, {
    label: 'username',
    iterator: async (item) => {
      map[item.id] = item;
      await nextTick();
      if (!!item.children?.length) expanded.push(item.id);
    },
    start: (list) => {
      if (!!resList.length)
        list.push({
          id: USER_TREE_ALL_KEY,
          pid: SYSTEM_PARENT_TOP,
          LEVEL: 1,
          username: props.allTitle,
          level_path: 0,
          bold: true,
          children: []
        });
    }
  });
  treeMap.value = map;
  treeRef.value.setData(treeList.value);
  if (!treeExpanded.length) {
    await delayExec(100);
    treeExpanded.push(...expanded);
    treeRef.value.setExpandedKeys(expanded, true);
  }
};

// 找到子节点是否被展开
const getSubExpand = (id) => {
  const pid = treeMap.value[id]?.pid;
  if (!!pid) {
    const key = treeExpanded.indexOf(pid);
    return checkIndexArray(key) ? getSubExpand(pid) : false;
  } else {
    return true;
  }
};

// 展开
const nodeExpand = (data) => {
  if (!data) return;
  treeExpanded.push(data.id);
};

// 折叠
const nodeCollapse = (data) => {
  const key = treeExpanded.findIndex((val) => val === data.id);
  if (checkIndexArray(key)) treeExpanded.splice(key, 1);
};

// 展开子节点
const expandChildNode = (id) => {
  const aParent = findAllParent(treeMap.value ?? {}, id);
  treeRef.value?.setExpandedKeys([...new Set([...treeExpanded, ...aParent])]);
};

// 选中行
const currentChange = (node) => {
  emits('selected', { id: node.id, label: !!node.id ? node.username : '', pid: node.pid, level_chain: node.level_chain });
};

// 设置选中阿航
const setSelected = async (id) => {
  const node = treeMap.value[id];
  if (!!node) {
    const current = treeRef.value?.getCurrentKey();
    if (id === current) return layer.msg($t('components.gv_user_tree.tips_selected_current'));
    treeRef.value?.setCurrentKey(id);
    currentChange(node);
    expandChildNode(id);
    await delayExec(300);
    treeRef.value?.scrollToNode(id, 'start');
  } else if (id === USER_TREE_ALL_KEY) {
    treeRef.value?.setCurrentKey(USER_TREE_ALL_KEY);
    currentChange(treeRef.value?.getNode(USER_TREE_ALL_KEY));
  } else {
    await layer.confirm($t('components.gv_user_tree.tips_no_match_user'));
    pageReload();
  }
};

// 清除选中
const clearCurrent = () => {
  treeRef.value?.setCurrentKey(USER_TREE_ALL_KEY);
  currentChange(treeRef.value?.getNode(USER_TREE_ALL_KEY));
};

// 筛选
const onQueryChanged = (query) => {
  treeRef.value?.filter(query);
};

// 过滤方法
const filterMethod = (query, node) => {
  return !node.id || checkIndexArray(node.LABEL?.indexOf(query));
};

// 根据ID获取结构
const getLevelChain = (id) => {
  if (!id) return [];
  const result = [];
  let current = treeMap.value[id];
  result.push({ ...current });
  while (!!current.pid) {
    current = treeMap.value[current.pid];
    result.push({ ...current });
  }
  return result.reverse();
};

// 根据id获取元素是否有子节点
const getKeyHasChild = (id) => {
  const map = treeMap.value ?? {};
  return !!map[id]?.children?.length;
};

const wsRisk = { room: 'broadcastUser', action: 'userAddUpdate' };
const debounceGetTreeList = debounce(500, getTreeList);
useWebsocket(wsRisk.room, (message) => {
  if (message.type === wsRisk.action) debounceGetTreeList();
});

onMounted(() => getTreeList());

defineExpose({ clearCurrent, getTreeList, getLevelChain, setSelected, getKeyHasChild });
</script>
<style lang="scss" scoped>
.gv-user-tree {
  .tree-wrap {
    max-width: 600px;

    .loading-icon {
      animation: loop-turn 2s infinite linear;
    }
  }
  ::v-deep(.el-tree) {
    .element-tree-node-line-ver,
    .element-tree-node-line-hor {
      border-color: var(--el-text-color-primary);
      border-width: 1.5px;
    }
    .el-tree-node:first-child > .el-tree-node__content {
      .element-tree-node-line-ver {
        top: 50%;
        height: 50%;
      }
    }

    &.el-tree--highlight-current .el-tree-node > .el-tree-node__content {
      &:hover {
        background-color: rgba(var(--el-color-info-rgb), 0.15);
      }
    }

    &.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      position: relative;
      background-color: var(--el-color-primary-light-9);
      z-index: 10;

      &:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 2px solid var(--el-color-primary);
        z-index: 0;
      }
    }

    .el-tree-node__content {
      .el-tree-node__expand-icon {
        position: relative;
        color: transparent;
        background-size: 50% 50%;
        background-position: 85% 60%;
        background-repeat: no-repeat;
        transform: rotate(0deg);
        z-index: 10;

        &.expanded {
          transform: rotate(0deg);
        }
      }
    }
  }
}

.gv-user-tree {
  ::v-deep(.el-tree) {
    .el-tree-node__content {
      .el-tree-node__expand-icon {
        background-image: url('@/assets/images/layout/icon_folder_close.png');

        &.expanded {
          background-image: url('@/assets/images/layout/icon_folder_open.png');
        }
      }
    }
  }
}

/**************主题优化***************/
.theme-dark {
  .gv-user-tree {
    ::v-deep(.el-tree) {
      .el-tree-node__content {
        .el-tree-node__expand-icon {
          background-image: url('@/assets/images/layout/icon_folder_close_lighter.png');

          &.expanded {
            background-image: url('@/assets/images/layout/icon_folder_open_lighter.png');
          }
        }
      }
    }
  }
}
</style>
