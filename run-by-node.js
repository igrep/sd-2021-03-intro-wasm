const fs = require('fs');
const wasm = require('./pkg-node/sd_2021_03_intro_wasm.js');

const inPath = process.argv[2];
const outPath = process.argv[3];

const base64 = fs.readFileSync(inPath, 'base64');
const data = base64.replace(/^data:image\/(png|jpg);base64,/, "");
const img = wasm.PhotonImage.new_from_base64(data);
const appliedFilter = wasm.apply_some_filter(img);
console.log(`Applied filter: ${appliedFilter}`);
const outData = img.get_base64().replace(/^data:image\/\w+;base64,/, '');
fs.writeFileSync(outPath, outData, 'base64');
