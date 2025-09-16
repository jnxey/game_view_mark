<template>
  <div class="guest-card flex-row flex-wrap align-top p-4">
    <div class="guest-image">
      <el-avatar :size="28" :src="getAlbumDef(source.images)" />
    </div>
    <div class="guest-info ml-4 fz-12 text-line-1_5">
      <div class="info-row">
        <span class="info-label">
          {{ !!source.guest_username ? $t('external.hotel_room_record.guest_user') : $t('external.hotel_room_record.guest_name') }}：
        </span>
        <span class="info-content">{{ source.guest_username || source.guest_nickname }}</span>
      </div>
      <div class="info-row" v-if="source.guest_id_number">
        <span class="info-label">{{ $t('external.hotel_room_record.id_number') }}：</span>
        <span class="info-content">{{ source.guest_id_number }}</span>
      </div>
      <div class="info-row" v-if="source.guest_telephone">
        <span class="info-label">{{ $t('external.hotel_room_record.telephone') }}：</span>
        <span class="info-content">{{ source.guest_telephone }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getAlbumDef } from '@/tools';

const props = defineProps({ source: Object });
</script>
<style lang="scss" scoped>
.guest-card {
  border-radius: var(--gv-border-radius-mid);
  border: 1px solid var(--el-border-color);
}
</style>
