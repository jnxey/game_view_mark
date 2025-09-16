import { computed } from 'vue';
import { LAYOUT_MENU_WIDTH, LAYOUT_MENU_WIDTH_COLLAPSE } from '@/values';
import { getPX } from '@/tools/index.js';
import { setSystemState, systemState } from '@/store/system.js';

export const menuCollapseWidth = computed(() => {
  if (!systemState.menuCollapse) {
    return getPX(LAYOUT_MENU_WIDTH);
  } else {
    return getPX(LAYOUT_MENU_WIDTH_COLLAPSE);
  }
});

export const toggleCollapseState = () => {
  setSystemState({ menuCollapse: !systemState.menuCollapse });
};
