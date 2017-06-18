const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const fs= require('fs')
const storage = require('electron-json-storage');
const Ajax = require('./Ajax.js');

let win

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600});

  win.loadURL('https://github.com/login/oauth/authorize?scope=user:email&client_id=c3558e1509b0378b5ff8');
  win.webContents.openDevTools()

  win.webContents.on('will-navigate',function(event,newUrl){

    console.log(newUrl);
    console.log(event);
});

  win.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    let gitCode = getParameterByName('code',newUrl);
    let name = '_token.json';
    let projectPath ='/home/nico/Projects/git-bakery';

    fs.writeFileSync(projectPath+'/token.json',JSON.stringify({
        token: gitCode
    }))

    console.log('Ajax');

});


  win.on('closed', () => {
    win = null
})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
