<template>
  <div class="page-wrap">
    <div class="flex-row mb-16">
      <el-radio-group v-model="currentBuilding" @change="getApartmentList">
        <el-radio class="custom-radio" v-for="item in buildingList" :key="item.id" :label="item.name" :value="item.id" />
      </el-radio-group>
      <el-button class="ml-12" circle icon="Refresh" @click="getApartmentList" />
    </div>

    <div class="room-wrap flex-row align-center flex-wrap">
      <div
        v-for="item in apartmentList"
        :key="item.id"
        class="room-item cursor-pointer"
        :class="{ has: item.staff_total > 0, max: item.staff_total >= item.max_number }"
        @click="handleBinding(item)"
      >
        <div class="title color-white fz-20 mb-16">{{ item.code }}</div>
        <div class="color-white fz-16 mb-16 pl-12">{{ $t('staff.check_in.current_bind') }}</div>
        <div class="cur-number flex-row align-center pl-12">
          <gv-icon name="el-icon-user-filled" class="color-white fz-16" />
          <span class="color-white fz-20 ml-8">{{ item.staff_total }}</span>
        </div>
      </div>
    </div>
    <template v-if="!apartmentList.length">
      <el-empty />
    </template>
    <binding-popup ref="bindingRef" @refresh="getApartmentList" />
  </div>
</template>

<script setup>
import { staffApartmentLists } from '@/api/staff/apartment';
import { onBeforeMount, ref, shallowRef } from 'vue';
import BindingPopup from '@/views/staff/_components/binding.vue';
import layer from '@/tools/layer';
import { staffBuildingLists } from '@/api/staff/building';
import { QUERY_LIST_TYPE } from '@/values';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';

const editRef = shallowRef();
const bindingRef = shallowRef();
const buildingList = shallowRef([]);
const apartmentList = shallowRef([]);
const currentBuilding = ref();

const getBuildingList = async () => {
  const { lists } = await staffBuildingLists({ page_type: QUERY_LIST_TYPE.all });
  buildingList.value = lists;
  currentBuilding.value = lists[0]?.id;
};

const getApartmentList = async () => {
  layer.loading();
  const { lists } = await staffApartmentLists({ page_type: QUERY_LIST_TYPE.all, building_id: currentBuilding.value });
  layer.closeLoading();
  apartmentList.value = lists;
};

const handleBinding = (row) => {
  bindingRef.value?.open(row);
};

onBeforeMount(async () => {
  await getBuildingList();
  await getApartmentList();
});
</script>
<style lang="scss" scoped>
.page-wrap {
  padding: 15px;
  min-height: 100%;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
}

.room-wrap {
  .room-item {
    width: 180px;
    height: 180px;
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: var(--gv-border-radius-big);
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-color-primary);

    .title {
      padding: 8px 10px;
      border-radius: 16px 16px 0 0;
      background-color: var(--el-color-primary-dark-2);
    }

    &.has {
      background-color: var(--el-color-warning);

      .title {
        background-color: var(--el-color-warning-dark-2);
      }
    }

    &.max {
      background-color: var(--el-color-danger);

      .title {
        background-color: var(--el-color-danger-dark-2);
      }
    }

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
