(function () {
  function setRem() {
    const baseSize = 28; // 基础字号 (可调整)
    const designWidth = 750; // 设计稿宽度 (如750px，375px等)
    const screenWidth = document.documentElement.clientWidth || window.innerWidth;

    // 计算比例并设置根元素字体大小
    const scale = screenWidth / designWidth;
    document.documentElement.style.fontSize = baseSize * scale + 'px';
  }

  setRem();

  // 监听窗口变化，实时调整
  window.addEventListener('resize', setRem);
  window.addEventListener('orientationchange', setRem);
})();
