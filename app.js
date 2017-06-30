const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let win
function createWindow() {
    win = new BrowserWindow({width: 800, height: 600, show: false, resizable: true})

    //load the index.html file
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    //open dev tools
    //win.webContents.openDevTools()
    win.on('closed', () => {
        win = null
    })
    win.once("ready-to-show", () => {
        win.show()
    })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
    //not macOS
    if(process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if(win === null) {
        createWindow()
    }
})

