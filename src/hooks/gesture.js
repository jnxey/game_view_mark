import { onMounted, onUnmounted } from 'vue';

export function usePinchGesture(callback, options = {}) {
  const { minScale = 0.5, maxScale = 3 } = options;
  let startDistance = 0;
  let initialScale = 1;
  let target = null;

  // 计算两点距离
  const getDistance = (touches) => {
    const [t1, t2] = touches;
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  };

  // 双指触摸开始：记录初始距离和当前缩放基准
  const handleTouchStart = (e) => {
    console.log(e, '------------------1');
    if (e.touches.length === 2) {
      e.preventDefault();
      startDistance = getDistance(e.touches);
      initialScale = parseFloat(target.style.transform?.match(/scale\(([\d.]+)\)/)?.[1]) || 1;
    }
  };

  // 双指触摸结束：计算最终缩放比例并回调
  const handleTouchEnd = (e) => {
    if (e.touches.length >= 2) return; // 仍有手指未离开时忽略
    e.preventDefault();

    // 计算手势结束时的最终比例 [6,7](@ref)
    const endDistance = getDistance(e.changedTouches);
    const newScale = Math.max(minScale, Math.min(maxScale, initialScale * (endDistance / startDistance)));

    // 触发回调（仅一次！）
    callback(newScale);
  };

  // 初始化事件监听
  const initGesture = (_target) => {
    target = _target;
    target.addEventListener('touchstart', handleTouchStart, { passive: false });
    target.addEventListener('touchend', handleTouchEnd, { passive: false });
  };

  // 清理事件
  onUnmounted(() => {
    target?.removeEventListener('touchstart', handleTouchStart);
    target?.removeEventListener('touchend', handleTouchEnd);
  });

  return { initGesture };
}
