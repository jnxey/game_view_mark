import { computed, ref } from 'vue';
import { getPX, getWindowSize, syncObjectData } from '@/tools';
import { storage } from '@/tools/storage';
import { CACHE_SCENE_ENTER_DIALOG_SHOW } from '@/values/cache';

const memoryValue = storage.get(CACHE_SCENE_ENTER_DIALOG_SHOW) ?? {};

const leftWidth = 300;
const rightWidth = 300;
const paddingSize = 15;

const transition = { transition: 'all 0.3s linear' };

export const defaultTopShow = true;
export const defaultLeftShow = getWindowSize().width >= 1600;
export const defaultRightShow = getWindowSize().width >= 1000;
export const hideRightButton = getWindowSize().width >= 13600;

// 同步缓存
function setMemoryValue(obj) {
  Object.keys(obj).forEach((p) => (memoryValue[p] = obj[p]));
  storage.set(CACHE_SCENE_ENTER_DIALOG_SHOW, memoryValue);
}

/*************************************** left ***************************************/
export const panelLeftShow = ref(memoryValue.left ?? defaultLeftShow);

export const panelLeftStyle = computed(() => {
  if (panelLeftShow.value) {
    return { width: getPX(leftWidth), left: getPX(paddingSize), zIndex: defaultLeftShow ? 10 : 20, opacity: 1, ...transition };
  } else {
    return { width: getPX(leftWidth), left: getPX(leftWidth * -1.5), opacity: 0, ...transition };
  }
});

export const togglePanelLeft = (status) => {
  if (status === true) panelLeftShow.value = true;
  else if (status === false) panelLeftShow.value = false;
  else panelLeftShow.value = !panelLeftShow.value;
  setMemoryValue({ left: panelLeftShow.value });
};

/*************************************** right ***************************************/
export const panelRightShow = ref(hideRightButton ? true : (memoryValue.right ?? defaultRightShow));

export const panelRightStyle = computed(() => {
  if (panelRightShow.value) {
    return { width: getPX(rightWidth), right: getPX(paddingSize), zIndex: defaultRightShow ? 10 : 20, opacity: 1, ...transition };
  } else {
    return { width: getPX(rightWidth), right: getPX(rightWidth * -1.5), opacity: 0, ...transition };
  }
});

export const togglePanelRight = () => {
  panelRightShow.value = !panelRightShow.value;
  setMemoryValue({ right: panelRightShow.value });
};

/*************************************** content-top ***************************************/
export const panelContentTop = ref(memoryValue.top ?? defaultTopShow);

export const togglePanelTop = () => {
  panelContentTop.value = !panelContentTop.value;
  setMemoryValue({ top: panelContentTop.value });
};

export const panelContentTopStyle = computed(() => {
  if (panelContentTop.value) {
    return { maxHeight: getPX(400), opacity: 1, ...transition };
  } else {
    return { maxHeight: getPX(0), opacity: 0, ...transition, marginBottom: 0 };
  }
});

/*************************************** content ***************************************/
export const panelContentStyle = computed(() => {
  const left = panelLeftShow.value && defaultLeftShow ? { left: getPX(paddingSize * 2 + leftWidth) } : { left: getPX(paddingSize) };
  const right = panelRightShow.value && defaultRightShow ? { right: getPX(paddingSize * 2 + rightWidth) } : { right: getPX(paddingSize) };
  return { ...left, ...right, ...transition };
});

// 是否显示mark
export const panelShowMark = computed(() => {
  return (!defaultRightShow && panelRightShow.value) || (!defaultLeftShow && panelLeftShow.value);
});
