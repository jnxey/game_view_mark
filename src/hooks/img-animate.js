// png序列动画
export function useImgAnimate(getEl, options = {}) {
  const { rate = 30, getFrameUrl = (index) => index, repeat = null, total = 240 } = options;

  const control = { frame: 1, animateId: null };

  // 预加载所有图片
  function preload() {
    const el = getEl();
    for (let i = 1; i <= total; i++) {
      const img = document.createElement('img');
      img.setAttribute('id', 'data-animate-' + String(i));
      img.src = getFrameUrl(i);
      img.style.position = 'absolute';
      img.style.top = '0px';
      img.style.left = '0px';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.classList.add('visibility-hidden');
      el.appendChild(img);
    }
  }

  // 隐藏所有图片
  function setFrameHidden() {
    const el = getEl();
    const imgs = el.querySelectorAll('.visibility-show') ?? [];
    imgs.forEach((item) => {
      item.classList.remove('visibility-show');
    });
  }

  // 更新帧显示
  function updateFrame() {
    const el = getEl();
    const frame = control.frame;
    setFrameHidden();
    const current = el.querySelector('#' + 'data-animate-' + String(frame));
    if (!!current) current.classList.add('visibility-show');
    if (!current) {
      if (typeof repeat === 'number') {
        control.frame = repeat;
        updateFrame();
      } else {
        close();
      }
    } else {
      control.frame = control.frame + 1;
      control.animateId = setTimeout(updateFrame, rate);
    }
  }

  // 播放
  function play() {
    if (!control.animateId) control.animateId = setTimeout(updateFrame, rate);
  }

  // 暂停
  function pause() {
    clearTimeout(control.animateId);
    control.animateId = null;
  }

  // 关闭
  function close() {
    clearTimeout(control.animateId);
    setFrameHidden();
    control.animateId = null;
    control.frame = 1;
  }

  return { preload, play, pause, close };
}
