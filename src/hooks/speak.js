import { ref } from 'vue';

let utterThis = null;
export const utterSilence = ref(false);

export function initSpeak() {
  window.addEventListener(
    'click',
    () => {
      toggleSpeak();
    },
    { once: true }
  );
}

export function toggleSpeak() {
  if (!window.SpeechSynthesisUtterance) return;
  if (!utterThis) {
    utterThis = new window.SpeechSynthesisUtterance();
    utterThis.rate = 1.5;
    utterThis.text = '';
    window.speechSynthesis.speak(utterThis);
  }
  utterSilence.value = !utterSilence.value;
}

export function useSpeak() {
  let speakTimer = null;
  let text = null;
  let loop = null;

  const speak = () => {
    if (!utterSilence.value || !utterThis) return;
    utterThis.text = text;
    window.speechSynthesis.speak(utterThis);
    if (loop) utterThis.addEventListener('end', playNext);
  };

  const playNext = () => {
    speakTimer = setTimeout(() => {
      speak();
    }, 3 * 1000);
  };

  const start = (_text, _loop = true) => {
    text = _text;
    loop = _loop;
    speak();
  };

  const close = () => {
    clearTimeout(speakTimer);
    if (utterThis) utterThis.removeEventListener('end', playNext);
  };

  return { start, close };
}
