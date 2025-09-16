<template>
  <gv-popup ref="popupRef" :title="$t('components.gv_cropper.title')" @confirm="confirm" @close="close" :width="getPX(options.wrapWidth)">
    <div v-if="options.img" class="al-cropper-wrap" :style="{ height: getPX(options.wrapHeight) }">
      <VueCropper
        ref="cropper"
        :img="options.img"
        :output-size="options.size"
        :output-type="options.outputType"
        :info="true"
        :full="options.full"
        :fixed="options.fixed"
        :fixed-number="options.fixedNumber"
        :can-move="options.canMove"
        :can-move-box="options.canMoveBox"
        :fixed-box="options.fixedBox"
        :original="options.original"
        :auto-crop="options.autoCrop"
        :auto-crop-width="options.autoCropWidth"
        :auto-crop-height="options.autoCropHeight"
        :center-box="options.centerBox"
        :high="options.high"
        :max-img-size="options.max"
        mode="cover"
      />
    </div>
  </gv-popup>
</template>
<script>
export default { name: 'gv-cropper' };
</script>
<script setup>
import VueCropper from 'vue-cropper/lib/vue-cropper.vue';
import { ref, reactive } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import { getPX, syncObjectData } from '@/tools';
import { $t } from '@/lang/i18n';

const popupRef = ref(null);
const cropper = ref(null);

const options = reactive({
  img: '',
  size: 1,
  full: false,
  outputType: 'png',
  canScale: true,
  canMove: true,
  canMoveBox: true,
  fixedBox: false,
  original: false,
  autoCrop: true,
  autoCropWidth: 256,
  autoCropHeight: 256,
  centerBox: false,
  high: false,
  max: 99999,
  fixed: false,
  wrapWidth: 600,
  wrapHeight: 400,
  fixedNumber: [1, 1]
});

const cacheCallback = { fn: null, close: null };

const show = (opts, callback, closeCallback) => {
  syncObjectData(options, { ...opts });
  popupRef.value?.open();
  cacheCallback.fn = callback;
  cacheCallback.close = closeCallback;
};

const close = () => {
  options.img = '';
  if (!!cacheCallback.close) cacheCallback.close();
  cacheCallback.fn = null;
  cacheCallback.close = null;
};

const confirm = () => {
  cropper.value?.getCropBlob((data) => {
    const file = new File([data], `crop_${Date.now()}.${options.outputType}`, { type: `image/${options.outputType}`, lastModified: Date.now() });
    if (!!cacheCallback.fn) cacheCallback.fn(file);
    popupRef.value?.close();
  });
};

defineExpose({ show, confirm });
</script>

<style lang="scss" scoped>
.al-cropper-wrap {
  width: 100%;
}
</style>
