/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'wordfulness-avatars.s3.eu-central-1.amazonaws.com',
				port: '',
				pathname: '**',
			},
		],
	},
};

module.exports = nextConfig;
