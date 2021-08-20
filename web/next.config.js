module.exports = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://127.0.0.1:8000/:path*", // Proxy to Backend
            },
        ];
    },
    eslint: {
        // Warning: Dangerously allow production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ["cdn.discordapp.com"],
    },
};
