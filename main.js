const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
"use strict";

let win

function createWindow() {

    // Your GitHub Applications Credentials
    var options = {
        client_id: 'c3558e1509b0378b5ff8',
        client_secret: 'a491f6d2c433428c712287048376ac15d66bbefe',
        scopes: ["user:email"]
    };

// Build the OAuth consent page URL
    var authWindow = new BrowserWindow({width: 800, height: 600, show: false, 'node-integration': false});
    var githubUrl = 'https://github.com/login/oauth/authorize?';
    var authUrl = githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes;
    authWindow.loadURL(authUrl);
    authWindow.show();

    function handleCallback(url) {
        var raw_code = /code=([^&]*)/.exec(url) || null;
        var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
        var error = /\?error=(.+)$/.exec(url);

        if (code || error) {
            // Close the browser if code found or error
            authWindow.destroy();
        }

        // If there is a code, proceed to get token from github
        if (code) {
            // self.requestGithubToken(options, code);
        } else if (error) {
            alert('Oops! Something went wrong and we couldn\'t' +
                'log you in using Github. Please try again.');
        }
    }

// Handle the response from GitHub - See Update from 4/12/2015

    authWindow.webContents.on('will-navigate', function (event, url) {
        handleCallback(url);
    });

    authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
        handleCallback(newUrl);
    });

// Reset the authWindow on close
    authWindow.on('close', function () {
        authWindow = null;
    }, false);

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

