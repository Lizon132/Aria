const {app, BrowserWindow} = require('electron');
const path = require('path');
// const url = require('url')

let mainWindow = null
let mainWindowWidth = 800
let mainWindowHeight = 800 
let DevToolsBool = false

function createWindow(filepath) {

    mainWindow = new BrowserWindow({
        width: mainWindowWidth,
        height: mainWindowHeight,
        webPreferences: {
            nodeIntegration: true, // Disable Node.js integration
            contextIsolation: true, // Enable context isolation
            preload: path.join(__dirname, 'preload.js'), // Preload script
        },
    });

    // loadfile at path
    // mainWindow.webContents.loadFile(filepath)
    mainWindow.loadURL('http://localhost:3000/');
    DevToolsBool && mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
      })
}


app.on('ready', () => {
    createWindow("src\\index.js")
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
    app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})