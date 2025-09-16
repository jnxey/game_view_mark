/**
 * 将透明颜色转换为与白色背景混合后的不透明颜色
 * @param {string} color - 输入颜色（支持 HEX/RGB/RGBA/HSL/HSLA）
 * @returns {string} 不透明的 RGB 颜色字符串（如 "rgb(255, 128, 64)"）
 */
export function convertTransparentToOpaque(color) {
  // 解析颜色为 RGBA 值
  const parsed = parseColor(color);

  // 如果颜色本身不透明，直接返回 RGB 格式
  if (parsed.a === 1) return `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`;

  // 白色背景混合计算（假设背景为白色）
  const r = Math.round(parsed.r * parsed.a + 255 * (1 - parsed.a));
  const g = Math.round(parsed.g * parsed.a + 255 * (1 - parsed.a));
  const b = Math.round(parsed.b * parsed.a + 255 * (1 - parsed.a));

  return `rgb(${r}, ${g}, ${b})`;
}

// 颜色解析器（支持常见格式）
export function parseColor(color) {
  color = color.trim().toLowerCase();

  // HEX 格式
  if (/^#[\da-f]{3,8}$/i.test(color)) {
    let hex = color.replace('#', '');
    if (hex.length === 3 || hex.length === 4) {
      hex = [...hex].map((c) => c + c).join('');
    }
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
      a: hex.length >= 8 ? parseInt(hex.substr(6, 2), 16) / 255 : 1
    };
  }

  // RGB/RGBA 格式
  const rgbMatch = color.match(/^rgba?\((\d+%?),(\d+%?),(\d+%?)(,([\d.]+))?\)$/);
  if (rgbMatch) {
    const parseValue = (val) => (val.includes('%') ? Math.round(parseFloat(val) * 2.55) : parseInt(val));

    return {
      r: parseValue(rgbMatch[1]),
      g: parseValue(rgbMatch[2]),
      b: parseValue(rgbMatch[3]),
      a: rgbMatch[5] ? parseFloat(rgbMatch[5]) : 1
    };
  }

  // HSL/HSLA 格式
  const hslMatch = color.match(/^hsla?\((\d+),(\d+)%?,(\d+)%?(,([\d.]+))?\)$/);
  if (hslMatch) {
    const [h, s, l, a] = [hslMatch[1], hslMatch[2], hslMatch[3], hslMatch[5] || 1];
    return hslToRgb(h, s, l, a);
  }

  throw new Error(`Unsupported color format: ${color}`);
}

/**
 * 将指定颜色转换为固定透明度的 RGBA 格式
 * @param {string} color - 输入颜色（支持 HEX、RGB、HSL 等格式）
 * @param {number} opacity - 透明度（0 到 1 之间）
 * @returns {string} - 返回 RGBA 格式的颜色
 */
export function getColorWithOpacity(color, opacity) {
  // 创建一个临时的 div 元素，用于计算颜色值
  const tempDiv = document.createElement('div');
  tempDiv.style.color = color;
  document.body.appendChild(tempDiv);

  // 获取计算后的 RGB 值
  const computedColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);

  // 提取 RGB 值
  const rgbValues = computedColor.match(/\d+/g); // 提取数字部分
  if (!rgbValues || rgbValues.length < 3) {
    throw new Error('Invalid color format');
  }

  const [r, g, b] = rgbValues;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// HSL 转 RGB 辅助函数
function hslToRgb(h, s, l, a) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: parseFloat(a)
  };
}
