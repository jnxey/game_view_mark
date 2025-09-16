<template>
  <div class="desk-header mb-12">
    <el-page-header :content="$t(query.title, query)" @back="backTab($router)">
      <template #extra>
        <el-dropdown trigger="click">
          <el-button>{{ $t('bonus.desk.import_temp') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item class="w-160 justify-center" @click="importDefTemp3">{{ $t('bonus.desk.temp_def_3') }}</el-dropdown-item>
              <el-dropdown-item class="w-160 justify-center" @click="importDefTemp4">{{ $t('bonus.desk.temp_def_4') }}</el-dropdown-item>
              <el-dropdown-item class="w-160 justify-center" @click="importDefTemp2">{{ $t('bonus.desk.temp_def_2') }}</el-dropdown-item>
              <el-dropdown-item class="w-160 justify-center" @click="importDefTemp1">{{ $t('bonus.desk.temp_def_1') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button class="ml-8" type="primary" @click="handleSubmit">{{ $t('common.save_btn') }}</el-button>
      </template>
    </el-page-header>
  </div>
  <gv-full-height :bottom="20" v-if="!!bonusConfigList">
    <glc-panel-canvas ref="glcCanvasRef" :extend-data="extendData">
      <template #widgets>
        <el-divider>{{ $t('bonus.config.title') }}</el-divider>
        <template v-for="item in bonusConfigList" :key="item.id">
          <glc-widget-bonus-target :id="item.id" :show-name="item.name" />
        </template>
      </template>
    </glc-panel-canvas>
  </gv-full-height>
</template>
<script setup>
import GvFullHeight from '@/components/gv-full-height/index.vue';
import { backTab } from '@/store/tabs';
import { useRoute } from 'vue-router';
import { computed, onMounted, provide, shallowRef, watch } from 'vue';
import GlcPanelCanvas from '@/components/gv-low-code/panel-canvas.vue';
import layer from '@/tools/layer';
import { bonusDiyUIList, bonusDiyUISet, bonusListGet } from '@/api/bouns/list';
import { $t } from '@/lang/i18n';
import { getJSON, pageReload } from '@/tools';
import { bounsConfigLists } from '@/api/bouns/config';
import { QUERY_LIST_TYPE } from '@/values';
import GlcWidgetBonusTarget from '@/components/gv-low-code/_widgets/bonus-target.vue';
import { defTemp1 } from '@/views/bouns/desk/_models/temp1';
import { defTemp2 } from '@/views/bouns/desk/_models/temp2';
import { defTemp3 } from '@/views/bouns/desk/_models/temp3';
import { defTemp4 } from '@/views/bouns/desk/_models/temp4';

const glcCanvasRef = shallowRef();
const bonusConfigList = shallowRef(null);

const route = useRoute();
const query = computed(() => route.query);
const bonusId = computed(() => Number(query.value.id));
const bonusInfo = shallowRef();

const extendData = computed(() => ({ bonus: bonusConfigList.value ?? [], bonus_symbol: bonusInfo.value?.currency_icon }));

// 获取彩金奖项
const getBonusConfig = async () => {
  const { lists } = await bounsConfigLists({ bonus_id: bonusId.value, page_type: QUERY_LIST_TYPE.all });
  const bonus = await bonusListGet({ id: bonusId.value });
  bonusConfigList.value = lists;
  bonusInfo.value = bonus;
};

// 初始化设置
const initSetting = async () => {
  const info = await bonusDiyUIList({ bonus_id: bonusId.value });
  const content = getJSON(info?.content, null);
  if (!!content) glcCanvasRef.value?.setConfig(content);
};

// 导入默认模板
const importDefTemp1 = async () => {
  await layer.confirm($t('bonus.desk.tips_temp_def'));
  glcCanvasRef.value?.setConfig(defTemp1);
};

// 导入科技风模板
const importDefTemp2 = async () => {
  await layer.confirm($t('bonus.desk.tips_temp_def'));
  glcCanvasRef.value?.setConfig(defTemp2);
};

// 导入土豪风模板
const importDefTemp3 = async () => {
  await layer.confirm($t('bonus.desk.tips_temp_def'));
  glcCanvasRef.value?.setConfig(defTemp3);
};

// 导入炫彩风模板
const importDefTemp4 = async () => {
  await layer.confirm($t('bonus.desk.tips_temp_def'));
  glcCanvasRef.value?.setConfig(defTemp4);
};

// 保存
const handleSubmit = async () => {
  const config = glcCanvasRef.value?.getConfig();
  const params = { bonus_id: bonusId.value, ui_content: JSON.stringify(config) };
  layer.loading();
  await bonusDiyUISet(params);
  layer.closeLoading();
  layer.msgSuccess($t('common.save_success'));
};

onMounted(async () => {
  layer.loading();
  await getBonusConfig();
  await initSetting();
  layer.closeLoading();
});

provide('extendData', extendData);
</script>
<style lang="scss" scoped>
.desk-header {
  padding: 15px;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
}
</style>
