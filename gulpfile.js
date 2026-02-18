const { src, dest } = require('gulp');

function buildIcons() {
  return src('src/**/*.{png,svg}').pipe(dest('dist'));
}

function copyNodeJson() {
  return src('src/**/*.node.json').pipe(dest('dist'));
}

exports['build:icons'] = buildIcons;
exports['build:nodeJson'] = copyNodeJson;
exports['build:all'] = require('gulp').series(buildIcons, copyNodeJson);
