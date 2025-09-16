<template>
  <div class="pannel-right" :style="panelRightStyle">
    <el-scrollbar>
      <gv-scene-card class="work-person mb-12" :title="$ti(tableInfo.game_name)">
        <div class="flex-row align-center justify-center mb-12 pb-8">
          <el-avatar :size="40" :src="avatarUrl" />
          <div class="info-wrap ml-16 flex-col align-center justify-center pl-16 pr-16">
            <div class="fz-18 fw-bold scene-text-main-color mb-8">{{ managerState.user?.account }}</div>
            <div class="label fz-14 text-placeholder">{{ $t('scene.enter.title_work_no') }}</div>
          </div>
        </div>
        <gv-scene-button @click="accountChange">
          <gv-icon name="local-icon-change" />
          <span class="ml-4">{{ $t('scene.enter.btn_change_account') }}</span>
        </gv-scene-button>
      </gv-scene-card>
      <gv-scene-card class="work-space mb-12" :title="$t('scene.enter.label_tc_table') + '：' + route.query.name">
        <div class="space-item">
          <div class="space-content space-item-text text-center mb-16">
            <span class="fz-14 text-placeholder">{{ $t('scene.enter.label_tc_boot') }}</span>
            <span class="fz-24 fw-bold ml-4 scene-text-main-color">{{ openingInfo.boot_number }}</span>
            <span class="fz-14 text-placeholder ml-16">{{ $t('scene.enter.label_tc_round') }}</span>
            <span class="fz-24 fw-bold ml-4 scene-text-main-color">{{ openingInfo.round_number }}</span>
          </div>
          <div class="space-content">
            <gv-scene-button class="" type="dark" round small @click="nextBoot">{{ $t('scene.enter.btn_next_boot') }}</gv-scene-button>
          </div>
        </div>
      </gv-scene-card>
      <!--      -->
      <gv-scene-card class="mb-12" :title="$t('scene.enter.title_table_base')">
        <el-row>
          <el-col :span="12" v-for="item in currencyConfig">
            <div class="profit-item flex-row align-center mb-8">
              <el-avatar :size="24" :src="currencyConfigMap[item.id].image" />
              <div class="flex-1 ml-8">
                <div class="mb-4 fz-18 color-white">
                  {{ Number(currentTableBase[item.id]?.base_number ?? 0) }}
                </div>
                <div class="fz-12 text-placeholder">{{ $ti(currencyConfigMap[item.id].name) }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </gv-scene-card>
      <!--      -->
      <gv-scene-card class="mb-12" :title="$t('scene.enter.title_profit')">
        <el-row>
          <el-col :span="12" v-for="item in currentBootProfit">
            <div class="profit-item flex-row align-center mb-8">
              <el-avatar :size="24" :src="currencyConfigMap[item.currency_config_id].image" />
              <div class="flex-1 ml-8">
                <div class="mb-4 fz-18">
                  <gv-profit :value="item.profit" zero-color="var(--el-color-white)" />
                </div>
                <div class="fz-12 text-placeholder">{{ $ti(currencyConfigMap[item.currency_config_id].name) }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </gv-scene-card>
      <template v-if="isBaccarat">
        <gv-scene-card class="work-road mb-12">
          <pannel-right-baccarat-road :size="260" />
        </gv-scene-card>
      </template>
      <template v-if="isRoadNiuniu">
        <gv-scene-card class="work-road mb-12">
          <pannel-right-niuniu-road :size="260" />
        </gv-scene-card>
      </template>
    </el-scrollbar>
    <gv-account-change ref="accountChangeRef" />
  </div>
</template>
<script setup>
import GvSceneCard from '@/views/scene/enter/_components/gv-scene-card/index.vue';
import GvSceneButton from '@/views/scene/enter/_components/gv-scene-button/index.vue';
import PannelRightBaccaratRoad from '@/views/scene/enter/_components/pannel-right-baccarat-road.vue';
import GvSceneButtonParallel from '@/views/scene/enter/_components/gv-scene-button/parallel.vue';
import { panelRightStyle } from '@/views/scene/enter/_models/enter-layout';
import { managerState } from '@/store/manager';
import { computed, inject, shallowRef } from 'vue';
import { getAlbumDef, mappingArrayToObject } from '@/tools';
import avatar from '@/assets/images/layout/avatar.png';
import { useRoute } from 'vue-router';
import GvAccountChange from '@/components/gv-account-change/index.vue';
import layer from '@/tools/layer';
import { betNextBootNumber } from '@/api/scene/enter';
import PannelRightNiuniuRoad from '@/views/scene/enter/_components/pannel-right-niuniu-road.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';
import GvProfit from '@/components/gv-profit/index.vue';
import GvIcon from '@/components/gv-icon/index.vue';

const openingInfo = inject('openingInfo');
const tableInfo = inject('tableInfo');
const isBaccarat = inject('isBaccarat');
const isRoadNiuniu = inject('isRoadNiuniu');
const handleNextBoot = inject('handleNextBoot');
const currentBootProfit = inject('currentBootProfit');
const currencyConfig = inject('currencyConfig');
const currentTableBase = inject('currentTableBase');

const accountChangeRef = shallowRef();

const route = useRoute();

const avatarUrl = computed(() => {
  return managerState.user?.avatar ? getAlbumDef(managerState.user?.avatar) : avatar;
});

const currencyConfigMap = computed(() => mappingArrayToObject(currencyConfig.value));

const nextBoot = async () => {
  await layer.confirm($t('scene.enter.tips_confirm_next_boot'));
  const table = tableInfo.value;
  layer.loading();
  await betNextBootNumber({ table_id: table.id, game_id: table.game_id });
  layer.closeLoading();
  layer.msgSuccess($t('scene.enter.tips_next_boot_success'));
  handleNextBoot();
};

const accountChange = () => {
  accountChangeRef.value?.open();
};
</script>
<style lang="scss" scoped>
.pannel-right {
  position: absolute;
  top: var(--scene-enter-main-padding-panel);
  bottom: var(--scene-enter-main-padding-panel);
  z-index: 10;

  .work-person {
    width: 100%;
    height: 160px;

    .info-wrap {
      background-image: var(--scene-enter-person-bg-1);
    }
  }

  .work-space {
    .space-item {
      position: relative;
      width: 180px;
      margin: 0 auto;

      .space-content {
        position: relative;
        z-index: 10;
      }

      .space-item-text {
        white-space: nowrap;
        word-break: keep-all;
      }

      &:after {
        content: '';
        position: absolute;
        top: 8px;
        left: 50%;
        width: 150px;
        height: 30px;
        background-image: url('@/assets/images/scene/content-title-bg.png');
        background-size: 100% 100%;
        transform: translateX(-50%);
        opacity: 0.5;
        z-index: 0;
      }
    }
  }

  .work-road {
    width: 100%;
    height: 300px;
  }
}
</style>
