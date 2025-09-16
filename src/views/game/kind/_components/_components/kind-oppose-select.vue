<template>
  <gv-popup ref="popupRef" :title="$t('game.kind.title_compose_oppose')" :async="true" width="600px" @confirm="handleConfirm">
    <div class="compose-add-wrap">
      <!--      -->
      <div class="select-wrap">
        <div class="flex-row align-center flex-wrap" v-for="(list, key) in selectItems" :key="'top_' + key">
          <div
            v-if="checkOppose(list)"
            class="kind-item text-center cursor-pointer mr-8 mb-8"
            v-for="item in list"
            :key="item.id"
            :class="{ active: activeMap[item.id], disabled: checkDisabled(item) }"
            @click="selectItem(item)"
          >
            <el-avatar class="mb-4" :src="getBaseImagUrl(allItemsMap[item.id]?.icon)" :size="40" />
            <div class="name">
              <span class="fz-12 fw-bold">{{ allItemsMap[item.id]?.id }}:</span>
              <span class="fz-12 text-regular">{{ $ti(allItemsMap[item.id]?.name) }}</span>
            </div>
            <gv-icon v-if="activeMap[item.id]" name="local-icon-select-mark" class="mark-icon fz-16" />
          </div>
        </div>
      </div>
    </div>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, reactive, shallowRef } from 'vue';
import { checkIndexArray, getBaseImagUrl, mappingArrayToObject } from '@/tools';
import GvIcon from '@/components/gv-icon/index.vue';
import layer from '@/tools/layer';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const emit = defineEmits(['success']);
const popupRef = shallowRef();
const allItemsMap = shallowRef([]);
const composeList = shallowRef({});
const currentList = reactive([]);

// 已经选中的
const activeMap = computed(() => mappingArrayToObject(currentList, null));

// 禁用选项
const currentPid = computed(() => {
  if (!currentList.length) return null;
  const key = composeList.value.findIndex((val) => val.id === currentList[0]);
  return checkIndexArray(key) ? composeList.value[key]?.pid : null;
});

// 选择项
const selectItems = computed(() => {
  const result = {};
  composeList.value.forEach((item) => {
    if (!result[item.pid]) result[item.pid] = [];
    result[item.pid].push(item);
  });
  return result;
});

// 打开
const open = (map, list) => {
  allItemsMap.value = map;
  composeList.value = list;
  currentList.splice(0);
  popupRef.value.open();
};

// 检查是否禁用
const checkDisabled = (item) => {
  return currentPid.value && item.pid !== currentPid.value;
};

// 选中
const selectItem = (item) => {
  if (checkDisabled(item)) return;
  const key = currentList.findIndex((val) => val === item.id);
  if (checkIndexArray(key)) currentList.splice(key, 1);
  else currentList.push(item.id);
};

// 检查是否可以设置组合
const checkOppose = (list) => {
  return list?.length > 1;
};

// 提交
const handleConfirm = async () => {
  if (currentList.length < 2) return layer.msgError($t('game.kind.tips_compose_oppose_select'));
  emit('success', [...currentList]);
  popupRef.value.close();
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.compose-add-wrap {
  min-height: 300px;

  .kind-item {
    position: relative;
    width: 80px;
    padding: 10px;
    border: 2px solid var(--el-fill-color-dark);
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-fill-color-dark);

    .mark-icon {
      position: absolute;
      top: 0;
      right: 0;
      color: var(--el-color-primary);
    }

    &:hover {
      background-color: var(--el-fill-color);
    }

    &.active {
      border-color: var(--el-color-primary);
    }

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      border-color: var(--el-fill-color-dark);
    }
  }
}
</style>
