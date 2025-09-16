<template>
  <div class="gv-daterange-picker" :data-start-value="startTime" :data-end-value="endTime">
    <el-date-picker
      class="gv-daterange-picker-item"
      v-model="content"
      :type="type"
      value-format="x"
      :time-format="timeFormat"
      :default-time="defaultTime"
      :clearable="clearable"
      :disabled-date="disabledDate"
      @calendar-change="handlePick"
    />
    <div class="el-input replace-item" :class="customClass">
      <div class="el-input__wrapper">
        <div class="show-value flex-1 flex-row align-center">
          <span v-if="showValue" class="text" :class="fontSize" v-html="showValue" />
          <span v-else class="placeholder-text text-placeholder fz-14">{{ placeholder }}</span>
        </div>
      </div>
    </div>
    <div class="icon-btn" :class="{ clear: clearable }">
      <gv-icon name="el-icon-calendar" class="calendar fz-14 text-placeholder" />
      <gv-icon name="el-icon-circle-close" class="close fz-14 text-primary cursor-pointer" v-if="!!clearable" @click="clear" />
    </div>
    <div class="gv-date-mark" />
  </div>
</template>
<script>
export default { name: 'gv-daterange-picker' };
</script>
<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import GvIcon from '@/components/gv-icon/index.vue';
import dayjs from 'dayjs';
import { getTimeFormat } from '@/tools';
import { $t } from '@/lang/i18n';

const props = defineProps({
  startTime: { type: [String, Number], default: '' },
  endTime: { type: [String, Number], default: '' },
  type: { type: String, default: 'datetimerange' },
  placeholder: { type: String, default: $t('components.gv_daterange_picker.placeholder') },
  showFormat: { type: String, default: getTimeFormat() },
  timeFormat: { type: String, default: 'HH:mm:ss' },
  clearable: { type: Boolean, default: true },
  defaultTime: { type: [String, Object], default: () => [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)] },
  big: { type: Boolean, default: false },
  spanMonth: Number,
  customClass: String
});

const activePicker = ref([]);

const emit = defineEmits(['update:startTime', 'update:endTime', 'change']);

const inValue = (value) => {
  return value * 1000;
};

const outValue = (value, end) => {
  if (props.type === 'daterange' && !!end) {
    return Math.floor((value + (24 * 60 * 60 - 1) * 1000) / 1000);
  } else if (props.type === 'monthrange' && !!end) {
    return Math.floor(value / 1000);
  } else {
    return Math.floor(value / 1000);
  }
};

const showValue = computed(() => {
  const start = content.value[0];
  const end = content.value[1];
  const separator = props.big ? ` ${$t('components.gv_daterange_picker.to')} ` : '<br/>';
  if (start && end) {
    return dayjs(start).format(props.showFormat) + separator + dayjs(end).format(props.showFormat);
  } else {
    return null;
  }
});

const fontSize = computed(() => {
  return props.big ? 'fz-14' : 'fz-10';
});

const content = computed({
  get: () => {
    return [inValue(props.startTime), inValue(props.endTime)];
  },
  set: (value) => {
    if (value === null) {
      emit('update:startTime', '');
      emit('update:endTime', '');
    } else {
      emit('update:startTime', outValue(value[0]));
      emit('update:endTime', outValue(value[1], true));
    }
  }
});

// 禁用不符合条件的日期
const disabledDate = (time) => {
  const cache = activePicker.value ?? [];
  if (!props.spanMonth) return false;
  if ((!!cache[0] && !!cache[1]) || (!cache[0] && !cache[1])) return false;
  // 计算首日前3个月和后3个月的时间戳
  const minTime = new Date(cache[0]);
  minTime.setMonth(minTime.getMonth() - 3);
  const maxTime = new Date(cache[0]);
  maxTime.setMonth(maxTime.getMonth() + 3);
  return time < minTime || time > maxTime;
};

const handlePick = (e) => {
  activePicker.value = e;
};

watch(
  () => content.value,
  () => {
    emit('change', content);
  }
);

const clear = () => {
  emit('update:startTime', '');
  emit('update:endTime', '');
};
</script>
<style scoped lang="scss">
.gv-daterange-picker {
  position: relative;
  display: inline-block;
  vertical-align: middle;

  .text-placeholder {
    color: var(--el-text-color-placeholder);
  }

  ::v-deep(.gv-daterange-picker-item.el-range-editor.el-input__wrapper) {
    position: relative;
    width: 100%;
    opacity: 0;
    z-index: 10;
  }

  .replace-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;

    .show-value {
      line-height: 1;
      color: var(--el-input-text-color, var(--el-text-color-regular));
    }
  }

  &[data-placeholder] {
    .replace-item {
      .show-value {
        .text {
          padding-top: 4px;
        }
      }
    }
  }

  .icon-btn {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    z-index: 12;

    .calendar {
      display: inline;
    }

    .close {
      display: none;
    }
  }

  &:hover .icon-btn.clear {
    .calendar {
      display: none;
    }

    .close {
      display: inline;
    }
  }

  .el-input__inner {
    font-size: 12px;
  }
}
</style>
