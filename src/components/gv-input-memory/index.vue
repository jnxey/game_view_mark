<template>
  <div class="gv-input-memory w-full">
    <el-auto-resizer>
      <template #default="{ width, height }">
        <el-dropdown ref="dropdownRef" trigger="contextmenu" :class="'w-full ' + customClass">
          <el-input
            class="search"
            v-trim
            v-model="content"
            :size="inputSize"
            :placeholder="placeholder"
            @input="valueChange"
            @focus="showPopper"
            :clearable="inputClear"
            v-place="placeTop"
          >
            <template #suffix>
              <slot name="suffix" />
            </template>
          </el-input>
          <template #dropdown>
            <el-empty v-if="!optionsMix.length" :image-size="40" />
            <el-scrollbar max-height="50vh">
              <el-dropdown-menu :style="{ width: getPX(width) }">
                <el-dropdown-item v-for="(item, index) in optionsMix" :key="item" @click="setValue(item)">
                  <div class="flex-1 flex-row align-center">
                    <span class="flex-1">{{ item }}</span>
                    <span class="close-icon flex-row align-center justify-end" v-if="!delDisable[item]" @click.stop="delValue(index)">
                      <gv-icon name="el-icon-close" class="fz-16" />
                    </span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-scrollbar>
          </template>
        </el-dropdown>
      </template>
    </el-auto-resizer>
  </div>
</template>
<script>
export default { name: 'gv-input-memory' };
</script>
<script setup>
import { computed, nextTick, onBeforeMount, ref, shallowRef, watch } from 'vue';
import { checkIndexArray, delayExec, getPX, isEmpty } from '@/tools';
import { CACHE_KEY_GV_INPUT_MEMORY } from '@/values/cache';
import { storage } from '@/tools/storage';
import { debounce } from 'throttle-debounce';
import GvIcon from '@/components/gv-icon/index.vue';

const props = defineProps({
  memoryKey: { type: String },
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  customClass: { type: String, default: '' },
  inputSize: String,
  inputClear: { type: Boolean, default: true },
  placeTop: { type: Boolean, default: false },
  defaultOptions: Array
});

const dropdownRef = shallowRef();
const optionsList = ref([]);
const emit = defineEmits(['update:modelValue', 'select', 'input']);

const optionsMix = computed(() => {
  return [...optionsList.value, ...(props.defaultOptions ?? [])];
});

const delDisable = computed(() => {
  const def = props.defaultOptions ?? [];
  const result = {};
  def.forEach((item) => (result[item] = true));
  return result;
});

const initCache = () => {
  const cache = storage.get(CACHE_KEY_GV_INPUT_MEMORY);
  optionsList.value = cache?.[props.memoryKey] ?? [];
};

const setCache = () => {
  if (!content.value || delDisable[content.value]) return;
  const cache = storage.get(CACHE_KEY_GV_INPUT_MEMORY) ?? {};
  const list = optionsList.value;
  const cKey = list.indexOf(content.value);
  if (checkIndexArray(cKey)) list.splice(cKey, 1);
  list.unshift(content.value);
  cache[props.memoryKey] = list.slice(0, 10);
  optionsList.value = cache[props.memoryKey];
  storage.set(CACHE_KEY_GV_INPUT_MEMORY, cache);
};

const delValue = (index) => {
  const cache = storage.get(CACHE_KEY_GV_INPUT_MEMORY) ?? {};
  const list = [...optionsList.value];
  list.splice(index, 1);
  cache[props.memoryKey] = list;
  optionsList.value = cache[props.memoryKey];
  storage.set(CACHE_KEY_GV_INPUT_MEMORY, cache);
};

const showPopper = () => {
  if (!!content.value) return;
  if (!optionsMix.value.length) return;
  dropdownRef.value?.handleOpen();
};

const checkPopper = () => {
  if (!!content.value) {
    dropdownRef.value?.handleClose();
  } else {
    if (!optionsMix.value.length) return;
    dropdownRef.value?.handleOpen();
  }
};

const setValue = (item) => {
  emit('update:modelValue', item);
  emit('select', item);
};

const valueChange = async () => {
  await nextTick();
  emit('input', content.value);
  setCacheDebounce();
};

const setCacheDebounce = debounce(2500, () => setCache());

const content = computed({
  get: () => {
    if (isEmpty(props.modelValue)) {
      return '';
    } else {
      return props.modelValue;
    }
  },
  set: (value) => {
    if (isEmpty(value)) {
      emit('update:modelValue', '');
    } else {
      emit('update:modelValue', value);
    }
  }
});

watch(
  () => content.value,
  async () => {
    setCacheDebounce();
    await delayExec(500);
    checkPopper();
  }
);

onBeforeMount(() => {
  initCache();
});
</script>
<style lang="scss" scoped>
.close-icon {
  i {
    margin-right: 0;
  }
}
</style>
