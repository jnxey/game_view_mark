<template>
  <el-input v-trim v-model="content" :class="customClass" :placeholder="placeholder" :readonly="isI18n" :clearable="clearable">
    <template #append>
      <el-button @click="selectInputLanguage">
        <template #icon><gv-icon name="local-icon-language" /></template>
      </el-button>
    </template>
  </el-input>
  <gv-popup ref="popupRef" :title="$t('components.gv_input_language.title')" :async="true" width="600px" :show-footer="false">
    <gv-tips class="mb-8" :title="$t('components.gv_input_language.tips_dbclick')" cache-key="gv-input-language-tips" />
    <div class="flex-row align-top pb-16">
      <div class="flex-1">
        <template v-for="item in languageList">
          <el-tag
            size="large"
            class="code-tag cursor-pointer mr-8 mb-4"
            :effect="current.code === item.code ? 'dark' : null"
            @click="editInputLanguage(item)"
            @dblclick="handlerSelected(item.code)"
          >
            {{ $ti(item.code) }}
          </el-tag>
        </template>
        <el-tag
          size="large"
          class="code-tag cursor-pointer mr-8 mb-4"
          :effect="current.mode === OPERATE_TYPE.insert ? 'dark' : null"
          @click="addInputLanguage"
        >
          <gv-icon name="el-icon-plus" />
        </el-tag>
        <el-tag size="large" class="code-tag cursor-pointer mb-4" type="danger" @click="delInputLanguage">
          <gv-icon name="el-icon-delete" />
        </el-tag>
      </div>
      <div class="flex-1">
        <edit-panel ref="editPanelRef" @success="saveSuccess" @close="clearEditPanel" @selected="handlerSelected" />
      </div>
    </div>
  </gv-popup>
</template>
<script>
export default { name: 'gv-input-language' };
</script>
<script setup>
import { computed, nextTick, ref, shallowRef, unref } from 'vue';
import { generateRandomString, getJSON, isEmpty, isString } from '@/tools';
import GvIcon from '@/components/gv-icon/index.vue';
import GvPopup from '@/components/gv-popup/index.vue';
import EditPanel from './_components/edit.vue';
import { $ti, initInputLanguage, inputLanguage, inputLanguageMap, inputLanguageMark } from '@/lang/input';
import { $t } from '@/lang/i18n';
import { OPERATE_TYPE, QUERY_LIST_MAX_NUMBER } from '@/values';
import GvTips from '@/components/gv-tips/index.vue';
import layer from '@/tools/layer';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  customClass: { type: String, default: '' },
  type: Number,
  clearable: { type: Boolean, default: false }
});

const popupRef = shallowRef();
const editPanelRef = shallowRef();

const current = ref({});

const isI18n = computed(() => {
  return isString(props.modelValue) && !props.modelValue.indexOf(inputLanguageMark);
});

const content = computed({
  get: () => {
    if (isI18n.value) {
      return $ti(props.modelValue);
    } else {
      if (isEmpty(props.modelValue)) return '';
      else return props.modelValue;
    }
  },
  set: (value) => {
    if (isEmpty(value)) emit('update:modelValue', '');
    else emit('update:modelValue', value);
  }
});

// 当前类型的语言列表
const languageList = computed(() => {
  return inputLanguage.filter((val) => val.type === props.type);
});

// 刷新语言列表
const saveSuccess = async () => {
  if (current.value.mode === OPERATE_TYPE.insert) editInputLanguage(inputLanguageMap.value[current.value.code]);
};

// 选择输入语言
const selectInputLanguage = async () => {
  popupRef.value?.open();
  await nextTick();
  clearEditPanel();
  if (isI18n.value) editInputLanguage(inputLanguageMap.value[props.modelValue]);
};

// 新增词条
const addInputLanguage = () => {
  if (inputLanguage.length >= QUERY_LIST_MAX_NUMBER) return layer.msgError($t('components.gv_input_language.tips_max_length'));
  if (current.value.mode === OPERATE_TYPE.insert) {
    clearEditPanel();
  } else {
    current.value = {
      mode: OPERATE_TYPE.insert,
      type: props.type,
      code: `${inputLanguageMark}T${props.type}.${Date.now()}${generateRandomString(4)}`
    };
    editPanelRef.value?.set(unref(current));
  }
};

// 编辑词条
const editInputLanguage = (row) => {
  const content = getJSON(row.content, {});
  current.value = { mode: OPERATE_TYPE.update, id: row.id, type: props.type, code: row.code, ...content };
  editPanelRef.value?.set(unref(current));
};

// 删除国际化
const delInputLanguage = () => {
  emit('update:modelValue', '');
  popupRef.value?.close();
};

// 清除编辑框
const clearEditPanel = () => {
  current.value = { mode: null };
  editPanelRef.value?.set(unref(current));
};

// 选中词条
const handlerSelected = (code) => {
  emit('update:modelValue', code);
  popupRef.value?.close();
};
</script>
<style scoped lang="scss">
.code-tag {
  user-select: none;
}
</style>
