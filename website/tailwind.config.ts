const { nextui } = require("@nextui-org/react");
import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			// backgroundImage: {
			//   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			//   "gradient-conic":
			//     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			// },
		},
	},
	darkMode: "class",
	plugins: [nextui()],
};
export default config;

// // tailwind.config.js
// const { nextui } = require("@nextui-org/react");
//
// /** @type {import('tailwindcss').Config} */
// module.exports = {
// 	content: [
// 		"./app/**/*.{js,ts,jsx,tsx,mdx}",
// 		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
// 		"./components/**/*.{js,ts,jsx,tsx,mdx}",
//
// 		// Or if using `src` directory:
// 		"./src/**/*.{js,ts,jsx,tsx,mdx}",
// 		// ...
// 		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
// 	],
// 	theme: {
// 		extend: {},
// 	},
// 	darkMode: "class",
// 	plugins: [nextui()],
// };
