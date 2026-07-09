/**
 * sync-data.js - 自动同步 data.json 到 index.html
 * 由 GitHub Actions 触发，当 data.json 变化时自动更新 index.html 中的内联数据
 */
const fs = require('fs');

const dataContent = fs.readFileSync('data.json', 'utf8').trim();
let html = fs.readFileSync('index.html', 'utf8');

const startMarker = '/* ====== 接口数据（由 GitHub Actions 自动同步，请勿手动修改，请编辑 data.json）====== */';
const endMarker = '/* ====== 接口数据结束 ====== */';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx < 0 || endIdx < 0) {
  console.error('ERROR: 未找到接口数据标记，请检查 index.html');
  process.exit(1);
}

const fullEnd = endIdx + endMarker.length;
const newBlock = startMarker + '\r\nvar SITE_DATA = ' + dataContent + ';\r\n' + endMarker;

html = html.substring(0, startIdx) + newBlock + html.substring(fullEnd);
fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ data.json 已同步到 index.html');
