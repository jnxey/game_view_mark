<template>
  <div class="slide-button cursor-pointer" :class="{ [direction]: true, 'show-wrap': isShow }">
    <svg class="icon" viewBox="0 0 1024 1024" width="60" height="60">
      <path
        d="M648.930233 19.515535V1004.234419c-19.456-26.362047-44.246326-45.627535-74.335256-57.844093l-156.469582-56.915349A65.41693 65.41693 0 0 1 375.069767 828.011163V204.883349a65.464558 65.464558 0 0 1 41.031442-60.773209l157.886512-63.559442c28.838698-11.954605 53.855256-32.267907 74.942512-61.035163z"
        fill="#16bfb9"
      />
    </svg>
    <svg class="arrow" viewBox="0 0 50 100" width="16" height="16" fill="none" :class="{ show: isShow }">
      <path d="M0 0 L50 50 L0 100" stroke="#ffffff" stroke-width="10" stroke-linecap="round" />
    </svg>
  </div>
</template>
<script setup>
defineProps({
  direction: { type: String, default: 'left' },
  isShow: Boolean
});
</script>
<style scoped lang="scss">
.slide-button {
  position: absolute;
  width: 26px;
  height: 60px;
  overflow: hidden;
  z-index: 10;

  &.left {
    top: 20%;
    left: 0;

    &.show-wrap {
      z-index: 20;
    }

    svg.icon {
      position: absolute;
      left: -22px;
      transform: rotate(180deg);
      z-index: 5;
    }

    .arrow {
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -8px;
      transition: transform 0.3s linear;
      z-index: 10;

      &.show {
        transform: scaleX(-1);
      }
    }
  }

  &.right {
    top: 20%;
    right: 0;

    &.show-wrap {
      z-index: 20;
    }

    svg.icon {
      position: absolute;
      right: -22px;
      z-index: 5;
    }

    .arrow {
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -8px;
      transition: transform 0.3s linear;
      transform: scaleX(-1);
      z-index: 10;

      &.show {
        transform: scaleX(1);
      }
    }
  }

  &.top {
    top: 0;
    left: 50%;
    margin-top: -18px;
    margin-left: -13px;
    transform: rotate(90deg);
    transform-origin: center;

    svg.icon {
      position: absolute;
      left: -22px;
      transform: rotate(180deg);
      z-index: 5;
    }

    .arrow {
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -8px;
      transition: transform 0.3s linear;
      z-index: 10;

      &.show {
        transform: scaleX(-1);
      }
    }
  }
}
</style>
