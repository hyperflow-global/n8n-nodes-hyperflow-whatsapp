const { src, dest } = require('gulp');

function buildIcons() {
  return src(['credentials/**/*.{png,svg}', 'nodes/**/*.{png,svg}'], { base: '.' }).pipe(dest('dist'));
}

function copyNodeJson() {
  return src('nodes/**/*.node.json', { base: '.' }).pipe(dest('dist'));
}

exports['build:icons'] = buildIcons;
exports['build:nodeJson'] = copyNodeJson;
exports['build:all'] = require('gulp').series(buildIcons, copyNodeJson);
