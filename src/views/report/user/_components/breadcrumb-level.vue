<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item>
      <span class="fw-bold text-main cursor-pointer fz-16" @click="select(USER_TREE_ALL_KEY)">{{ $t('report.user.agent_top') }}</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in list" :key="item.id">
      <span v-if="index === lastIndex" :style="{ color: getLevelColor(item.level_path) }">{{ item.username }}</span>
      <span v-else class="fw-bold text-main cursor-pointer fz-16" :style="{ color: getLevelColor(item.level_path) }" @click="select(item.id)">
        {{ item.username }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup>
import { computed } from 'vue';
import { USER_TREE_ALL_KEY } from '@/values';
import { $t } from '@/lang/i18n';
import { getLevelColor } from '@/views/report/user/_models';

const props = defineProps({ list: Array });
const emit = defineEmits(['select']);

const lastIndex = computed(() => props.list?.length - 1);

const select = (id) => {
  emit('select', { user_id: id });
};
</script>
