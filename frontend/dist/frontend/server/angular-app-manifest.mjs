
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "preload": [
      "chunk-AFZVJS7D.js",
      "chunk-GCC4IBSJ.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-X4DB7GUM.js",
      "chunk-U5NM3YDG.js"
    ],
    "route": "/listing/*"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-SZZPWHGU.js",
      "chunk-ZTUWELHC.js"
    ],
    "route": "/search"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-2UZ7NFXA.js",
      "chunk-ZTUWELHC.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-ZZ3Q2C5M.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-4LMP4DRH.js",
      "chunk-GCC4IBSJ.js",
      "chunk-ZTUWELHC.js"
    ],
    "route": "/dashboard/create"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-OVCGNMDF.js",
      "chunk-U5NM3YDG.js",
      "chunk-ZTUWELHC.js"
    ],
    "route": "/dashboard/inbox"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-OVCGNMDF.js",
      "chunk-U5NM3YDG.js",
      "chunk-ZTUWELHC.js"
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
    'index.csr.html': {size: 2343, hash: '4732329c81d43cd6993b4a08cdf73c5e9de89a976c4443c0b19dbf70f85f508d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1099, hash: '8356eaa22d0eee4d9d6c711063d612500d86a2be633263a4edd3dbe005b5a375', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PFPBHG5A.css': {size: 33840, hash: 'FVN3WlcFGxk', text: () => import('./assets-chunks/styles-PFPBHG5A_css.mjs').then(m => m.default)}
  },
};
