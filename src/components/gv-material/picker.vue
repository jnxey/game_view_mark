<template>
  <div class="material-select" :class="customClass" @click.stop>
    <div v-if="!hiddenUpload" class="material-select__trigger flex-row align-center flex-wrap" @click.stop>
      <draggable class="draggable flex-row align-center flex-wrap" v-model="fileList" animation="300" :item-key="(v) => v">
        <template v-slot:item="{ element, index }">
          <div class="material-preview" :class="{ 'is-disabled': disabled, 'is-one': isOne }" @click="showPopup(index)" :style="boxStyle">
            <gv-del-wrap @close="deleteImg(index)" :style="boxStyle">
              <file-item :uri="element" :file-size="size" :width="width" :height="height" :type="type" />
            </gv-del-wrap>
            <div v-if="showBottomBtn" class="operation-btns fz-12 text-center">
              <span>{{ $t('components.gv_material.picker_modify') }}</span>
              |
              <span @click.stop="handlePreview(element)">{{ $t('components.gv_material.picker_view') }}</span>
            </div>
            <gv-icon
              v-if="!isOne && thumbtack"
              class="top-up fz-14"
              :class="{ active: !index }"
              name="local-icon-top-up"
              @click.stop="setTopUp(index)"
            />
          </div>
        </template>
      </draggable>
      <div
        class="material-upload"
        @click="showPopup(-1)"
        v-show="showUpload"
        :class="{ 'is-disabled': disabled, 'is-one': isOne, [uploadClass]: true }"
      >
        <slot name="upload">
          <div class="upload-btn flex-col align-center justify-center" :style="boxStyle">
            <gv-icon :size="25" name="el-icon-Plus" />
            <span class="fz-12">{{ $t('components.gv_material.picker_add') }}</span>
          </div>
        </slot>
      </div>
    </div>
  </div>
  <gv-popup ref="popupRef" width="1050px" custom-class="body-padding" :title="tipsText" @confirm="handleConfirm" @close="handleClose">
    <el-scrollbar>
      <div class="material-wrap">
        <material ref="materialRef" :type="type" :file-size="fileSize" :limit="meterialLimit" @change="selectChange" />
      </div>
    </el-scrollbar>
  </gv-popup>
  <preview v-model="showPreview" :url="previewUrl" :type="type" />
</template>

<script>
import { useThrottleFn } from '@vueuse/core';
import Draggable from 'vuedraggable';
import FileItem from './file.vue';
import Material from './index.vue';
import Preview from './preview.vue';
import GvPopup from '@/components/gv-popup/index.vue';
import GvDelWrap from '@/components/gv-del-wrap/index.vue';
import GvIcon from '@/components/gv-icon/index.vue';
import { computed, nextTick, provide, ref, toRefs, watch } from 'vue';
import { getFileImageUrl } from '@/tools';
import { $t } from '@/lang/i18n';

