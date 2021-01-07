const fs = require('fs');
const wasm = require('./pkg-node/sd_2021_03_intro_wasm.js');

const inPath = process.argv[2];
const outPath = process.argv[3];

const inBuf = fs.readFileSync(inPath);
const img = wasm.image_from_array(inBuf);
const appliedFilter = wasm.apply_some_filter(img);
console.log(`Applied filter: ${appliedFilter}`);

// 書き込み後の画像のサイズより小さいとエラーになるので、
// 入力元の画像と同じくらいとっておく
const outBuf = Buffer.alloc(inBuf.length, 0, 'binary');
wasm.image_to_png_array(img, outBuf);
fs.writeFileSync(outPath, outBuf, 'binary');
