<template>
  <el-tooltip effect="dark" :content="$t('components.gv_table.btn_setting')" placement="bottom">
    <el-button class="ml-12" v-popover="popoverRef" v-click-outside="onClickOutside" circle icon="Setting" />
  </el-tooltip>
  <el-popover ref="popoverRef" placement="bottom" trigger="click" virtual-triggering persistent width="180px" popper-class="field-setting-popover">
    <el-scrollbar class="field-setting" max-height="60vh">
      <div v-if="!columnsMap.left.length" class="setting-field-item flex-row align-center">
        <span class="text-place-color fz-12">{{ $t('components.gv_table.tips_setting_top_fixed') }}</span>
      </div>
      <!--    -->
      <div class="drag-wrap" ref="selfEl">
        <!--   left   -->
        <div class="setting-field-item flex-row align-center" v-for="item in columnsMap.left" :key="item.dataIndex" :data-key="item.dataIndex">
          <gv-icon name="local-icon-drag-dot" class="drag-box text-place-color fz-16" />
          <span class="flex-1 flex-w0 text-line-1 fz-14 text-regular-color ml-4">
            {{ item.title }}
          </span>
          <el-checkbox class="show-check ml-4" :model-value="!handleSetting[item.dataIndex]?.hide" @click="toggleShow(item)" />
        </div>
        <!--  lock  -->
        <div data-fixed-left="true" class="setting-field-item fixed-lock flex-row align-center">
          <gv-icon name="local-icon-warn-line" class="text-place-color fz-16" />
          <span class="text-place-color fz-12 ml-4">
            {{ $t('components.gv_table.label_setting_top_fixed') }} (
            <span class="text-primary-color">{{ columnsMap.left.length }}</span>
            <span>/{{ formatColumns.length }}</span>
            )
          </span>
        </div>
        <!--  mid  -->
        <div class="setting-field-item flex-row align-center" v-for="item in columnsMap.mid" :key="item.dataIndex" :data-key="item.dataIndex">
          <gv-icon name="local-icon-drag-dot" class="drag-box text-place-color fz-16" />
          <span class="flex-1 flex-w0 text-line-1 fz-14 text-regular-color ml-4 text-ellipsis" :title="item.title">
            {{ item.title }}
          </span>
          <el-checkbox class="show-check ml-4" :model-value="!handleSetting[item.dataIndex]?.hide" @click="toggleShow(item)" />
        </div>
      </div>
      <!--    -->
      <!--    -->
      <div class="setting-field-item flex-row align-center" v-for="item in columnsMap.right" :key="item.dataIndex" :data-key="item.dataIndex">
        <gv-icon name="local-icon-drag-dot" class="drag-box text-place-color fz-16" />
        <span class="flex-1 flex-w0 text-line-1 fz-14 text-place-color ml-4 text-ellipsis" :title="item.title">
          {{ item.title }}
        </span>
        <el-checkbox class="show-check ml-4" :model-value="!handleSetting[item.dataIndex]?.hide" @click="toggleShow(item)" />
      </div>
      <div class="setting-field-item fixed-lock flex-row align-center">
        <gv-icon name="local-icon-warn-line" class="text-place-color fz-16" />
        <span class="text-place-color fz-12 ml-4">{{ $t('components.gv_table.tips_setting_footer_drag') }}</span>
      </div>
      <div class="setting-field-item fixed-lock dashed flex-row align-center">
        <el-button link type="danger" icon="Delete" @click="clearSetting">{{ $t('components.gv_table.btn_delete_setting') }}</el-button>
      </div>
    </el-scrollbar>
  </el-popover>
</template>

<script setup>
import { computed, nextTick, inject, shallowRef, unref, onMounted } from 'vue';
import dragula from 'dragula/dist/dragula';
import 'dragula/dist/dragula.css';
import { ClickOutside as vClickOutside } from 'element-plus';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';
import layer from '@/tools/layer';

const selfEl = shallowRef(null);
const popoverRef = shallowRef(null);

const formatColumns = inject('formatColumns');
const handleSetting = inject('handleSetting');
const setHandleSetting = inject('setHandleSetting');
const cacheDragula = { value: null };

const columnsMap = computed(() => {
  const left = [];
  const mid = [];
  const right = [];
  formatColumns.value.forEach((item) => {
    if (item.fixed === 'left') left.push(item);
    else if (item.fixed === 'right') right.push(item);
    else mid.push(item);
  });
  return { left, mid, right };
});

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};

const changeShow = async (val) => {
  await nextTick();
  if (!selfEl.value) return;
  cacheDragula.value = dragula([selfEl.value], {
    invalid: (el, handle) => {
      return !checkDrag(handle);
    }
  }).on('dragend', () => {
    execDrag();
  });
};

const checkDrag = (el) => {
  if (!el) {
    return false;
  } else if (el.classList?.contains('setting-field-item')) {
    return false;
  } else if (el.classList?.contains('drag-box')) {
    return true;
  } else {
    return checkDrag(el.parentNode);
  }
};

const execDrag = async () => {
  await nextTick();
  const nodes = Array.prototype.slice.apply(selfEl.value.children);
  let overFixed = false;
  const map = handleSetting.value ? { ...handleSetting.value } : {};
  nodes.forEach((node, index) => {
    if (!node) return;
    const fixed = node.getAttribute('data-fixed-left');
    const key = node.getAttribute('data-key');
    if (fixed) return (overFixed = true);
    if (!key) return false;
    if (!map[key]) map[key] = {};
    map[key].order = index;
    map[key].fixed = !overFixed ? 'left' : null;
  });
  setHandleSetting(map);
};

const clearSetting = async () => {
  await layer.confirm($t('components.gv_table.tips_delete_setting'));
  setHandleSetting({});
};

const toggleShow = (item) => {
  const map = handleSetting.value;
  if (!map[item.dataIndex]) map[item.dataIndex] = {};
  map[item.dataIndex].hide = !map[item.dataIndex].hide;
  setHandleSetting(map);
};

onMounted(() => {
  changeShow();
});
</script>
<style scoped lang="scss">
.field-setting {
  .setting-field-item {
    box-sizing: border-box;
    height: 38px;
    line-height: 1.2;
    padding: 0 12px;
    user-select: none;

    .drag-box {
      cursor: move;

      &.disabled {
        cursor: not-allowed;
      }
    }

    &.fixed-lock {
      border-top: 1px solid var(--el-border-color);

      &.dashed {
        border-style: dashed;
      }
    }
  }
  .setting-field-item.gu-mirror {
    opacity: 1;
    background-color: var(--el-color-primary-light-9);

    .drag-box {
      color: var(--el-color-primary);
    }
  }

  .text-place-color {
    color: var(--el-text-color-placeholder);
  }
}
</style>
<style lang="scss">
.el-popper.field-setting-popover {
  padding: 0;
}
</style>
