<template>
  <div class="emoji-input-container">
    <div class="input-area flex-row mb-12">
      <!--   编辑器   -->
      <iframe ref="editorRef" class="editor-iframe" name="rich-edit" frameborder="0"></iframe>
    </div>
    <div class="button-wrap flex-row align-center">
      <!--   @   -->
      <div class="bandler-btn" @click="openSelectAdmin">
        <gv-icon name="local-icon-mark-others" />
      </div>
      <!--   emoji表情   -->
      <el-popover ref="emojiPopupRef" :title="$t('layout.chat_emoji')" trigger="click" placement="top" width="400px">
        <template #reference>
          <div class="bandler-btn ml-8">
            <gv-icon name="local-icon-emoji-icon" />
          </div>
        </template>
        <template #default>
          <div class="emoji-wrap flex-row align-center justify-center flex-wrap">
            <template v-for="i in 45" :key="i">
              <img
                alt=""
                class="emoji-icon cursor-pointer m-4"
                :src="`/images-extend/emoji/emoji-${i}.png`"
                @click="insertEmoji(`/images-extend/emoji/emoji-${i}.png`)"
              />
            </template>
          </div>
        </template>
      </el-popover>
      <!--   图片   -->
      <gv-upload :data="{ cid: -1 }" type="image" :show-progress="true" @success="(res) => sendFiles('image', res)">
        <div class="bandler-btn ml-8">
          <gv-icon name="local-icon-image" />
        </div>
      </gv-upload>
      <!--  文件    -->
      <gv-upload :data="{ cid: -1 }" type="file" :show-progress="true" @success="(res) => sendFiles('file', res)">
        <div class="bandler-btn ml-8">
          <gv-icon name="local-icon-files-2" />
        </div>
      </gv-upload>
      <button class="send-button w-120" @click="sendMessage" :disabled="isLoading">
        {{ $t('common.send') }}
      </button>
    </div>
    <gv-select-admin ref="selectAdminRef" @success="insertMark" />
  </div>
</template>

<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';
import { toolsChatSendMessage } from '@/api/common';
import { delayExec, toAwait } from '@/tools';
import GvUpload from '@/components/gv-upload/index.vue';
import GvSelectAdmin from '@/components/gv-select-admin/index.vue';
import DOMPurify from 'dompurify';

const emits = defineEmits(['closeQuote']);
const props = defineProps({ quote: Object });

const editorRef = shallowRef();
const emojiPopupRef = shallowRef();
const filePopupRef = shallowRef();
const selectAdminRef = shallowRef();
const isLoading = ref(false);

// 初始化编辑器
const initEditor = () => {
  const editor = editorRef.value;
  const iframeDoc = editor.contentDocument || editor.contentWindow.document;
  const computedStyles = window.getComputedStyle(document.documentElement);
  iframeDoc.open();
  // 提取 背景色
  const bgColor = computedStyles.getPropertyValue('--el-bg-color');
  // 提取 字体色
  const fontColor = computedStyles.getPropertyValue('--el-text-color-primary');
  const style = `body {box-sizing:border-box;margin:0;padding:10px;min-height:100vh;outline:none;line-height:36px;font-size:16px;color:${fontColor};background-color:${bgColor};}img{width:24px;height:24px;margin:0 2px;vertical-align:middle;}`;
  iframeDoc.write(`<!DOCTYPE html><html><head><style>${style}</style></head><body contenteditable="true"></body></html>`);
  iframeDoc.close();
  // 启用设计模式（关键步骤）
  iframeDoc.designMode = 'on';
  iframeDoc.addEventListener('paste', (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    // 优先获取 HTML 格式，否则降级为纯文本
    const htmlContent = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
    insertHtml(htmlContent); // 后续处理
  });
};

