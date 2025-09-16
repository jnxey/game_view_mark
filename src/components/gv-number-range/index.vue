<template>
  <div class="gv-number-range flex-row align-center">
    <el-input-number
      v-model="contentStart"
      class="mr-12"
      :controls="false"
      :max="isEmpty(contentEnd) ? Number.MAX_SAFE_INTEGER : contentEnd - 1"
      :placeholder="placeholderStart"
    />
    ~
    <el-input-number
      v-model="contentEnd"
      class="ml-12"
      :controls="false"
      :min="isEmpty(contentStart) ? Number.MAX_SAFE_INTEGER : contentStart + 1"
      :placeholder="placeholderEnd"
    />
  </div>
</template>
<script>
export default { name: 'gv-number-range' };
</script>
<script setup>
import { computed } from 'vue';
import { isEmpty } from '@/tools';
import { $t } from '@/lang/i18n';

const emit = defineEmits(['update:start', 'update:end']);

const props = defineProps({
  start: { type: [String, Number], default: '' },
  end: { type: [String, Number], default: '' },
  placeholderStart: { type: String, default: $t('common.from') },
  placeholderEnd: { type: String, default: $t('common.to') }
});

const contentStart = computed({
  get: () => {
    return isEmpty(props.start) ? null : props.start;
  },
  set: (value) => {
    if (isEmpty(value)) {
      emit('update:start', null);
    } else {
      emit('update:start', value);
    }
  }
});

const contentEnd = computed({
  get: () => {
    return isEmpty(props.end) ? null : props.end;
  },
  set: (value) => {
    if (isEmpty(value)) {
      emit('update:end', null);
    } else {
      emit('update:end', value);
    }
  }
});
</script>
<style scoped lang="scss"></style>
