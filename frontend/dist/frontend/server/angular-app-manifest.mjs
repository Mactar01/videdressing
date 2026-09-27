
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "preload": [
      "chunk-J34KSEH4.js",
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
      "chunk-SQUHWRJJ.js",
      "chunk-S46CHRAH.js",
      "chunk-N2QWMYTK.js"
    ],
    "route": "/dashboard/inbox"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-SQUHWRJJ.js",
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
    'index.csr.html': {size: 2343, hash: '66127a29f4be061f53338219640daf7dc9eac2ffdeb0c42f136c38128f82ead4', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1099, hash: '465cd14bf0130a2cc6cc6cc21786f7ad84b9de664f415b91af424237c1af6b1d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-BT4WV7GX.css': {size: 39734, hash: 'gx85EJgbzy0', text: () => import('./assets-chunks/styles-BT4WV7GX_css.mjs').then(m => m.default)}
  },
};
