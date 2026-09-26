
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
      "chunk-YN4O3JX7.js",
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
    'index.csr.html': {size: 2343, hash: '5c165d6d01ba61f93085e80ed17f30d18cbb58e52f7e2215c75c8d69a2c0678b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1099, hash: 'bad98b4eccf30852042220e5f4dff539bddf76a2aecf9141744bf6ffd89b3ddf', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-BT4WV7GX.css': {size: 39734, hash: 'gx85EJgbzy0', text: () => import('./assets-chunks/styles-BT4WV7GX_css.mjs').then(m => m.default)}
  },
};
