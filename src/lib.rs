extern crate image;
extern crate photon_rs;
extern crate rand;
extern crate wasm_bindgen;

use image::{DynamicImage, ImageBuffer, ImageFormat};
use photon_rs::{filters::filter, PhotonImage};
use rand::seq::SliceRandom;
use wasm_bindgen::prelude::wasm_bindgen;

// ブラウザー・Node.js共通のコード
const FILTERS: &[&str] = &[
    "oceanic",
    "islands",
    "marine",
    "seagreen",
    "flagblue",
    "liquid",
    "diamante",
    "radio",
    "twenties",
    "rosetint",
    "mauve",
    "bluechrome",
    "vintage",
    "perfume",
    "serenity",
];

#[wasm_bindgen]
pub fn apply_some_filter(mut img: &mut PhotonImage) -> String {
    let mut rng = rand::thread_rng();
    let chosen = FILTERS
        .choose(&mut rng)
        .expect("Can't choose a filter name!");
    filter(&mut img, chosen);
    chosen.to_string()
}

// Node.js 向けの関数 //

// photonに直接依存するのを避けるためのラッパー
// arrayのサイズが出力される画像のサイズより小さいとエラーになってしまうので注意！
#[wasm_bindgen]
pub fn image_from_array(array: &[u8]) -> PhotonImage {
    PhotonImage::new_from_byteslice(array.to_vec())
}

#[wasm_bindgen]
pub fn image_to_png_array(img: PhotonImage, mut array: &mut [u8]) {
    let raw_pixels = img.get_raw_pixels();
    let width = img.get_width();
    let height = img.get_height();

    let img_buffer = ImageBuffer::from_vec(width, height, raw_pixels).unwrap();
    let dynimage = DynamicImage::ImageRgba8(img_buffer);

    // ファイル名にかかわらずPNG決め打ちなので注意！
    dynimage
        .write_to(&mut array, ImageFormat::Png)
        .expect("Failed to write image!");
}
