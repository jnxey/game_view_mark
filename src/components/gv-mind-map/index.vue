<template>
  <div class="mind-wrap" :data-level="level">
    <div class="mind-item" v-for="item in treeData" :key="item[rowKey]">
      <div class="title">
        <slot name="title" :row="item" />
        <span v-if="showHandle(item)?.add" class="icon-button add-button" @click="add(item)">
          <gv-icon name="el-icon-circle-plus" class="fz-16" />
        </span>
        <span v-if="showHandle(item)?.del" class="icon-button del-button" @click="del(item)">
          <gv-icon name="el-icon-remove" class="fz-16" />
        </span>
      </div>
      <gv-mind-map
        v-if="!!item.children?.length"
        :tree-data="item.children"
        :row-key="rowKey"
        @trigger-add="add"
        @trigger-del="del"
        :show-handle="showHandle"
        :level="level + 1"
      >
        <!-- 透传所有插槽 -->
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </gv-mind-map>
    </div>
  </div>
</template>
<script>
export default { name: 'gv-mind-map' };
</script>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';

const emit = defineEmits(['triggerAdd', 'triggerDel']);
const props = defineProps({
  treeData: Array,
  rowKey: String,
  level: { type: Number, default: 0 },
  showHandle: { type: Function, default: () => ({ add: true, del: true }) }
});

const add = (item) => {
  emit('triggerAdd', item);
};

const del = (item) => {
  emit('triggerDel', item);
};
</script>
<style lang="scss" scoped>
/* 绘制项 */

// 项外层
.mind-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

// 项
.mind-item {
  position: relative;
  display: flex;
  align-items: center;
}

.mind-item .title {
  position: relative;
  display: block;
  padding: 10px 15px;
  border-radius: 100px;
  background: var(--el-bg-color);
  margin: 10px 0;
  box-shadow: var(--el-box-shadow-light);
  border: 1px solid var(--el-border-color);
  margin-right: 60px;
  user-select: none;

  .icon-button {
    display: none;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    transform: translateY(-50%);
    cursor: pointer;
    color: var(--el-primary-text-color);
    z-index: 10;

    &.add-button {
      right: -8px;
      background-color: var(--el-color-primary);
    }

    &.del-button {
      left: -9px;
      background-color: var(--el-color-danger);
    }
  }

  &:hover .icon-button {
    display: flex;
  }
}

/* 绘制线段 */

// 左侧线段
.mind-item:before {
  content: '';
  position: absolute;
  left: -30px;
  top: 50%;
  width: 30px;
  height: 1px;
  background: var(--el-color-primary);
}

// 上下线段
.mind-item:after {
  content: '';
  position: absolute;
  left: -30px;
  width: 1px;
  height: calc(100% + 20px);
  top: 0;
  transform: translateY(-10px);
  background: var(--el-color-primary);
}

// 右侧线段
.mind-item .title:after {
  content: '';
  width: 30px;
  height: 1px;
  background: var(--el-color-primary);
  position: absolute;
  right: -30px;
  top: 50%;
}

/* 去除多出的线段 */
.mind-item:first-child:after {
  height: calc(50% + 10px);
  transform: unset;
  top: 50%;
}

.mind-item:last-child:after {
  height: calc(50% + 10px);
  transform: unset;
  top: -10px;
}

.mind-item .title:not(:has(+ .mind-wrap)):after {
  display: none;
}

.mind-wrap[data-level='0'] > .mind-item:first-child:last-child {
  &:before {
    display: none;
  }
}

.mind-item:first-child:last-child {
  &:after {
    display: none;
  }
}
</style>