// 插入表情
const insertEmoji = async (src) => {
  const editor = editorRef.value;
  const iframeDoc = editor.contentDocument || editor.contentWindow.document;
  const selection = iframeDoc.getSelection();
  if (!selection.focusOffset) {
    // 还未有选区
    iframeDoc.body.focus();
    await delayExec(100);
  }
  iframeDoc.execCommand('insertImage', false, src);
  emojiPopupRef.value?.hide();
  await delayExec(300);
  iframeDoc.body.focus();
};

// 点击@
const openSelectAdmin = () => {
  selectAdminRef.value?.open();
};

// 插入@
const insertMark = async (row) => {
  const editor = editorRef.value;
  const iframeDoc = editor.contentDocument || editor.contentWindow.document;
  const selection = iframeDoc.getSelection();
  if (!selection.focusOffset) {
    // 还未有选区
    iframeDoc.body.focus();
    await delayExec(100);
  }
  iframeDoc.execCommand('insertText', false, ' ');
  iframeDoc.execCommand('insertHtml', false, `<span style="color:#409eff;">@${row.account}</span>\u200B`);
  iframeDoc.execCommand('insertText', false, ' ');
  await delayExec(300);
  iframeDoc.body.focus();
};

// 插入@
const insertHtml = async (html) => {
  const htmlString = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['span', 'img'], // 允许的基础标签
    ALLOWED_ATTR: ['src', 'style', 'alt'], // 允许的属性
    FORBID_TAGS: ['script', 'iframe', 'object'] // 显式禁止危险标签
  });
  const editor = editorRef.value;
  const iframeDoc = editor.contentDocument || editor.contentWindow.document;
  iframeDoc.execCommand('insertHtml', false, htmlString);
  await delayExec(300);
  iframeDoc.body.focus();
};

// 发送消息
const sendMessage = async () => {
  const editor = editorRef.value;
  const iframeDoc = editor.contentDocument || editor.contentWindow.document;
  const inputValue = iframeDoc.body.innerHTML;
  const quote = !!props.quote ? { quote_message_id: props.quote.id } : {};
  if (!inputValue) return;
  const params = {
    message_type: 'text',
    content: inputValue,
    ...quote
  };
  isLoading.value = true;
  const [res] = await toAwait(toolsChatSendMessage(params));
  isLoading.value = false;
  emits('closeQuote');
  if (!!res) iframeDoc.body.innerHTML = '';
};

// 上传文件
const sendFiles = async (type, res) => {
  const params = { message_type: type, content: '', file_info: [`${res.data.uri}?name=${res.data.name}&size=${res.data.file_size}`] };
  isLoading.value = true;
  await toAwait(toolsChatSendMessage(params));
  isLoading.value = false;
  filePopupRef.value?.hide();
};

onMounted(() => {
  initEditor();
});
</script>

<style scoped lang="scss">
.emoji-input-container {
  position: relative;

  .input-area {
    border-radius: 8px;
    border: 1px solid var(--el-border-color);
    overflow: hidden;

    .editor-iframe {
      width: 100%;
      height: 80px;
      border: none;
      overflow: hidden auto;
    }

    .input-div {
      height: 80px;
      padding: 10px;
      outline: none;
      line-height: 24px;
      word-break: break-all;
      white-space: wrap;
      overflow-wrap: break-word;
      overflow: hidden auto;
      vertical-align: middle;
    }
  }

  .emoji-picker-wrapper {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 10px;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    overflow: hidden;
  }
}

.button-wrap {
  position: relative;

  .bandler-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 20px;
    color: var(--el-text-color);
    cursor: pointer;
    border-radius: var(--gv-border-radius-mid);

    &:hover {
      background-color: var(--el-fill-color-dark);
    }
  }

  .send-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px;
    cursor: pointer;
    font-size: 16px;
    outline: none;
    border: none;
    border-radius: var(--gv-border-radius-mid);
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-7);
    transition: background 0.2s;

    &:hover {
      color: var(--el-primary-text-color);
      background-color: var(--el-color-primary);
    }
  }
}

.emoji-wrap {
  max-height: 600px;
  overflow-y: auto;

  .emoji-icon {
    width: 32px;
    height: 32px;
  }
}
</style>