export default {
  name: 'gv-material-picker',
  methods: { $t },
  components: { GvIcon, GvDelWrap, GvPopup, Draggable, FileItem, Material, Preview },
  props: {
    modelValue: { type: [String, Array], default: () => [] },
    // 文件类型
    type: { type: String, default: 'image' },
    // 选择器尺寸
    size: { type: String, default: '100px' },
    // 选择器尺寸-宽度（不传则是使用size
    width: { type: String, default: '' },
    // 选择器尺寸-高度（不传则是使用size
    height: { type: String, default: '' },
    // 文件尺寸
    fileSize: { type: String, default: '100px' },
    // 选择数量限制
    limit: { type: Number, default: 1 },
    // 禁用选择
    disabled: { type: Boolean, default: false },
    // 隐藏上传框*(目前在富文本中使用到)
    hiddenUpload: { type: Boolean, default: false },
    // 上传样式
    uploadClass: { type: String, default: '' },
    // 外层样式
    customClass: { type: String, default: '' },
    // 显示置顶图钉
    thumbtack: { type: Boolean, default: true },
    // 显示底部操作按钮
    showBottomBtn: { type: Boolean, default: true }
  },

  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    const popupRef = ref();
    const materialRef = ref();
    const previewUrl = ref('');
    const showPreview = ref(false);
    const fileList = ref([]);
    const select = ref([]);
    const isAdd = ref(true);
    const currentIndex = ref(-1);
    const { disabled, limit, modelValue } = toRefs(props);
    const boxStyle = { width: props.width || props.size, height: props.height || props.size };

    const isOne = computed(() => limit.value === 1);

    const tipsText = computed(() => {
      switch (props.type) {
        case 'image':
          return $t('components.gv_material.picker_image');
        case 'video':
          return $t('components.gv_material.picker_video');
        default:
          return '';
      }
    });

    const showUpload = computed(() => {
      return props.limit - fileList.value.length > 0;
    });

    const meterialLimit = computed(() => {
      if (!isAdd.value) return 1;

      if (limit.value === -1) return null;
      return limit.value - fileList.value.length;
    });

    const handleConfirm = useThrottleFn(
      () => {
        const selectUri = select.value.map((item) => getFileImageUrl(item));
        if (!isAdd.value) {
          fileList.value.splice(currentIndex.value, 1, selectUri.shift());
        } else {
          fileList.value = [...fileList.value, ...selectUri];
        }
        handleChange();
        popupRef.value?.close();
      },
      1000,
      false
    );

    const showPopup = (index) => {
      if (disabled.value) return;
      if (index >= 0) {
        isAdd.value = false;
        currentIndex.value = index;
      } else {
        isAdd.value = true;
      }
      popupRef.value?.open();
    };

    const selectChange = (val) => {
      select.value = val;
    };
    const handleChange = () => {
      const valueImg = !isOne.value ? fileList.value : fileList.value[0] || '';
      emit('update:modelValue', valueImg);
      emit('change', valueImg);
      handleClose();
    };

    const deleteImg = (index) => {
      fileList.value.splice(index, 1);
      handleChange();
    };

    const handlePreview = (url) => {
      previewUrl.value = url;
      showPreview.value = true;
    };

    const handleClose = () => {
      nextTick(() => {
        if (props.hiddenUpload) fileList.value = [];
        materialRef.value?.clearSelect();
      });
    };

    // 置顶
    const setTopUp = (index) => {
      if (!index) return;
      const list = [...fileList.value];
      const item = list[index];
      list.splice(index, 1);
      list.unshift(item);
      fileList.value = list;
      handleChange();
    };

    watch(
      modelValue,
      (val) => {
        fileList.value = Array.isArray(val) ? val : val === '' ? [] : [val];
      },
      {
        immediate: true
      }
    );
    provide('limit', props.limit);
    provide('hiddenUpload', props.hiddenUpload);
    return {
      popupRef,
      materialRef,
      fileList,
      tipsText,
      handleConfirm,
      meterialLimit,
      showUpload,
      boxStyle,
      isOne,
      setTopUp,
      showPopup,
      selectChange,
      deleteImg,
      previewUrl,
      showPreview,
      handlePreview,
      handleClose
    };
  }
};
</script>

<style scoped lang="scss">
.material-select {
  .material-upload,
  .material-preview {
    position: relative;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 8px;
    margin-bottom: 8px;
    box-sizing: border-box;
    &.is-disabled {
      cursor: not-allowed;
    }
    &.is-one {
      margin-bottom: 0;
    }
    &:hover {
      .operation-btns {
        display: block;
      }
    }
    .operation-btns {
      display: none;
      position: absolute;
      bottom: 0;
      border-radius: 4px;
      width: 100%;
      line-height: 2;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.3);
    }

    .top-up {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      color: var(--el-text-color-placeholder);

      &:hover {
        color: var(--el-color-primary-light-5);
      }

      &.active {
        display: block;
        color: var(--el-color-primary);
      }
    }

    &:hover .top-up {
      display: block;
    }
  }
  .material-upload {
    .upload-btn {
      border: 1px dashed var(--el-border-color);
      color: var(--el-text-color-placeholder);
    }
  }
}
.material-wrap {
  min-width: 720px;
  height: 560px;
}
</style>
