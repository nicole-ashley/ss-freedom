import {Config} from '@stencil/core';
import {sass} from '@stencil/sass';

export const config: Config = {
  namespace: 'ss-freedom',
  globalStyle: 'src/global/external.css',
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/global/shared.scss'
      ]
    })
  ],
  outputTargets: [{
    type: 'www',
    serviceWorker: null // disable service workers
  }]
};
