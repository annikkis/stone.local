module.exports = function (icon, options) {
  const attrs = Object.keys(options.hash)
    .map((key) => ` ${key}="${options.hash[key]}"`)
    .join('');

  return `<svg${attrs}><use xlink:href="img/icon.svg#${icon}"></use></svg>`;
};
