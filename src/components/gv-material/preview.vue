<template>
  <div v-show="modelValue">
    <div v-if="type === 'image'">
      <el-image-viewer v-if="previewLists.length" :url-list="previewLists" hide-on-click-modal @close="handleClose" />
    </div>
    <div v-if="type === 'video'">
      <el-dialog v-model="visible" width="740px" :title="$t('components.gv_material.preview_video')" :before-close="handleClose">
        <gv-video-player ref="playerRef" :src="getBaseImagUrl(url)" width="100%" height="450px" />
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import GvVideoPlayer from '@/components/gv-video-player/index.vue';
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import { getBaseImagUrl } from '@/tools';
import { $t } from '@/lang/i18n';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  url: { type: String, default: '' },
  type: { type: String, default: 'image' }
});
const emit = defineEmits(['update:modelValue']);

const playerRef = shallowRef();

const visible = computed({
  get() {
    return props.modelValue;
  },

  set(value) {
    emit('update:modelValue', value);
  }
});

const handleClose = () => {
  emit('update:modelValue', false);
};

const previewLists = ref([]);

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      nextTick(() => {
        previewLists.value = [getBaseImagUrl(props.url)];
        playerRef.value?.play();
      });
    } else {
      nextTick(() => {
        previewLists.value = [];
        playerRef.value?.pause();
      });
    }
  }
);
</script>
