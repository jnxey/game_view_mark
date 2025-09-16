Number.prototype.toFixedCache = Number.prototype.toFixed; // 缓存原来的

/// 适配toFixed
Number.prototype.toFixed = function (decimals, rNumber = true) {
  const result = Math.round(this * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return rNumber ? result : result.toFixedCache(decimals);
};
