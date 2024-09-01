/** @type {import('next').NextConfig} */
<<<<<<< HEAD

module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://api-dev.aictopusde.com/api/:path*', // 代理到目标API
            },
        ];
    },
};
=======
const nextConfig = {}

module.exports = nextConfig
>>>>>>> 0094435c05c11c83c1092fd7e2481f5413fa5406
