
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
      "chunk-KSMK5TZB.js",
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
      "chunk-YNRC4FV2.js",
      "chunk-FRQQ4II4.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-Y7O2CZPY.js"
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
      "chunk-N7QT72EC.js",
      "chunk-5UW6KBPF.js",
      "chunk-FRQQ4II4.js"
    ],
    "route": "/dashboard/inbox"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N7QT72EC.js",
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
    'index.csr.html': {size: 2343, hash: '338179a51147e20dc0b375eb88f7dcd44f67a56a5c462841f77fc5c021a33544', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1099, hash: 'a3d6bad03962ce6bb404462b4794f588594d7cdfda248d2c22f2a9390c72c170', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-YGMS2FLQ.css': {size: 33768, hash: 'lU8fBG9lHLQ', text: () => import('./assets-chunks/styles-YGMS2FLQ_css.mjs').then(m => m.default)}
  },
};
