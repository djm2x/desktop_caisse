import { join } from 'path';
import * as url from 'url';
import * as fs from 'fs';
import { app, BrowserWindow, ipcMain, IpcMessageEvent, remote } from 'electron';
// import { AppRoute } from './api/appRoute';
// import { Repository } from 'api/repository';
// const { app, BrowserWindow, ipcMain  } = require('electron');

const PROD = 'production';
const DEV = 'development';
const ENVIRONMENT1 = process.env.ELECTRON_ENV || PROD;
const ENVIRONMENT = ENVIRONMENT1.toString();
const ANGULAR_SERVE = 'http://localhost:4200';
let mainWindow: Electron.BrowserWindow;

function createWindow() {
  console.log(ENVIRONMENT)
  // Initialize the window to our specified dimensions
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 700,
    transparent: true,
    frame: !ENVIRONMENT.match(PROD),
    // icon: __dirname + 'icon.png',
    webPreferences: {
      nodeIntegration: true
    }
  });
  // load the dist folder from Angular
  if (ENVIRONMENT.match(PROD)) {
    mainWindow.loadURL(`file://${join(__dirname, 'angular/index.html')}`);
    // mainWindow.loadURL(
    //   url.format({
    //     pathname: join(__dirname, `dist/angular/index.html`),
    //     protocol: 'file:',
    //     slashes: true
    //   })
    // );
  } else {
    mainWindow.loadURL(ANGULAR_SERVE);
  }

  // Show dev tools
  // Remove this line before distributing
  if (ENVIRONMENT.match(DEV)) {
    mainWindow.webContents.openDevTools();
  }

  // Remove window once app is closed
  mainWindow.on('closed', () => mainWindow = null);

  // routes();
  // dataBaseEvent();
  // toolbarEvent();
  activeDevToolsListner();

}

function activeDevToolsListner() {
  ipcMain.on('main', (event: IpcMessageEvent, r) => {
    console.log('request for devtools to be opened');
    console.log(r);
    mainWindow.webContents.openDevTools();
    // mainWindow.webContents.closeDevTools();
    mainWindow.webContents.send('page', 'i did click for you');
  });
}

// async function routes() {
//   const context = new DbContext();
//   await context.connect();

//   // const test = new TestController(context);
//   const test = new Repository('test');
//   // test.context = context;
//   const appRoute = new AppRoute();
//   // test.get().then(r => console.log(r));
//   appRoute.post('test/post', test);
//   appRoute.get('test/get', test);
//   appRoute.put('test/put', test);
//   appRoute.delete('test/delete', test);
//   appRoute.getById('test/getById', test);

// }


// async function dataBaseEvent() {
//   const channelMain = 'main';
//   const channelAngular = 'angular';
//   const context = new DbContext();
//   await context.connect();

//   ipcMain.on(channelMain, (event: IpcMessageEvent, req, params) => {
//     // console.log(req, params);
//     context.execQuery(req, params).then(
//       r => {
//         console.log('r >>>>>>>>>>');
//         // console.log(r);
//         mainWindow.webContents.send(channelAngular, r, null);
//         // event.sender.send(channelAngular, r);
//       }
//     ).catch((e) => {
//       console.log('e<<<<<<<<<<<<<<<<<<<<<<<<<<');
//       console.log(e);
//       event.sender.send(channelAngular, null, e);
//     });
//   });
// }



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
