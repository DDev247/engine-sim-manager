
const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('fs');
const http = require('http');
const https = require('https');
const decompress = require("decompress");
const { exec } = require('child_process');
const { platform } = require('os');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let server;
let startTime;
let launchedAsPkg = false;

const getUptime = () => {
    let time = (Date.now()-startTime)/1000;
    let timeMajor = (Date.now()-startTime)/1000;
    let useMajorTime = false;
    let timeUnit = "seconds";
    let majorTimeUnit = "seconds";
    
    if(time >= 60) {
        time %= 60; // how many seconds in a minute

        useMajorTime = true;
        timeMajor /= 60; // minutes        
        majorTimeUnit = "minutes";
    }

    if(timeMajor >= 60) {
        time %= 60; // how many minutes in the hour
        timeUnit = "minutes";
        
        useMajorTime = true;
        timeMajor /= 60; // minutes => hours
        majorTimeUnit = "hours";
    }

    let timeMajorString = Math.round(timeMajor).toString() + " " + majorTimeUnit + " ";

    return `Uptime: ${useMajorTime ? timeMajorString : ""}${Math.round(time)} ${timeUnit}`;
}

const requestListener = (request, response) => {
    console.log("[ SERVER ] Recieved request: origin: '" + request.headers.origin + "' path: '" + request.url + "'");
    //console.log(request.headers);
    
    try {
        let url = new URL(request.url, `http://${request.headers.host}`);

        switch (url.pathname) {
            case "/getFile":
                // Read file and return it
                fs.readFile(__dirname + "/" + url.searchParams.get('name'), (err, data) => {
                    if(err) {
                        response.writeHead(500, "Server Error", { 'Access-Control-Allow-Origin': '*' });
                        response.end("Server error: Error while reading file: '" + err.message + "'");
                        console.error("[ SERVER ] Server error: Error while reading file: '" + err.message + "'");
                        console.log("[ SERVER ] 500: Server Error");
                    }
                    else {
                        response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                        response.end(data);
                        console.log("[ SERVER ] 200: OK");
                    }
                });
                break;
            
            case "/saveFile":
                // Save file
                const data = atob(url.searchParams.get('data'));
                fs.writeFile(__dirname + "/" + url.searchParams.get('name'), data, (err) => {
                    if(err) {
                        response.writeHead(500, "Server Error", { 'Access-Control-Allow-Origin': '*' });
                        response.end("Server error: Error while writing file: '" + err.message + "'");
                        console.error("[ SERVER ] Server error: Error while writing file: '" + err.message + "'");
                        console.log("[ SERVER ] 500: Server Error");
                    }
                    else {
                        response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                        response.end("Written " + data.length + " characters.");
                        console.log("[ SERVER ] 200: OK");
                    }
                });
                break;

            case "/savePart":
                const saveFileName = __dirname + "/" + url.searchParams.get('name');
                https.get("https://catalog.engine-sim.parts/api/parts/" + url.searchParams.get('id'), (resp) => {
                    let data = '';

                    // a data chunk has been received.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                
                    // complete response has been received.
                    resp.on('end', () => {
                        const json = JSON.parse(data);
                        fs.promises.mkdir(path.dirname(saveFileName), {recursive: true}).then((x) => {
                            fs.writeFile(saveFileName, json.script, (err) => {
                                if(err) {
                                    response.writeHead(500, "Server Error", { 'Access-Control-Allow-Origin': '*' });
                                    response.end("Server error: Error while writing file: '" + err.message + "'");
                                    console.error("[ SERVER ] Server error: Error while writing file: '" + err.message + "'");
                                    console.log("[ SERVER ] 500: Server Error");
                                }
                                else {
                                    response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                                    response.end("Written " + json.script.length + " characters.");
                                    console.log("[ SERVER ] 200: OK");
                                }
                            });
                        });
                    });
                });
                break;

            case "/deleteFile":
                const deleteFileName = __dirname + "/" + url.searchParams.get('name');
                fs.rm(deleteFileName, (err) => {
                    if(err) {
                        response.writeHead(500, "Server Error", { 'Access-Control-Allow-Origin': '*' });
                        response.end("Server error: Error while deleting file: '" + err.message + "'");
                        console.error("[ SERVER ] Server error: Error while deleting file: '" + err.message + "'");
                        console.log("[ SERVER ] 500: Server Error");
                    }
                    else {
                        response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                        response.end("No response message.");
                        console.log("[ SERVER ] 200: OK");
                    }
                });
                break;

            case "/deleteDirectory" || "/deleteDir":
                const deleteDirectoryName = __dirname + "/" + url.searchParams.get('name');
                fs.rmdir(deleteDirectoryName, {recursive: true}, (err) => {
                    if(err) {
                        response.writeHead(500, "Server Error", { 'Access-Control-Allow-Origin': '*' });
                        response.end("Server error: Error while deleting directory: '" + err.message + "'");
                        console.error("[ SERVER ] Server error: Error while deleting directory: '" + err.message + "'");
                        console.log("[ SERVER ] 500: Server Error");
                    }
                    else {
                        response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                        response.end("No response message.");
                        console.log("[ SERVER ] 200: OK");
                    }
                });
                break;
            
            case "/downloadES":
                const link = url.searchParams.get('link');
                const dest = __dirname + "/es/packed/latest.zip";
                fs.promises.mkdir(path.dirname(dest), {recursive: true}).then((x) => {
                    exec("curl -L -o " + dest + " " + link, (error, stdout, stderr) => {
                        if(error) {
                            console.log("[ SERVER ] cURL stderr: " + stderr);

                            response.writeHead(500, "Server Error", { 'Access-Control-Allow-Origin': '*' });
                            response.end("Server error: Error while downloading: '" + error.message + "'");
                            console.error("[ SERVER ] Server error: Error while downloading: '" + error.message + "'");
                            console.log("[ SERVER ] 500: Server Error");
                        }
                        else {
                            console.log("[ SERVER ] cURL stdout: " + stdout);

                            response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                            response.end("No response message.");
                            console.log("[ SERVER ] 200: OK");
                        }
                    })
                });
                break;
            
            case "/unpackES":
                let from = url.searchParams.get('from');
		if (!from.startsWith("/"))
		    from = __dirname + "/" + from;
                const to = url.searchParams.get('to');
                decompress(from, __dirname + "/" + to, { strip:1 }).then((files) => {
                    console.log(files);
                    response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                    response.end("No response message.");
                    console.log("[ SERVER ] 200: OK");
                })
                break;

            case "/launchES":
                const dir = "engine-sim-app.exe";
                let command = "";
                let args = "";

                if(platform == 'win32') {
                    command = "cd es/latest/bin/ &&";

                    if(url.searchParams.get("args") === "12a")
                        args = " ../assets/main.mr";

                    console.log("[ SERVER ] Launching '" + command + dir + args + "' on platform '" + platform + "'");
                    exec(command + dir + args,{
                         cwd: __dirname
		    }, (error, stdout, stderr) => {
                        if(error) {
                            console.log(stderr);
                        }
                        console.log(stdout);
                    });
                }
                else if(platform == 'linux' || platform == 'darwin') {
                    const run = () => {
                        command = "sh ./runWine.sh";

                        if(url.searchParams.get("args") === "12a")
                            args = " ../assets/main.mr";

                        console.log("[ SERVER ] Launching '" + command + args + "' on platform '" + platform + "'");
                        exec(command + args, {
                            cwd: __dirname
                        }, (error, stdout, stderr) => {
                            if(error) {
                                console.log(stderr);
                            }
                            console.log(stdout);
                        });
                    }

                    if(!fs.existsSync(__dirname + "/setup.txt")) {
                        // create prefix
                        exec("sh ./setupWine.sh", {
			    cwd: __dirname
			}, (error, stdout, stderr) => {
                            if(error) {
                                console.log(stderr);
                            }
                            console.log(stdout);
                            run();
                        });
                    }
                    else {
                        run();
                    }
                }

                response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                response.end("No response message.");
                console.log("[ SERVER ] 200: OK");

                break;

            case "/status":
                response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                response.end(
                    `Server: Node.js ${process.version} Electron ${process.electron}
                    Server configuration: ESMBS (Engine Simulator Manager Backend Server)
                    \nAvailable commands (prefix: '/'): 'status', 'deleteDirectory', 'deleteDir', 'deleteFile', 'saveFile', 'savePart', 'getFile'`
                    );
                console.log("[ SERVER ] 200: OK");
                break;

            case "/uptime":
                response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                response.end("Uptime: " + getUptime());
                break;

            case "/getFolder":
                const name = url.searchParams.get('name');
                fs.readdir(__dirname + "/" + name, (err, files) => {
                    if(err) {
                        response.writeHead(500, "Server Error", { 'Access-Control-Allow-Origin': '*' });
                        response.end("Server error: Error while deleting directory: '" + err.message + "'");
                        console.error("[ SERVER ] Server error: Error while deleting directory: '" + err.message + "'");
                        console.log("[ SERVER ] 500: Server Error");
                    }
                    else {
                        response.writeHead(200, "OK", { 'Access-Control-Allow-Origin': '*' });
                        response.end(JSON.stringify(files));
                        console.log(files);
                        console.log("[ SERVER ] 200: OK");
                    }
                });
                break;
            
            default:
                response.writeHead(400, "Unknown command", { 'Access-Control-Allow-Origin': '*' });
                response.end("Server error: unknown command '" + url.pathname + "'");
                console.error("[ SERVER ] Server error: unknown command '" + url.pathname + "'");
                console.log("[ SERVER ] 400: Unknown command");
                break;
        }

    } catch (error) {
        response.writeHead(500, "Server Error", { 'Access-Control-Allow-Origin': '*' });
        response.end("Server error: '" + error + "'");
        console.error("[ SERVER ] Server error: " + error);
        console.log("[ SERVER ] 500: Server Error");
    }

    console.log("[ SERVER ] Response sent.");
}

function createWindow() {
    installedAsPkg = process.argv[0] == "/usr/bin/esmanager" || process.argv[0] == "esmanager";
    if(process.platform != "linux")
	installedAsPkg = false;


    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
    });

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '/build/index.html'),
            protocol: 'file:',
            slashes: true
        });

    mainWindow.loadFile("index.html").then(() => {
        let code = `
            const REACT_URL = '${startUrl}';
            const DEVELOPER = '${process.env.ELECTRON_DEV}';
            loaded();
        `;
        
        mainWindow.webContents.executeJavaScript(code);
    });

    fs.promises.mkdir(__dirname + "/es", {recursive: true});

    server = http.createServer(requestListener);

    // Open the DevTools.
    if(process.env.ELECTRON_DEV === 'inspect')
        mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
        console.log("[ SERVER ] Closing server...");
        server.close();
    });
    
    console.log("[ SERVER ] Listening on port: 24704");
    startTime = Date.now();
    server.listen(24704);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
