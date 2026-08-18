// use color_art::Color;

pub fn fix(mut hex: String) -> String {
    let missing = 6 - hex.len();

    for _ in 0..missing {
        hex.push('0');
    }

    hex
}

// Turns out Discord just creates a black overlay with color #00000099
// instead of calculating the overlaid color ...

// pub fn add_black_overlay(color: &str, alpha: f32) -> String {
//     let poopy = Color::from_hex(color).unwrap();
//
//     let red = poopy.red() as f32 * (1.0 - alpha);
//     let green = poopy.green() as f32 * (1.0 - alpha);
//     let blue = poopy.blue() as f32 * (1.0 - alpha);
//
//     Color::from_rgb(red as u8, green as u8, blue as u8)
//         .unwrap()
//         .hex()
// }
//
// pub fn add_white_overlay(color: &str, alpha: f32) -> String {
//     let poopy = Color::from_hex(color).unwrap();
//
//     let red = (poopy.red() + (255 - poopy.red())) as f32 * alpha;
//     let green = (poopy.green() + (255 - poopy.green())) as f32 * alpha;
//     let blue = (poopy.blue() + (255 - poopy.blue())) as f32 * alpha;
//
//     Color::from_rgb(red as u8, green as u8, blue as u8)
//         .unwrap()
//         .hex()
// }
