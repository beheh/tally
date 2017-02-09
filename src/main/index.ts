import {app, BrowserWindow, ipcMain} from "electron";
import * as path from "path";
import tallyMenu from "./menu";
import * as Configuration from "./Configuration";
import {configurationFile} from "./constants";
import FileWatcher from "./FileWatcher";
import PowerLogParser from "./PowerLogParser";
import LocalGame from "./LocalGame";

// setup tasks
const configPromise = Configuration.load(configurationFile);
const readyPromise = new Promise((resolve, reject) => {
	ipcMain.on("ready-for-games", () => {
		resolve();
	});
});

// load window as soon as config and electron are ready
Promise.all([
	configPromise,
	new Promise((resolve, reject) => {
		app.on("ready", () => {
			resolve();
		});
	}),
]).then(() => {
	return createWindow();
}, (error: Error) => {
	console.error("Startup error:");
	console.error(error);
}).then(() => {
	// window ready
});

// initialize parser
const parser = new PowerLogParser();

// start log watching once config is ready
configPromise.then(() => {
	Configuration.get("logs").then((logs: string) => {
		const powerLog = path.join(logs, "Power.log");
		const watcher = new FileWatcher(powerLog);
		watcher.on("line", (line) => {
			parser.write(line);
		});
		readyPromise.then(() => {
			// check for missed replays
			watcher.startWatching(true);
		});
	});
});

parser.on("data", (game: LocalGame) => {
	if (!game.sinceStart) {
		// we're ignoring incomplete games for now
		return;
	}
	// send to renderer for upload
	mainWindow.webContents.send("game", {
		earliestTimestamp: game.earliestTimestamp,
		latestTimestamp: game.latestTimestamp,
		log: game.log,
	});
});

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow(): Promise<{}> {
	return new Promise((resolve, reject) => {
		// Create the browser window.
		mainWindow = new BrowserWindow({width: 800, height: 400, show: false});

		// and load the index.html of the app.
		mainWindow.loadURL("file://" + path.join(__dirname, "..", "renderer", "index.html"));

		// remove default menu bar
		//const menu = new Menu();
		mainWindow.setMenu(tallyMenu);

		// Open the DevTools.
		mainWindow.webContents.openDevTools();

		// Emitted when the window is closed.
		mainWindow.on("closed", () => {
			// Dereference the window object, usually you would store windows
			// in an array if your app supports multi windows, this is the time
			// when you should delete the corresponding element.
			mainWindow = null;
		});

		// don"t ever navigate away
		mainWindow.webContents.on("will-navigate", (e) => {
			e.preventDefault();
		});

		mainWindow.once("ready-to-show", () => {
			mainWindow.show();
		});

		mainWindow.once("show", () => {
			resolve();
		})
	});
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it"s common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
