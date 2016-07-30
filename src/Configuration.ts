import * as yaml from "js-yaml";
import * as fs from "fs";

export default class Configuration {
	private config: any[];

	public constructor(public file: string) {
		this.load();
	}

	protected load(): void {
		fs.closeSync(fs.openSync(this.file, "a"));
		this.config = yaml.safeLoad(fs.readFileSync(this.file, "utf8")) || {};
	}

	protected save(): void {
		fs.writeFileSync(this.file, yaml.safeDump(this.config), {encoding: "utf8"});
	}

	public get(key: string, defaultValue?: any): any {
		if(typeof this.config[key] !== "undefined") {
			return this.config[key];
		}
		if(typeof defaultValue !== "undefined") {
			this.set(key, defaultValue);
		}
		return defaultValue;
	}

	public set(key: string, value: any): void {
		this.config[key] = value;
		this.save();
	}
}
