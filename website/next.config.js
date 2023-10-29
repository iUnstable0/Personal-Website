/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
	reactStrictMode: true,
	images: {
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "iunstable0.com",
				pathname: "/**",
			},
		],
	},
	sassOptions: {
		includePaths: [
			path.join(__dirname, "styles"),
			// path.join(__dirname, "components", "styles"),
			// path.join(__dirname, "components", "dashboard", "styles"),
			// path.join(__dirname, "components", "dashboard", "pages", "styles"),
		],
	},
};

module.exports = nextConfig;
