<template>
  <el-tooltip :content="$t('layout.tips_setting')" placement="bottom">
    <div class="header-fullscreen header-item text-main cursor-pointer" @click="openDrawer">
      <gv-icon name="el-icon-setting" />
    </div>
  </el-tooltip>
  <el-drawer v-model="visible" :title="$t('layout.page_setting')" size="360px" direction="rtl">
    <el-form label-width="120px" label-position="left">
      <el-form-item :label="$t('layout.menu_collapse')">
        <el-switch :model-value="systemState.menuCollapse" @click="changeCollapse" />
      </el-form-item>
      <!--      <el-form-item label="虚拟键盘">-->
      <!--        <el-switch :model-value="systemState.keyboard" @click="changeKeyboard" />-->
      <!--      </el-form-item>-->
      <el-form-item :label="$t('layout.skin_model')">
        <template v-for="(item, index) in LAYOUT_SKIN_TYPE_DICT" :key="index">
          <el-tooltip :content="item.name" placement="bottom">
            <div
              class="skin-box flex-row align-center cursor-pointer mr-8"
              :style="{ backgroundColor: item.bgColor }"
              :class="{ select: systemState.skinType === item.value }"
              @click="changeSkinType(item)"
            >
              <div class="skin-split" />
            </div>
          </el-tooltip>
        </template>
      </el-form-item>
      <el-form-item :label="$t('layout.skin_color')">
        <template v-for="(item, index) in LAYOUT_SKIN_COLOR_DICT" :key="index">
          <el-tooltip :content="item.name" placement="bottom">
            <div
              class="skin-box small flex-row align-center cursor-pointer mr-8"
              :style="{ backgroundColor: item.color }"
              :class="{ select: systemState.skinColor === item.value }"
              @click="changeSkinColor(item)"
            />
          </el-tooltip>
        </template>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';
import { ref } from 'vue';
import { setSystemState, systemState } from '@/store/system';
import { LAYOUT_SKIN_COLOR_DICT, LAYOUT_SKIN_TYPE_DICT } from '@/values';
import { $t } from '@/lang/i18n';

const visible = ref(false);

const openDrawer = () => {
  visible.value = true;
};

const changeCollapse = () => {
  setSystemState({ menuCollapse: !systemState.menuCollapse });
};

const changeKeyboard = () => {
  setSystemState({ keyboard: !systemState.keyboard });
};

const changeSkinType = (item) => {
  setSystemState({ skinType: item.value });
};

const changeSkinColor = (item) => {
  setSystemState({ skinColor: item.value });
};
</script>
<style scoped lang="scss">
@use '../_style/index.scss';

.skin-box {
  position: relative;
  width: 40px;
  height: 20px;
  border: 2px solid var(--el-border-color);

  &.small {
    width: 30px;
    height: 15px;
    &.select {
      box-shadow: inset 0 0 0 1px #ffffff;
    }
  }

  &.select {
    border-color: var(--el-color-primary-light-5);
    &:after {
      display: none;
    }
  }
  .skin-split {
    position: absolute;
    top: 0;
    left: 10px;
    width: 2px;
    height: 100%;
    background-color: var(--el-color-primary);
  }
}
</style>
