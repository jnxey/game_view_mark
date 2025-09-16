import { utterSilence } from '@/hooks/speak';

export function useAudio(url) {
  const backgroundMusic = new Audio(url);
  backgroundMusic.loop = true; // 设置循环播放

  const open = () => {
    if (!utterSilence.value) return;
    backgroundMusic.play();
  };

  const close = () => {
    backgroundMusic.pause();
  };

  return { open, close };
}
