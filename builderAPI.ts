import * as builder from 'electron-builder';

const opt: builder.CliOptions = {
  targets: builder.Platform.WINDOWS.createTarget(),
  config: {
    directories: {
      output: 'build1',
      // buildResources: `./`,
      // app: './dist'
    },
    buildVersion: '1.0.0',
    appId: 'com.myCompany.myApp',
    productName: 'myAppName',
    copyright: 'Copyright © 2019 myCompany',
    win: {
      artifactName: 'caisse.exe',
      asar: true,
      files: [
        '!./node_modules/@*',
        '!./build*',
        './dist/main.js',
        './dist/**/*'
      ],
      target: [
        {
          target: 'portable',
          // target: 'nsis-web',
          arch: [
            'ia32'
          ],
        }
      ],
      // icon: './src/favicon.ico'
    },
  },
};

builder.build(opt)
  .then(r => console.log('Build OK!', r))
  .catch(e => console.log(e));

