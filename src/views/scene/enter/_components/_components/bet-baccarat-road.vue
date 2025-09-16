<template>
  <gv-popup ref="popupRef" :title="$t('scene.enter.btn_next_road_edit')" :async="true" width="500px" :show-footer="false">
    <el-empty v-if="!currentBootRecord.length" />
    <div v-if="!!currentBootRecord.length" class="pb-16">
      <el-scrollbar class="scroll-wrap" :style="{ width: getPX(size * 1.2), height: getPX(size) }">
        <div class="road-wrap" :style="{ width: getPX(placeWidth), height: getPX(placeHeight) }">
          <template v-for="(part, x) in roadList" :key="x">
            <template v-for="(record, y) in part" :key="getMultipleKey(x, y)">
              <div
                v-if="!!record.bet_result"
                class="road-item flex-col justify-center align-center cursor-pointer"
                :style="getPositionBySize(x, y, boxSize)"
                @click="handleEdit(record)"
              >
                <gv-game-kind-icon :kinds="gameKindMap" :compose="record.bet_result" :size="iconSize" />
                <div class="text text-center text-placeholder fz-14 pt-4">局号{{ record.round_number }}</div>
              </div>
            </template>
          </template>
        </div>
      </el-scrollbar>
    </div>
  </gv-popup>
  <bet-open-edit ref="betOpenEditRef" @success="handleSuccess" />
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { computed, inject, ref, shallowRef } from 'vue';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { chunkArray, getMultipleKey, getPositionBySize, getPX } from '@/tools';
import GvGameKindIcon from '@/components/gv-game-kind-icon/index.vue';
import BetOpenEdit from '@/views/game-data/bet-open/_components/edit-baccarat.vue';
import { $t } from '@/lang/i18n';

const currentBootRecord = inject('currentBootRecord');
const gameKindMap = inject('gameKindMap');

const size = 360;

const defaultRows = 6;

const emit = defineEmits(['success', 'close']);

const popupRef = shallowRef();
const betOpenEditRef = shallowRef();
const roadInfo = ref({});

const boxSize = computed(() => Math.floor(size / defaultRows));

const iconSize = computed(() => Math.floor(boxSize.value * 0.5));

const roadList = computed(() => chunkArray(currentBootRecord.value ?? [], defaultRows));

const placeWidth = computed(() => Math.ceil(boxSize.value * roadList.value.length));

const placeHeight = computed(() => Math.ceil(boxSize.value * defaultRows));

const open = async (info) => {
  roadInfo.value = info;
  popupRef.value?.open();
};

// 打开编辑
const handleEdit = (row) => {
  betOpenEditRef.value?.open({ ...row, id: row.open_id, game_id: roadInfo.value.game_id, bet_result: row.bet_result });
};

// 触发更改成功
const handleSuccess = () => {
  emit('success');
};
defineExpose({ open });
</script>
<style scoped lang="scss">
.scroll-wrap {
  margin: 0 auto;
}
.road-wrap {
  position: relative;

  .road-item {
    position: absolute;
    border-radius: var(--gv-border-radius-mid);

    &:hover {
      background-color: var(--el-fill-color-darker);

      & > .text {
        font-weight: bold;
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
