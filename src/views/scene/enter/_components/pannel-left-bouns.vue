<template>
  <div class="panel-left-bonus flex-col">
    <el-scrollbar class="flex-1 flex-h0">
      <div
        v-for="(item, index) in bonusList"
        :key="item.id"
        class="bonus-item flex-row align-center mb-8 fz-14 scene-text-main-color cursor-pointer"
        :class="{ active: current === item.id }"
        @click="selectBonus(item)"
      >
        <div class="index">
          <template v-if="current === item.id">
            <gv-icon name="el-icon-success-filled" class="fz-14 text-success" />
          </template>
          <template v-else>
            {{ index + 1 }}
          </template>
        </div>
        <div class="name flex-1">{{ $ti(item.name) }}</div>
        <div class="amount text-right">{{ calcAmount(item.prize_pool) }}</div>
      </div>
    </el-scrollbar>
    <div v-if="selectMode" class="btn-wrap flex-row align-center justify-center p-8">
      <div class="confirm-btn mr-16" @click="confirm">{{ $t('common.confirm_btn') }}</div>
      <div class="cancel-btn" @click="cancel">{{ $t('common.close_btn') }}</div>
    </div>
  </div>
</template>
<script setup>
import { inject, onBeforeUnmount, onMounted, ref, unref } from 'vue';
import { calcAmount } from '@/tools';
import eventManager from '@/tools/event-manager';
import { EVENTS_SCENE_BONUS_SELECT, EVENTS_SCENE_OPENING_SET } from '@/values/events';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const bonusList = inject('bonusList');

const current = ref();

const selectMode = ref(false);

const cacheCallback = { confirm: null, cancel: null };

// 清空选中项
const clearCurrent = () => {
  current.value = null;
};

// 设置选中项
const setCurrent = (value) => {
  current.value = value;
};

// 选中彩金奖项
const selectBonus = (row) => {
  if (!selectMode.value) return;
  if (row.id === unref(current)) clearCurrent();
  else setCurrent(row.id);
};

// 进入选择彩金
const enterMode = ({ value, confirm, cancel }) => {
  selectMode.value = true;
  setCurrent(value);
  cacheCallback.confirm = confirm;
  cacheCallback.cancel = cancel;
};

// 退出彩金选择
const outMode = () => {
  selectMode.value = false;
  clearCurrent();
};

// 点击确认
const confirm = () => {
  if (cacheCallback.confirm) cacheCallback.confirm(unref(current));
  outMode();
};

// 点击确认
const cancel = () => {
  if (cacheCallback.cancel) cacheCallback.cancel();
  outMode();
};

onMounted(() => {
  eventManager.on(EVENTS_SCENE_OPENING_SET, clearCurrent); // 监听录入操作
  eventManager.on(EVENTS_SCENE_BONUS_SELECT, enterMode); // 监听选择操作
});

onBeforeUnmount(() => eventManager.off(EVENTS_SCENE_OPENING_SET, clearCurrent));
</script>
<style lang="scss" scoped>
.panel-left-bonus {
  width: 100%;
  height: 100%;
  .bonus-item {
    height: 30px;
    padding: 0 8px;
    background-color: rgba(19, 166, 188, 0.1);

    &.active {
      background-color: rgba(18, 98, 110, 0.8);
    }

    .index {
      width: 25px;
    }

    .name {
      word-break: keep-all;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .amount {
      min-width: 60px;
      color: var(--scene-enter-bonus-amount-color);
    }
  }

  .confirm-btn {
    padding: 5px 8px;
    cursor: pointer;
    color: var(--scene-enter-bonus-btn-text);
    background-color: var(--scene-enter-bonus-confirm-color);
  }

  .cancel-btn {
    padding: 5px 8px;
    cursor: pointer;
    color: var(--scene-enter-bonus-btn-text);
    background-color: var(--scene-enter-bonus-cancel-color);
  }
}
</style>
