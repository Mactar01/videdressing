
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "preload": [
      "chunk-4FNINB2O.js",
      "chunk-ZROLPRGD.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-S32IEFIY.js",
      "chunk-S46CHRAH.js"
    ],
    "route": "/listing/*"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-26US23LZ.js",
      "chunk-N2QWMYTK.js"
    ],
    "route": "/search"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-ITM22RGC.js",
      "chunk-N2QWMYTK.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-TDLGA2M7.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-UQIKL66D.js",
      "chunk-ZROLPRGD.js",
      "chunk-N2QWMYTK.js"
    ],
    "route": "/dashboard/create"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-HHOP7JS2.js",
      "chunk-S46CHRAH.js",
      "chunk-N2QWMYTK.js"
    ],
    "route": "/dashboard/inbox"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-HHOP7JS2.js",
      "chunk-S46CHRAH.js",
      "chunk-N2QWMYTK.js"
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
    'index.csr.html': {size: 2343, hash: '5af75599ad13c63bca25d97d83f71496e032c5a6e79d6198e895821d8628ff18', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1099, hash: '946d0aa5cb20e60f1842297d3d5a5079ae930be8f1a1716c5922e56ba386982d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-BT4WV7GX.css': {size: 39734, hash: 'gx85EJgbzy0', text: () => import('./assets-chunks/styles-BT4WV7GX_css.mjs').then(m => m.default)}
  },
};
