const emojiMapY = {
  0: 0,
  1: 90,
  2: 182,
  3: 274,
  4: 366
};

const emojiMapX = {
  0: 0,
  1: 93,
  2: 182,
  3: 271,
  4: 362,
  5: 454,
  6: 543,
  7: 631,
  8: 724
};

export const getEmojiBySize = (i, j, size) => {
  const radio = size / 76;
  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundSize: `${800 * radio}px ${442 * radio}px`,
    backgroundPosition: `-${emojiMapX[i] * radio}px -${emojiMapY[j] * radio}px`
  };
};
