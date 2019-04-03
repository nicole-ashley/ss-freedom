exports.config = {
  namespace: 'ss-freedom',
  globalStyle: 'src/global/page-augmentations.css',
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: false
    }
  ]
};
