// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, globalShortcut, clipboard, session } = require('electron')
const path = require('node:path')
// const { fork } = require('child_process');
// let envRenderer = {};  // Store the reference of the data in renderer process

async function main() {
  console.log('Version: ', process.versions);

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    x: 0,
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      session: session.fromPartition('persist:shanghaifanyuan613@gmail.com')
    },
  })

  // Load the index.html in project of the desktop app.
  await mainWindow.loadFile('index.html')

  // IPC event listener (Listen data from renderer process)
  ipcMain.handle("data-input", async (event, data) => {
    console.log("Received data from renderer: ", data);
  });

  // Open the DevTools. (Ctr + Shift + I)
  // mainWindow.webContents.openDevTools()

  mainWindow.webContents.on('did-finish-load', async () => {
    await delay(3000);
    // mainWindow.webContents.openDevTools();
  });
}

// Create the browser window
async function createWindow({ width, height, x, y, sessionName }) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      session: session.fromPartition(`persist:${sessionName}`)
    },
  })

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  main();

  // Register keyboard shortcuts to close browser windows when necessary
  // App electron close when press CommandOrControl+Shift+E
  globalShortcut.register('CommandOrControl+Shift+E', () => {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(window => {
      window.close();
    });
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Close global shortcuts when the app is about to quit
// Avoid the situation where the application cannot re-register the shortcut if reopened without first releasing resources.
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Function to delay the execution of the code
async function delay(time) {
  await new Promise(resolve => setTimeout(resolve, time));
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle('data-chat', async (event, data) => {
  if (data?.length > 0) {
    const res1 = await saveDataToDatabase(JSON.stringify(data))
    console.log('saveDataChat: ', res1)

    const res2 = await transformDataByChatgpt()
    console.log('transformDataChatByChatgpt: ', res2)
  }
});

ipcMain.handle('require-action', async (event, action) => {
  if (action === 'paste') {
    console.log('action: ', action)
    await executeAction({ type: action }, 1000)
  }
})
