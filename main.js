const {app,BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const ipc=require('electron').ipcMain

let mainWindow

function create_mainwindow()
{
    mainWindow=new BrowserWindow({width:800,height:600});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'src/index.html'),
        protocol:'file',
        slashes: true
}))
    mainWindow.on('closed',()=>{mainWindow=null});
}

app.on('ready',create_mainwindow);

app.on('window-all-closed',()=>{app.quit()});
app.on('activate',()=>{
    if(win==null)
    {
        create_mainwindow()
    }
})