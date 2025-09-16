<template>
  <div class="cloud-icon">
    <svg class="icon-svg" viewBox="0 0 1024 1024" width="30px" height="30px">
      <defs>
        <linearGradient id="gv-scene-c1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color: rgb(148, 227, 241); stop-opacity: 1" />
          <stop offset="100%" style="stop-color: rgb(56, 159, 204); stop-opacity: 1" />
        </linearGradient>
      </defs>
      <path
        d="M735.22 396.03c0.32-4.72 0.48-9.39 0.48-14.05 0-59.18-23.05-114.82-64.89-156.67-41.85-41.85-97.49-64.89-156.67-64.89-59.18 0-114.82 23.05-156.67 64.89-41.85 41.85-64.89 97.49-64.89 156.67 0 4.66 0.16 9.33 0.48 14.05C182 400.35 93.01 492.04 93.01 604.13c0 114.83 93.42 208.26 208.26 208.26H727c114.83 0 208.26-93.42 208.26-208.26 0-112.09-89-203.78-200.04-208.1z"
        fill="url(#gv-scene-c1)"
      />
    </svg>
    <div class="text-value flex-row align-center justify-center scene-text-main-color fz-14">{{ value }}</div>
  </div>
</template>
<script setup>
defineProps({ value: String });
</script>
<style scoped lang="scss">
.cloud-icon {
  position: relative;
  width: 30px;
  height: 30px;

  .icon-svg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .text-value {
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
  }
}
</style>
