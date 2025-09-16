import { nextTick, onMounted, watch } from 'vue';
import { adaptDPR } from '@/tools/index.js';

// 绘制网格
export function useDrawGrid(id, getPart) {
  // 绘制网格
  function drawGrid() {
    const part = getPart();
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    adaptDPR(canvas, ctx, part.width, part.height);
    // 网格配置
    const gridSize = part.boxSize; // 每个格子的大小
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = '#bad8f8'; // 网格线颜色
    ctx.lineWidth = 1; // 网格线宽度

    // 绘制水平线
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // 绘制垂直线
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    ctx.restore();
  }

  watch(
    getPart,
    () => {
      nextTick(() => {
        drawGrid();
      });
    },
    { deep: true }
  );

  onMounted(() => {
    drawGrid();
  });
}
