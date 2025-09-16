<template>
  <gv-popup
    ref="popupRef"
    :title="$t('game.kind.btn_compose')"
    :cancel-button-text="$t('common.close_btn')"
    :confirm-button-text="$t('common.save_btn')"
    width="880px"
    :async="true"
    :show-footer="!!currentTopId"
    @confirm="handleSubmit"
    @close="handleClose"
  >
    <div class="flex-row align-top">
      <!--      -->
      <div class="top-kind-list mr-8">
        <el-scrollbar>
          <div
            class="kind-item flex-row align-center cursor-pointer"
            v-for="item in topItems"
            :key="item.id"
            :class="{ active: currentTopId === item.id }"
            @click="openEdit(item.id)"
          >
            <el-avatar :src="getBaseImagUrl(item.icon)" :size="20" />
            <div class="name text-main ml-12">{{ $ti(item.name) }}</div>
          </div>
          <template v-if="!topItems.length">
            <el-empty />
          </template>
        </el-scrollbar>
      </div>
      <!--      -->
      <div class="flex-1">
        <compose-set v-if="!!currentTopId" ref="composeSetRef" @change="handleChange" />
        <el-empty v-else :description="$t('game.kind.tips_compose_select')" />
      </div>
    </div>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, nextTick, ref, shallowRef, unref } from 'vue';
import layer from '@/tools/layer';
import { gameKindComposeGet, gameKindComposeSet } from '@/api/game/kind';
import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT, QUERY_LIST_TYPE } from '@/values';
import ComposeSet from './_components/compose-set.vue';
import { isTop } from '@/views/game/_models';
import { getBaseImagUrl, getJSON } from '@/tools';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const emit = defineEmits(['success', 'close']);
const popupRef = shallowRef();
const composeSetRef = shallowRef();
const allItems = shallowRef([]);
const composeInfo = shallowRef({}); // { id: null, content: {} }
const currentTopId = ref(null);

// 过滤后的组合选项
const topItems = computed(() => {
  const items = allItems.value.filter((item) => isTop(item.is_top) && GAME_MODEL_TYPE_BACCARAT.includes(item.game_model));
  items.sort((a, b) => a.game_model - b.game_model);
  return items;
});

// 刷新数据
const refresh = async () => {
  layer.loading();
  const { lists } = await gameKindComposeGet({ page_type: QUERY_LIST_TYPE.all });
  const info = lists[0] ?? {};
  info.content = getJSON(info.content, {});
  composeInfo.value = info;
  layer.closeLoading();
};

// 打开配置
const open = async (list) => {
  allItems.value = list;
  currentTopId.value = null;
  await refresh();
  popupRef.value.open();
};

// 打开编辑
const openEdit = async (topId) => {
  const content = composeInfo.value.content ?? {};
  currentTopId.value = topId;
  await nextTick();
  composeSetRef.value?.open(topId, content[topId], unref(allItems));
};

// 配置变更
const handleChange = async (topId, contentInfo) => {
  const content = composeInfo.value.content ?? {};
  content[topId] = contentInfo;
  composeInfo.value.content = content;
};

// 保存新增
const handleSubmit = async () => {
  const content = composeInfo.value?.content ?? {};
  const composeId = composeInfo.value?.id ?? null;
  const params = { id: composeId, content: JSON.stringify(content) };
  layer.loading();
  await gameKindComposeSet(params);
  await refresh();
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
};

const handleClose = () => {
  emit('close');
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.search-box {
  ::v-deep(.el-select) {
    .el-select__wrapper {
      border-radius: 20px;
    }
  }
}
.top-kind-list {
  width: 180px;
  height: 300px;
  .kind-item {
    position: relative;
    padding: 10px;
    margin: 8px;
    border-radius: var(--gv-border-radius-big);
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-bg-color);
    overflow: hidden;

    &:hover {
      background-color: var(--el-color-primary-light-9);
    }

    &.active {
      background-color: var(--el-color-primary);

      .name {
        color: var(--el-primary-text-color);
      }
    }
  }
}
</style>
