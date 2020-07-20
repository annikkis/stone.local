module.exports = function (src, options) {
  const attrs = Object.keys(options.hash)
    .map((key) => ` ${key}="${options.hash[key]}"`)
    .join('');

  return `<img src="${src}"${attrs}>`;
};
