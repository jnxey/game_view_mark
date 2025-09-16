import { ref } from 'vue';
import { isArray } from '@/tools';

export const imagePreviewStatus = ref(false);
export const imagePreviewList = ref([]);
export const imagePreviewIndex = ref(0);

export const imagePreviewOpen = (list, index = 0) => {
  if (isArray(list) && !!list[0]) {
    imagePreviewList.value = list ?? [];
    imagePreviewIndex.value = index;
    imagePreviewStatus.value = true;
  }
};

export const imagePreviewClose = () => {
  imagePreviewStatus.value = false;
  imagePreviewList.value = [];
  imagePreviewIndex.value = 0;
};
