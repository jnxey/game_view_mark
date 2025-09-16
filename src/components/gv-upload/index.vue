<template>
  <div class="upload">
    <el-upload
      v-model:file-list="fileList"
      ref="uploadRefs"
      :action="action"
      :multiple="multiple"
      :limit="limit"
      :show-file-list="false"
      :headers="headers"
      :data="{ ...extend, ...data }"
      :before-upload="handleBefore"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :accept="getAccept"
    >
      <slot />
    </el-upload>
    <el-dialog
      v-if="showProgress && fileList.length"
      v-model="visible"
      :title="$t('components.gv_upload.tips_process')"
      :close-on-click-modal="false"
      width="500px"
      :modal="false"
      @close="handleClose"
    >
      <div class="file-list p-4">
        <template v-for="(item, index) in fileList" :key="index">
          <div class="mb-5">
            <div>{{ item.name }}</div>
            <div class="flex-1">
              <el-progress :percentage="parseInt(item.percentage)" />
            </div>
          </div>
        </template>
      </div>
    </el-dialog>
    <gv-cropper ref="cropperRef" />
  </div>
</template>

<script>
import { computed, nextTick, reactive, ref, shallowRef } from 'vue';

import { config } from '@/config';
import { storage } from '@/tools/storage.js';
import { CACHE_KEY_TOKEN } from '@/values/cache.js';
import { RESPONSE_CODE } from '@/values';
import layer from '@/tools/layer.js';
import { execImageAnalyse } from '@/tools/image-analyse';
import qs from 'qs';
import { $t } from '@/lang/i18n';
import GvCropper from '@/components/gv-cropper/index.vue';
import { fileToBase64, generateUUID } from '@/tools';

export default {
  name: 'gv-upload',
  methods: { $t },
  components: { GvCropper },
  props: {
    // 上传文件类型
    type: { type: String, default: 'image' },
    // 是否支持多选
    multiple: { type: Boolean, default: true },
    // 多选时最多选择几条
    limit: { type: Number, default: 10 },
    // 上传时的额外参数
    data: { type: Object, default: () => ({}) },
    // 是否显示上传进度
    showProgress: { type: Boolean, default: false },
    // 裁剪配置
    cropperOptions: Object
  },
  emits: ['change', 'error', 'success', 'allSuccess'],
  setup(props, { emit }) {
    const uploadRefs = shallowRef();
    const cropperRef = shallowRef();
    const cacheUIDClip = {};
    const action = ref(`${config.baseURL}/upload/${props.type}`);
    const headers = computed(() => ({
      token: storage.get(CACHE_KEY_TOKEN),
      version: config.version
    }));
    const visible = ref(false);
    const fileList = ref([]);
    const extend = reactive({});

    const handleBefore = async (file) => {
      if (props.type === 'image') {
        return new Promise((resolve) => {
          console.log(file, '----------------------000');
          if (!!cacheUIDClip[file.UUID] || !props.cropperOptions) {
            execImageAnalyse(file, (info) => {
              extend['detail'] = qs.stringify(info ?? {});
              resolve(true);
            });
          } else {
            fileToBase64(file).then(({ base64 }) => {
              const opts = props.cropperOptions ?? {};
              cropperRef.value?.show(
                { img: base64, ...opts },
                (raw) => {
                  resolve(false);
                  nextTick(() => {
                    raw.UUID = generateUUID();
                    cacheUIDClip[raw.UUID] = true;
                    uploadRefs.value?.handleRemove(file);
                    uploadRefs.value?.handleStart(raw);
                    uploadRefs.value?.submit();
                    console.log(raw, '----------------1111');
                  });
                },
                () => {
                  resolve(false);
                }
              );
            });
          }
        });
      } else {
        return true;
      }
    };

    const handleProgress = () => {
      visible.value = true;
    };
    let uploadLen = 0;
    const handleSuccess = (response, file) => {
      uploadLen++;
      if (uploadLen === fileList.value.length) {
        uploadLen = 0;
        fileList.value = [];
        emit('allSuccess');
      }
      emit('change', file);
      if (response.code === RESPONSE_CODE.SUCCESS) {
        emit('success', response);
      }
      if (response.code === RESPONSE_CODE.FAIL && response.msg) {
        layer.msgError(response.msg);
      }
    };
    const handleError = (event, file) => {
      uploadLen++;
      if (uploadLen === fileList.value.length) {
        uploadLen = 0;
        fileList.value = [];
        emit('allSuccess');
      }
      layer.msgError($t('components.gv_upload.tips_fail', { name: file.name }));
      uploadRefs.value?.abort(file);
      visible.value = false;
      emit('change', file);
      emit('error', file);
    };
    const handleExceed = () => {
      layer.msgError($t('components.gv_upload.tips_limit', { limit: props.limit }));
    };
    const handleClose = () => {
      fileList.value = [];
      visible.value = false;
    };

    const getAccept = computed(() => {
      switch (props.type) {
        case 'image':
          return 'image/*';
        case 'video':
          return '.wmv,.avi,.mpg,.mpeg,.3gp,.mov,.mp4,.flv,.rmvb,.mkv';
        default:
          return '*';
      }
    });
    return {
      uploadRefs,
      action,
      headers,
      visible,
      fileList,
      getAccept,
      extend,
      cropperRef,
      handleBefore,
      handleProgress,
      handleSuccess,
      handleError,
      handleExceed,
      handleClose
    };
  }
};
</script>

<style lang="scss"></style>
