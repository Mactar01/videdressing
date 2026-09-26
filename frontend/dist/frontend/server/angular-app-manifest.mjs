
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "preload": [
      "chunk-CTI6C7OD.js",
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
      "chunk-BS6ERSK2.js",
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
    'index.csr.html': {size: 2343, hash: 'a2c39d10e1adc15701f29ec0460a30bfd3aa52d16f62bf7ad415f867affe813a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1099, hash: '0da9df21595fa654e2bb3ac46a2e549910255f6c13a51663105254f1ff63024d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-BT4WV7GX.css': {size: 39734, hash: 'gx85EJgbzy0', text: () => import('./assets-chunks/styles-BT4WV7GX_css.mjs').then(m => m.default)}
  },
};
