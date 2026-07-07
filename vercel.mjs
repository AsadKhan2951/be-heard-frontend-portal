const apiOrigin = (process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || '')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

export const config = {
  rewrites: [
    ...(apiOrigin
      ? [
          {
            source: '/api/:path*',
            destination: `${apiOrigin}/api/:path*`
          }
        ]
      : []),
    {
      source: '/(.*)',
      destination: '/index.html'
    }
  ]
};
