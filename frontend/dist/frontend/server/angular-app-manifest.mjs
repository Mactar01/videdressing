
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "preload": [
      "chunk-QEUC43U4.js",
      "chunk-WIWEXW75.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-PQBUOUA2.js",
      "chunk-5UW6KBPF.js"
    ],
    "route": "/listing/*"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-QNQPANI4.js",
      "chunk-FRQQ4II4.js"
    ],
    "route": "/search"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-IHRBZKHT.js",
      "chunk-FRQQ4II4.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-A2F3TVAX.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-ZEDYGH7C.js",
      "chunk-WIWEXW75.js",
      "chunk-FRQQ4II4.js"
    ],
    "route": "/dashboard/create"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-DDDAKJSD.js",
      "chunk-5UW6KBPF.js",
      "chunk-FRQQ4II4.js"
    ],
    "route": "/dashboard/inbox"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-DDDAKJSD.js",
      "chunk-5UW6KBPF.js",
      "chunk-FRQQ4II4.js"
    ],
    "route": "/dashboard/inbox/*"
  },
  {
    "renderMode": 0,
    "route": "/dashboard/favorites"
  },
  {
    "renderMode": 0,
    "route": "/admin/dashboard"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 2343, hash: '8e67629f5a87ea0dbbdb27213854834b821548cb937c57514e539f4fcde8f1a9', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1099, hash: '6a5be71fb340b4c6bfc7b55cb082238d44d58935f104a66db6e05684b7c1e704', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-YGMS2FLQ.css': {size: 33768, hash: 'lU8fBG9lHLQ', text: () => import('./assets-chunks/styles-YGMS2FLQ_css.mjs').then(m => m.default)}
  },
};
