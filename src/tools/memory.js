/**
 * 内存监控工具
 * @param {number} interval - 检查内存的时间间隔（毫秒）
 * @param {number} threshold - 内存增长阈值（MB），超过该值则警告
 */
export function memoryMonitor(interval = 60 * 1000, threshold = 100) {
  let previousMemory = null;

  // 获取当前内存使用情况（MB）
  function getMemoryUsage() {
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      return (memory.usedJSHeapSize / (1024 * 1024)).toFixed(2); // 转换为 MB
    } else {
      console.warn('performance.memory is not supported in this browser.');
      return null;
    }
  }

  // 定期检查内存使用情况
  const checkInterval = setInterval(() => {
    const currentMemory = getMemoryUsage();
    if (currentMemory === null) return;

    console.log(`Current memory usage: ${currentMemory} MB`);

    if (previousMemory !== null) {
      const memoryIncrease = currentMemory - previousMemory;
      if (memoryIncrease > threshold) {
        console.warn(`Memory usage increased by ${memoryIncrease.toFixed(2)} MB in the last ${interval / 1000} seconds. Possible memory leak!`);
      }
    }

    previousMemory = currentMemory;
  }, interval);

  // 返回清除监控的方法
  return () => clearInterval(checkInterval);
}

// 启动内存监控
const stopMemoryMonitor = memoryMonitor();

// 停止内存监控（如果需要）
// stopMemoryMonitor();
