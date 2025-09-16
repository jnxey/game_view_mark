// 实现自动计算并设置 Popover 位置的 JavaScript 方法，确保 Popover 始终在可视区域内
export function popoverPosition(triggerRect, popoverRect) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 可用位置计算
  const positions = {
    top: {
      top: triggerRect.top - popoverRect.height,
      left: triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
    },
    bottom: {
      top: triggerRect.bottom,
      left: triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
    },
    left: {
      top: triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2,
      left: triggerRect.left - popoverRect.width
    },
    right: {
      top: triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2,
      left: triggerRect.right
    }
  };

  // 自动选择最佳位置
  const validPositions = Object.entries(positions).filter(([position, coord]) => {
    return coord.top >= 0 && coord.top + popoverRect.height <= viewportHeight && coord.left >= 0 && coord.left + popoverRect.width <= viewportWidth;
  });

  // 优先顺序：bottom > top > right > left
  const priorityOrder = ['bottom', 'top', 'right', 'left'];
  let bestPosition = priorityOrder.find((pos) => validPositions.some(([validPos]) => validPos === pos));

  // 如果没有完全合适的位置，选择最合适的
  if (!bestPosition) {
    bestPosition = Object.entries(positions).reduce(
      (best, [pos, coord]) => {
        const overflowX = Math.max(0, coord.left + popoverRect.width - viewportWidth) + Math.max(0, -coord.left);
        const overflowY = Math.max(0, coord.top + popoverRect.height - viewportHeight) + Math.max(0, -coord.top);
        const totalOverflow = overflowX + overflowY;
        return totalOverflow < best.overflow ? { pos, overflow: totalOverflow } : best;
      },
      { pos: 'bottom', overflow: Infinity }
    ).pos;
  }

  // 获取最终坐标并修正边界
  let { top, left } = positions[bestPosition];
  left = Math.max(0, Math.min(left, viewportWidth - popoverRect.width));
  top = Math.max(0, Math.min(top, viewportHeight - popoverRect.height));

  // 返回位置信息
  return {
    position: bestPosition,
    coordinates: { top, left },
    viewport: {
      width: viewportWidth,
      height: viewportHeight
    }
  };
}
