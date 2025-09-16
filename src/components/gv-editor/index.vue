<template>
  <div class="border border-br flex flex-col" :style="styles">
    <toolbar class="border-b border-br" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <w-editor class="flex-1 overflow-hidden" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
    <gv-material-picker ref="materialPickerRef" :type="fileType" :limit="-1" hidden-upload @change="selectChange" />
  </div>
</template>
<script>
export default { name: 'gv-editor' };
</script>
<script setup>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor as WEditor, Toolbar } from '@wangeditor/editor-for-vue';

import GvMaterialPicker from '@/components/gv-material/picker.vue';
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue';
import { getPX } from '@/tools/index.js';

const props = defineProps({
  modelValue: { type: String, default: '' },
  mode: { type: String, default: 'default' },
  height: { type: String, default: '100%' },
  width: { type: String, default: 'auto' },
  toolbarConfig: { type: String, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue']);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const materialPickerRef = shallowRef();
const fileType = ref('');

let insertFn;

const editorConfig = {
  MENU_CONF: {
    uploadImage: {
      customBrowseAndUpload(insert) {
        fileType.value = 'image';
        materialPickerRef.value?.showPopup(-1);
        insertFn = insert;
      }
    },
    uploadVideo: {
      customBrowseAndUpload(insert) {
        fileType.value = 'video';
        materialPickerRef.value?.showPopup(-1);
        insertFn = insert;
      }
    }
  }
};

const styles = computed(() => ({
  height: getPX(props.height),
  width: getPX(props.width)
}));
const valueHtml = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const selectChange = (fileUrl) => {
  fileUrl.forEach((url) => insertFn(url));
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<style lang="scss">
.w-e-full-screen-container {
  z-index: 999;
}
.w-e-text-container [data-slate-editor] ul {
  list-style: disc;
}
.w-e-text-container [data-slate-editor] ol {
  list-style: decimal;
}
h1 {
  font-size: 2em;
}
h2 {
  font-size: 1.5em;
}
h3 {
  font-size: 1.17em;
}
h4 {
  font-size: 1em;
}
h5 {
  font-size: 0.83em;
}
h1,
h2,
h3,
h4,
h5 {
  font-weight: bold;
}
</style>
