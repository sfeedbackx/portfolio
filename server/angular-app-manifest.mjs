
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/portfolio/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/portfolio"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6469, hash: '5d62975a0d908ef8804fd6c16487e715ece9c0ba1dae975127224aa545d9bd43', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1016, hash: '1da2775c94c0a32fadba1d2f318b8c03321fbc47363ffa098fe3c239102e30fe', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 11693, hash: '9654795dc926f89057ab91870b8ddb299e6c93c7bd428d0575ae9441866a1815', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-I4GTDYKK.css': {size: 12075, hash: 'fGvZmZUITU8', text: () => import('./assets-chunks/styles-I4GTDYKK_css.mjs').then(m => m.default)}
  },
};
