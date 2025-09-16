<template>
  <div class="user-chip-log">
    <log-cabinet v-if="isCabinet" />
    <log-handler v-else />
  </div>
</template>
<script setup>
import LogCabinet from '@/views/finance/user-chip-log/_components/log-cabinet.vue';
import LogHandler from '@/views/finance/user-chip-log/_components/log-handler.vue';
import { computed } from 'vue';
import { CABINET_CHIP_FIELD } from '@/views/finance/user-chip/_model';
import { useRoute } from 'vue-router';

const route = useRoute();

const isCabinet = computed(() => route.query.sub_type === CABINET_CHIP_FIELD);
</script>
<style scoped></style>
