import * as fs from "fs";
import * as yaml from "js-yaml";
import {EventEmitter} from "events";

let configuration = null;
let fileName = null;

export function load(file: string): Promise<{}> {
	return new Promise<string>((resolve, reject) => {
		fileName = file;
		fs.readFile(file, {
			encoding: "utf-8",
			flag: "r",
		}, (error: Error, data: string) => {
			if (error) {
				reject(error);
				return;
			}
			configuration = yaml.safeLoad(data, {
					filename: file,
					onWarning: (warning: string) => console.log(warning),
				} as any) || {};
			watcher.emit("load", configuration);
			resolve();
		});
	});
}

export function set(key: string, value: any): Promise<{}> {
	return new Promise((resolve, reject) => {
		if (configuration === null) {
			reject(new Error("Configuration has not been loaded"));
			return;
		}
		if (configuration[key] !== value) {
			configuration[key] = value;
			watcher.emit("change", key, value);
		}
		save();
		resolve();
	});
}

export function get(key: string, defaultValue?: any): Promise<string> {
	return new Promise((resolve, reject) => {
		if (configuration === null) {
			reject(new Error("Configuration has not been loaded"));
			return;
		}
		if (typeof configuration[key] === "undefined") {
			set(key, defaultValue).then(() => {
				resolve(defaultValue);
			});
		}
		else {
			resolve(configuration[key]);
		}
	});
}

export function save(file?: string): Promise<{}> {
	return new Promise((resolve, reject) => {
		if (!fileName || configuration === null) {
			reject(new Error("Will not save configuration"));
			return;
		}
		fs.writeFile(file || fileName, yaml.safeDump(configuration), {
			encoding: "utf8",
		}, (error: Error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	})
}

class ConfigurationWatcher extends EventEmitter {
}
export var watcher = new ConfigurationWatcher();
