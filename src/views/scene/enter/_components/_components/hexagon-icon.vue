<template>
  <div class="hexagon-icon" :style="{ width: getPX(size), height: getPX(size) }">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <defs>
        <radialGradient :id="`scene-enter-${color}`" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" :style="`stop-color: ${color}; stop-opacity: 0.2`" />
          <stop offset="100%" :style="`stop-color: ${color}; stop-opacity: 0.5`" />
        </radialGradient>
      </defs>
      <path
        d="M923.162275 224.399445L553.897365 11.361997c-28.404993-17.042996-59.650485-17.042996-88.055479 0L99.417476 224.399445C73.852982 238.601942 56.809986 267.006935 56.809986 298.252427v423.234397c0 31.245492 17.042996 59.650485 42.60749 76.693481l366.42441 213.037448c28.404993 17.042996 59.650485 17.042996 88.055479 0l366.42441-213.037448c28.404993-17.042996 42.60749-45.447989 42.60749-76.693481V298.252427c2.840499-31.245492-14.202497-59.650485-39.76699-73.852982z"
        :fill="`url(#scene-enter-${color})`"
      />
    </svg>
    <svg class="mark-1" viewBox="0 0 1024 1024" :width="size" :height="size">
      <defs>
        <linearGradient id="scene-enter-mark-white" gradientTransform="rotate(90)">
          <stop offset="0%" :style="`stop-color: #ffffff; stop-opacity: 0.3`" />
          <stop offset="40%" stop-color="transparent" />
          <stop offset="60%" stop-color="transparent" />
          <stop offset="100%" :style="`stop-color: #ffffff; stop-opacity: 0.3`" />
        </linearGradient>
      </defs>
      <path
        d="M923.162275 224.399445L553.897365 11.361997c-28.404993-17.042996-59.650485-17.042996-88.055479 0L99.417476 224.399445C73.852982 238.601942 56.809986 267.006935 56.809986 298.252427v423.234397c0 31.245492 17.042996 59.650485 42.60749 76.693481l366.42441 213.037448c28.404993 17.042996 59.650485 17.042996 88.055479 0l366.42441-213.037448c28.404993-17.042996 42.60749-45.447989 42.60749-76.693481V298.252427c2.840499-31.245492-14.202497-59.650485-39.76699-73.852982z"
        fill="url(#scene-enter-mark-white)"
      />
    </svg>
  </div>
</template>
<script setup>
import { getPX } from '@/tools';

defineProps({ color: String, size: { type: Number, default: 100 } });
</script>
<style lang="scss" scoped>
.hexagon-icon {
  position: relative;

  .mark-1 {
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(0.9);
  }
}
</style>
