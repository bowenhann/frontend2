/** @type {import('next').NextConfig} */

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
