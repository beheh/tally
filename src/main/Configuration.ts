import {EventEmitter} from "events";
import * as fs from "fs";
import * as yaml from "js-yaml";

interface ConfigurationLayout {
	[key: string]: any;
}

let configuration: ConfigurationLayout|null = null;
let fileName: string|null = null;

export function load(file: string): Promise<void> {
	fileName = file;
	return new Promise<void>((resolve, reject) => {
		fs.exists(file, (exists: boolean) => {
			if (exists) {
				resolve();
			}
			else {
				reject(new Error("Configuration file does not exist"));
			}
		});
	}).then<void>(() => new Promise<void>((resolve, reject) => {
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
	})).catch((error) => {
		// continue with empty configuration
		configuration = {};
	});
}

export function set<T>(key: string, value: T): Promise<void> {
	return new Promise<void>((resolve, reject) => {
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

export function get<T>(key: string, defaultValue?: T): Promise<T> {
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

export function save(file?: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
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
	});
}

class ConfigurationWatcher extends EventEmitter {
}
export let watcher = new ConfigurationWatcher();
