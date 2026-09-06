/**
 * sync-data.js - 自动同步 data.json 到 index.html
 * 由 GitHub Actions 触发，当 data.json 变化时自动更新 index.html 中的内联数据
 */
const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
let changed = false;

/* ── 同步 data.json（接口数据）── */
const dataContent = fs.readFileSync('data.json', 'utf8').trim();
const dataStartMarker = '/* ====== 接口数据（由 GitHub Actions 自动同步，请勿手动修改，请编辑 data.json）====== */';
const dataEndMarker = '/* ====== 接口数据结束 ====== */';
const dataStartIdx = html.indexOf(dataStartMarker);
const dataEndIdx = html.indexOf(dataEndMarker);

if (dataStartIdx < 0 || dataEndIdx < 0) {
  console.error('ERROR: 未找到接口数据标记，请检查 index.html');
  process.exit(1);
}

const dataFullEnd = dataEndIdx + dataEndMarker.length;
const newDataBlock = dataStartMarker + '\r\nvar SITE_DATA = ' + dataContent + ';\r\n' + dataEndMarker;

if (html.substring(dataStartIdx, dataFullEnd) !== newDataBlock) {
  html = html.substring(0, dataStartIdx) + newDataBlock + html.substring(dataFullEnd);
  changed = true;
  console.log('✅ data.json 已同步到 index.html');
} else {
  console.log('⏭️ data.json 无变化，跳过');
}

/* ── 写回文件 ── */
if (changed) {
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('✨ index.html 已更新');
} else {
  console.log('✨ index.html 无需更新');
}
