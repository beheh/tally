export default class LocalGame {

	public readonly earliestTimestamp: string;
	public latestTimestamp;
	public readonly sinceStart: boolean;
	private _log: string[] = [];
	private _players: any[] = [];

	constructor(earliestTimestamp: string, newGame?: boolean) {
		this.earliestTimestamp = earliestTimestamp;
		this.sinceStart = newGame || false;
	}

	public get log() {
		return this._log.join("\n");
	}

	public get length(): number {
		return this._log.length;
	}

	public get players(): any[] {
		return this._players;
	}

	/*public get digest(): Promise<string> {
	 return new Promise((resolve, reject) => {
	 const hash = createHash("sha1");
	 hash.on("readable", () => {
	 resolve(hash.digest("hex"));
	 });
	 hash.write(this.log);
	 hash.end();
	 });
	 }*/

	public append(line: string, timestamp?: string) {
		this._log[this._log.length] = line;
		if (timestamp) {
			this.latestTimestamp = timestamp;
		}
	}
}
