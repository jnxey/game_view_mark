import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useSliderNumber } from './number.js';

export function useZoom(containerRef, options = {}) {
  const {
    minScale = 0.2,
    maxScale = 2,
    zoomSpeed = 0.05,
    defScale = 1,
    setScale,
    withOrigin = true // 是否启用动态缩放中心
  } = options;

  const scale = ref(defScale);
  const originX = ref('50%');
  const originY = ref('50%');
  let throttleFlag = false;

  // 计算缩放样式[2,9](@ref)
  const transformStyle = computed(() => ({
    transform: `scale(${scale.value})`,
    transformOrigin: withOrigin ? `${originX.value} ${originY.value}` : 'center',
    transition: 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)'
  }));

  // 动态计算鼠标位置[2,5](@ref)
  const calcOrigin = (e, container) => {
    const rect = container.getBoundingClientRect();
    originX.value = `${((e.clientX - rect.left) / rect.width) * 100}%`;
    originY.value = `${((e.clientY - rect.top) / rect.height) * 100}%`;
  };

  // 滚轮事件处理[5,9](@ref)
  const handleWheel = (e) => {
    e.preventDefault();
    if (throttleFlag) return;

    throttleFlag = true;
    requestAnimationFrame(() => {
      const delta = Math.sign(e.deltaY) * -1; // 反转滚动方向
      const newScale = scale.value + delta * zoomSpeed;

      // 缩放边界限制
      scale.value = useSliderNumber(Math.max(minScale, Math.min(maxScale, newScale)));
      if (!!setScale) setScale(scale.value);

      // 动态计算缩放原点[2](@ref)
      if (withOrigin && containerRef.value) {
        calcOrigin(e, containerRef.value);
      }

      throttleFlag = false;
    });
  };

  // 初始化事件监听[5](@ref)
  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('wheel', handleWheel, { passive: false });
    }
  });

  // 销毁事件[5](@ref)
  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('wheel', handleWheel);
    }
  });

  return {
    scale,
    transformStyle,
    resetScale: (value = 1) => {
      scale.value = value;
      if (!!setScale) setScale(scale.value);
    }
  };
}
