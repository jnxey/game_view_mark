import { onBeforeMount, reactive, ref } from 'vue';
import { getPX, getWindowSize, limitDecimal } from '@/tools/index.js';
import { useListenResize } from '@/hooks/resize.js';

function isEven(num) {
  return !(num % 2);
}

function execBox(width, height, row, floor, even = false) {
  if (floor) {
    const b1 = height / row;
    let cols = Math.floor(width / b1);
    if (even) cols = isEven(cols) ? cols : cols + 1; // 取偶
    const diff = Math.floor(width - cols * b1);
    const boxSize = limitDecimal(b1 + diff / cols, 2, true);
    height = limitDecimal(boxSize * row, 2, true);
    return { width, height, cols, boxSize, offset: diff };
  } else {
    const b1 = height / row;
    let cols = Math.ceil(width / b1);
    if (even) cols = isEven(cols) ? cols : cols + 1; // 取偶
    const diff = Math.floor(cols * b1 - width);
    const boxSize = limitDecimal(b1 - diff / cols, 2, true);
    height = limitDecimal(boxSize * row, 2, true);
    return { width, height, cols, boxSize, offset: diff };
  }
}

export function useGridLayout() {
  const layout = reactive({});
  const part1 = reactive({ rows: 6, cols: 1, wrapCols: 1, boxSize: 50, width: 50, height: 50, translate: 0, layout: 'part1' }); // 列数
  const part3 = reactive({ rows: 6, cols: 1, wrapCols: 1, boxSize: 50, width: 50, height: 50, translate: 0, layout: 'part3' }); // 列数
  const part4 = reactive({ rows: 6, cols: 1, wrapCols: 1, boxSize: 50, width: 50, height: 50, translate: 0, layout: 'part4' }); // 列数
  const part5 = reactive({ rows: 6, cols: 1, wrapCols: 1, boxSize: 50, width: 50, height: 50, translate: 0, layout: 'part5' }); // 列数
  const part6 = reactive({ rows: 6, cols: 1, wrapCols: 1, boxSize: 50, width: 50, height: 50, translate: 0, layout: 'part6' }); // 列数
  const part7 = reactive({ rows: 3, cols: 1, wrapCols: 1, boxSize: 50, width: 50, height: 50, translate: 0, layout: 'part7' }); // 列数

  // 计算布局
  const execLayout = () => {
    const padding = 20;
    const padding2 = 40;

    const screen = getWindowSize();
    const headerHeight = limitDecimal(100, 2, true);
    const partW = limitDecimal(screen.width / 6, 2, true);
    const partH = limitDecimal((screen.height - headerHeight * 1.5) / 6, 2, true);

    // header
    layout.header = { height: getPX(headerHeight) };
    // part1
    const part1Box = execBox(partW * 3.5, partH * 2, part1.rows, true);
    part1.boxSize = part1Box.boxSize;
    part1.cols = Math.max(part1.cols, part1Box.cols);
    part1.wrapCols = part1Box.cols;
    part1.width = part1Box.boxSize * part1.cols;
    part1.height = part1Box.height;
    layout.part1 = { position: 'absolute', top: 0, left: getPX(padding), width: getPX(part1Box.width), height: getPX(part1Box.height) };
    layout.part1_content = { width: getPX(part1Box.boxSize * part1Box.cols), height: getPX(part1Box.height) };
    layout.part1_normal = { width: getPX(part1Box.boxSize * part1.cols), height: getPX(part1Box.height), transition: 'transform 0.3s' };

    // part2
    layout.part2 = { position: 'absolute', top: 0, right: getPX(padding), width: getPX(partW * 2.5 - padding2), height: getPX(part1Box.height) };

    // part3
    const part3Top = part1Box.height + padding;
    const part3Box = execBox(partW * 6 - padding2, partH * 1.8 - part1Box.offset, part3.rows, false);
    part3.boxSize = part3Box.boxSize;
    part3.cols = Math.max(part3.cols, part3Box.cols);
    part3.wrapCols = part3Box.cols;
    part3.width = part3Box.boxSize * part3.cols;
    part3.height = part3Box.height;
    layout.part3 = {
      position: 'absolute',
      top: getPX(part3Top),
      left: getPX(padding),
      width: getPX(part3Box.width),
      height: getPX(part3Box.height)
    };
    layout.part3_content = { width: getPX(part3Box.boxSize * part3Box.cols), height: getPX(part3Box.height) };
    layout.part3_normal = { width: getPX(part3Box.boxSize * part3.cols), height: getPX(part3Box.height), transition: 'transform 0.3s' };

    // part4
    const part45Top = part1Box.height + part3Box.height + padding2;
    const part4to7Box = execBox(partW * 3 - padding, partH, part4.rows, true, true);
    part4.boxSize = part4to7Box.boxSize;
    part4.cols = Math.max(part4.cols, part4to7Box.cols);
    part4.wrapCols = part4to7Box.cols;
    part4.width = part4to7Box.boxSize * part4.cols;
    part4.height = part4to7Box.height;
    layout.part4 = {
      position: 'absolute',
      top: getPX(part45Top),
      left: getPX(padding),
      width: getPX(part4to7Box.width),
      height: getPX(part4to7Box.height)
    };
    layout.part4_content = { width: getPX(part4to7Box.boxSize * part4to7Box.cols), height: getPX(part4to7Box.height) };
    layout.part4_normal = { width: getPX(part4to7Box.boxSize * part4.cols), height: getPX(part4to7Box.height), transition: 'transform 0.3s' };

    // part5
    part5.boxSize = part4to7Box.boxSize;
    part5.cols = Math.max(part5.cols, part4to7Box.cols);
    part5.wrapCols = part4to7Box.cols;
    part5.width = part4to7Box.boxSize * part5.cols;
    part5.height = part4to7Box.height;
    layout.part5 = {
      position: 'absolute',
      top: getPX(part45Top),
      right: getPX(padding),
      width: getPX(part4to7Box.width),
      height: getPX(part4to7Box.height)
    };
    layout.part5_content = { width: getPX(part4to7Box.boxSize * part4to7Box.cols), height: getPX(part4to7Box.height) };
    layout.part5_normal = { width: getPX(part4to7Box.boxSize * part5.cols), height: getPX(part4to7Box.height), transition: 'transform 0.3s' };

    // part6
    const part67Top = part1Box.height + part3Box.height + part4to7Box.height + padding2;
    part6.boxSize = part4to7Box.boxSize;
    part6.cols = Math.max(part6.cols, part4to7Box.cols);
    part6.wrapCols = part4to7Box.cols;
    part6.width = part4to7Box.boxSize * part6.cols;
    part6.height = part4to7Box.height;
    layout.part6 = {
      position: 'absolute',
      top: getPX(part67Top),
      left: getPX(padding),
      width: getPX(part4to7Box.width),
      height: getPX(part4to7Box.height)
    };
    layout.part6_content = { width: getPX(part4to7Box.boxSize * part4to7Box.cols), height: getPX(part4to7Box.height) };
    layout.part6_normal = { width: getPX(part4to7Box.boxSize * part6.cols), height: getPX(part4to7Box.height), transition: 'transform 0.3s' };

    // part7
    part7.boxSize = part4to7Box.boxSize * 2;
    part7.wrapCols = Math.ceil(part4to7Box.cols / 2);
    part7.cols = Math.max(part7.cols, part7.wrapCols);
    part7.width = part7.boxSize * part7.cols;
    part7.height = part4to7Box.height;
    layout.part7 = {
      position: 'absolute',
      top: getPX(part67Top),
      right: getPX(padding),
      width: getPX(part4to7Box.width),
      height: getPX(part4to7Box.height)
    };
    layout.part7_content = { width: getPX(part7.boxSize * part7.wrapCols), height: getPX(part4to7Box.height) };
    layout.part7_normal = { width: getPX(part7.boxSize * part7.cols), height: getPX(part4to7Box.height), transition: 'transform 0.3s' };
  };

  useListenResize(execLayout);

  onBeforeMount(() => {
    execLayout();
  });

  const setPartCols = (part, num) => {
    const newCols = Math.max(num, part.wrapCols);
    if (part.cols === newCols) return;
    part.cols = newCols;
    part.width = part.boxSize * part.cols;
    part.translate = (part.cols - part.wrapCols) * part.boxSize;
    const name = part.layout + '_normal';
    layout[name] = { ...layout[name], width: getPX(part.boxSize * part.cols), transform: `translateX(-${part.translate}px)` };
  };

  return { layout, part1, part3, part4, part5, part6, part7, setPartCols };
}
