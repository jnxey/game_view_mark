<template>
  <el-select
    ref="selectRef"
    v-model="content"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    @change="valueChange"
    @blur="handleBlur"
    filterable
    remote
    :remote-method="remoteMethod"
    :loading="loading"
    v-place="placeTop"
  >
    <el-option
      v-for="(item, index) in tableData"
      :key="index"
      :label="item.username"
      :value="item.id"
      :disabled="disabledOption[item.id]"
      @click="clearCacheQuery"
    >
      <div class="flex-row align-center">
        <el-avatar :size="18" :src="getAlbumDef(item.avatar)" />
        <span class="ml-12">{{ item.username }}</span>
      </div>
    </el-option>
    <template #loading>
      <span>{{ $t('common.loading') }}</span>
    </template>
    <template #empty>
      <span>{{ isLoaded ? $t('common.no_match_data') : $t('common.loading') }}</span>
    </template>
  </el-select>
</template>
<script>
export default { name: 'gv-select-user-inline' };
</script>
<script setup>
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import { checkIndexArray, getAlbumDef, toAwait } from '@/tools';
import { userListsBase } from '@/api/user/list';
import { QUERY_LIST_TYPE } from '@/values';
import { $t } from '@/lang/i18n';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: $t('components.gv_select_user.placeholder_search') },
  clearable: { type: Boolean, default: true },
  disabled: Boolean,
  disabledOption: { type: Object, default: () => new Object() },
  placeTop: { type: Boolean, default: false },
  defaultOptions: Array
});

const selectRef = shallowRef();
const tableData = ref(props.defaultOptions ?? []);
const loading = ref(false);
const isLoaded = ref(false);
const cacheQuery = ref(null);

const emit = defineEmits(['update:modelValue', 'change']);

const content = computed({
  get: () => {
    if (!props.modelValue) {
      return null;
    } else {
      return Number(props.modelValue);
    }
  },
  set: (value) => {
    if (!value) {
      emit('update:modelValue', null);
    } else {
      emit('update:modelValue', value);
    }
  }
});

const valueChange = (val) => {
  emit('change', val);
  if (!!val) tableData.value = [];
};

const clearCacheQuery = () => {
  cacheQuery.value = null;
};

const remoteMethod = async (query) => {
  cacheQuery.value = query;
  if (!query) return (tableData.value = []);
  loading.value = true;
  const [res] = await toAwait(userListsBase({ page_type: QUERY_LIST_TYPE.pager, page_no: 1, page_size: 5, username: query }));
  loading.value = false;
  isLoaded.value = true;
  tableData.value = res.lists;
};

const setTableData = (list) => {
  tableData.value = list;
};

const handleBlur = async () => {
  isLoaded.value = false;
  if (!cacheQuery.value) return;
  const list = tableData.value ?? [];
  const key = list.findIndex((val) => val.username === cacheQuery.value);
  if (checkIndexArray(key)) {
    emit('update:modelValue', list[key]?.id);
    await nextTick();
    emit('change', list[key]?.id);
  }
  clearCacheQuery();
};

const getUsername = () => {
  return selectRef.value?.selectedLabel;
};

watch(
  () => content.value,
  async () => {
    await nextTick();
    const label = getUsername();
    if (String(label) !== String(content.value)) return;
    const [res] = await toAwait(userListsBase({ page_type: QUERY_LIST_TYPE.pager, page_no: 1, page_size: 5, id: content.value }));
    tableData.value = res.lists;
  },
  { immediate: true }
);

defineExpose({ setTableData, getUsername });
</script>
