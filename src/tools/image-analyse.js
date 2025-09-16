/**
 * 获取图片文件的主体颜色，以及尺寸信息，取图片四边中间1-100像素的值，进行判断
 * @param {File} file - 图片文件对象
 * @param {Function} callback - 回调函数，返回主体颜色，以及尺寸信息
 * @param {number} [quality=10] - 处理精度(1-100)
 */
export function execImageAnalyse(file, callback, quality = 10) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();
    img.src = e.target.result;

    img.onload = function () {
      // 创建Canvas处理图像
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const scale = Math.min(1, Math.max(0.1, quality / 100)); // 最低10%精度

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      try {
        // 获取边缘区域作为背景色参考
        const edgePixels = getEdgePixels(ctx, canvas.width, canvas.height);
        const colorName = analyzeEdgeColors(edgePixels);
        callback({ width: img.width, height: img.height, color: colorName });
      } catch (e) {
        console.error('处理失败:', e);
        callback({ width: img.width, height: img.height });
      }
    };
  };

  reader.readAsDataURL(file);
}

// 修改后的边缘像素获取函数
function getEdgePixels(ctx, width, height) {
  const edgeSize = Math.min(100, Math.max(1, width * 0.1, height * 0.1));

  const pixels = [];

  // 定义采样区域（排除四角）
  const regions = [
    { x: edgeSize, y: 0, w: width - 2 * edgeSize, h: edgeSize }, // 顶部中间
    { x: edgeSize, y: height - edgeSize, w: width - 2 * edgeSize, h: edgeSize }, // 底部中间
    { x: 0, y: edgeSize, w: edgeSize, h: height - 2 * edgeSize }, // 左侧中间
    { x: width - edgeSize, y: edgeSize, w: edgeSize, h: height - 2 * edgeSize } // 右侧中间
  ];

  regions.forEach((region) => {
    const data = ctx.getImageData(region.x, region.y, region.w, region.h).data;
    for (let i = 0; i < data.length; i += 16) {
      // 每4个像素采样1个
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // 透明度过滤
      if (a > 60) pixels.push([r, g, b]);
    }
  });

  return pixels;
}

// 分析边缘颜色特征
function analyzeEdgeColors(pixels) {
  if (pixels.length === 0) return 'other';

  const colorStats = {
    hueBuckets: new Array(12).fill(0), // 30度为一个色相区间
    saturationSum: 0,
    lightnessSum: 0,
    count: pixels.length
  };

  // 统计颜色特征
  pixels.forEach(([r, g, b]) => {
    const hsl = rgbToHsl(r, g, b);
    const hue = Math.floor(hsl[0] * 12); // 0-11
    colorStats.hueBuckets[hue]++;
    colorStats.saturationSum += hsl[1];
    colorStats.lightnessSum += hsl[2];
  });

  // 判断颜色类型
  const avgSaturation = colorStats.saturationSum / colorStats.count;
  const avgLightness = colorStats.lightnessSum / colorStats.count;

  // 低饱和度判断
  if (avgSaturation < 0.2) {
    return avgLightness > 0.7 ? 'white' : avgLightness < 0.3 ? 'black' : 'grey';
  }

  // 获取主色相
  const maxHue = colorStats.hueBuckets.indexOf(Math.max(...colorStats.hueBuckets));
  return getColorNameByHue(maxHue * 30, avgSaturation, avgLightness); // 转换为0-360度
}

// 修正后的色相名称映射表
const hueNameMap = [
  [0, 15, 'red'], // 0-15° (纯红色范围)
  [15, 40, 'orange'], // 调整橙色范围
  [40, 65, 'yellow'], // 精确黄色范围
  [65, 170, 'green'], // 扩展绿色范围
  [170, 200, 'cyan'], // 精确青色范围
  [200, 250, 'blue'], // 扩展蓝色范围 (原195-240 → 200-250)
  [250, 280, 'purple'], // 调整紫色起始点
  [280, 330, 'pink'], // 缩小粉色范围
  [330, 360, 'red'] // 确保红色完整闭环
];

// 增强版颜色判断逻辑
function getColorNameByHue(hue, saturation, lightness) {
  // 高饱和度颜色精确判断
  if (saturation > 0.7) {
    for (const [min, max, name] of hueNameMap) {
      if (hue >= min && hue < max) {
        return name;
      }
    }
  }

  // 低饱和度颜色处理
  if (lightness > 0.85) return 'white';
  if (lightness < 0.15) return 'black';
  if (saturation < 0.2) return 'grey';

  // 中饱和度颜色带亮度修饰
  let baseColor = 'other';
  for (const [min, max, name] of hueNameMap) {
    if (hue >= min && hue < max) {
      baseColor = name;
      break;
    }
  }

  // 添加亮度修饰词
  // if (lightness > 0.7) return `${baseColor}-dark`;
  // if (lightness < 0.3) return `${baseColor}-light`;
  return baseColor;
}

// RGB转HSL颜色空间（需要添加到代码中）
function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l]; // 返回[0-1, 0-1, 0-1]
}
