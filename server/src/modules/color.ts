import tinycolor from "tinycolor2";

export default class color {
	public static fix(hex: string): string {
		const missing = 6 - hex.length;

		for (let i = 0; i < missing; i++) {
			hex = "0" + hex;
		}

		return hex;
	}

	public static addBlackOverlay(color: any, overlayOpacity: number): string {
		// Parse the input color with tinycolor2
		const inputColor = tinycolor(color);

		// Get the RGB object of the input color
		const inputColorRgb = inputColor.toRgb();

		// Calculate the new RGB values by blending with the black overlay
		const newColorRgb = {
			r: inputColorRgb.r * (1 - overlayOpacity),
			g: inputColorRgb.g * (1 - overlayOpacity),
			b: inputColorRgb.b * (1 - overlayOpacity),
		};

		// Create a new tinycolor instance with the modified RGB values
		const newColor = tinycolor(newColorRgb);

		// Return the new color in a desired format (e.g., HEX, RGB, HSL)
		return newColor.toHexString();
	}

	public static addWhiteOverlay(color: any, overlayOpacity: number): string {
		// Parse the input color with tinycolor2
		const inputColor = tinycolor(color);

		// Get the RGB object of the input color
		const inputColorRgb = inputColor.toRgb();

		// Calculate the new RGB values by blending with the white overlay
		const newColorRgb = {
			r: inputColorRgb.r + (255 - inputColorRgb.r) * overlayOpacity,
			g: inputColorRgb.g + (255 - inputColorRgb.g) * overlayOpacity,
			b: inputColorRgb.b + (255 - inputColorRgb.b) * overlayOpacity,
		};

		// Create a new tinycolor instance with the modified RGB values
		const newColor = tinycolor(newColorRgb);

		// Return the new color in a desired format (e.g., HEX, RGB, HSL)
		return newColor.toHexString();
	}

	public static getColorFromGradientPoint(
		color1: any,
		color2: any,
		point: number,
	): string {
		return tinycolor.mix(color1, color2, point * 100).toHexString();
	}
}
