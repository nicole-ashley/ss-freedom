import {Config} from '@stencil/core';

export const config: Config = {
  namespace: 'ss-freedom',
  globalStyle: 'src/global/styles.css',
  outputTargets: [{
    type: 'www',
    serviceWorker: null // disable service workers
  }]
};
