import * as Events from "events";
import * as fs from "fs";

/**
 * Watches a file using fs.watch.
 * @emits FileWatcher#line
 * @see See {@link https://nodejs.org/api/fs.html#fs_availability} for availability.
 */
export default class FileWatcher extends Events.EventEmitter {

	private _filename: string;
	private readonly separator: string;
	private watcher: fs.FSWatcher|null;
	private fd: number|null;
	private queueRead: boolean;
	private bookmark: number;
	private buffer: string;
	private reading: boolean;

	constructor(filename: string) {
		super();
		this._filename = filename;
		this.separator = "\n";
		this.watcher = null;
		this.fd = null;
		this.queueRead = false;
	}

	public set filename(filename: string) {
		if (filename === this._filename) {
			return;
		}
		this._filename = filename;
		if (this.watcher) {
			this.stopWatching();
			this.startWatching();
		}
	}

	public get filename(): string {
		return this._filename;
	}

	public startWatching(readExisting: boolean = false): void {
		this.bookmark = 0;
		this.buffer = "";
		this.reading = false;
		const watcher = fs.watch(this._filename);
		watcher.on("change", (eventType: string, filename: string|Buffer) => {
			if (eventType !== "change") {
				return;
			}
			this.read();
		});
		watcher.on("error", (error: Error) => {
			this.emit("error", error);
		});
		this.watcher = watcher;
		this.openFile(() => {
			if (readExisting) {
				this.read();
			}
			else {
				this.getAdditionalSize((size: number) => {
					this.bookmark += size;
				});
			}
		});
	}

	public stopWatching(): void {
		if (!this.watcher) {
			return;
		}
		this.watcher.removeAllListeners();
		this.watcher.close();
		this.closeFile();
		this.watcher = null;
	}

	protected read(size?: number, byPass: boolean = false): void {
		if ((this.reading && !byPass) || !this.fd) {
			this.queueRead = true;
			return;
		}

		this.reading = true;

		if (typeof size === "undefined") {
			this.getAdditionalSize((size: number) => {
				if (size) {
					this.read(size, true);
				}
			});
			return;
		}

		//do the reading
		fs.read(this.fd, new Buffer(size), 0, size, this.bookmark, (error: Error, bytesRead: number, buffer: Buffer) => {
			if (error) {
				this.emit("error", error);
				this.reading = false;
				return;
			}

			this.readBuffer(buffer);
			this.bookmark += bytesRead;
			this.reading = false;
		});
	}

	protected getAdditionalSize(callback: (size: number) => void): void {
		if (!this.fd) {
			throw new Error("Cannot get additional size without file descriptor");
		}

		// get the file length
		fs.fstat(this.fd, (error: Error, stats: fs.Stats) => {

			if (error) {
				this.emit("error", error);
				this.reading = false;
				return;
			}

			const start = this.bookmark;
			const end = stats.size;
			callback(end - start);
		});

	}

	protected openFile(callback?: () => void): void {
		fs.open(this._filename, "r", (error: Error, fd: number) => {
			if (error) {
				this.emit("error", error);
				return;
			}
			this.fd = fd;
			if (this.queueRead) {
				this.read();
			}
			if (callback) {
				callback();
			}
		});
	}

	protected closeFile(): void {
		if (!this.fd) {
			return;
		}
		fs.close(this.fd);
		this.fd = null;
	}

	protected readBuffer(buffer: Buffer): void {
		const lines = buffer.toString("utf-8");
		this.buffer += buffer;
		let pos = -1;
		while ((pos = this.buffer.indexOf(this.separator)) !== -1) {
			let line = this.buffer.slice(0, pos);
			this.buffer = this.buffer.slice(pos + 1);

			/**
			 * Line event.
			 *
			 * @event FileWatcher#line
			 * @type {string} line - The line, not including the separator.
			 */
			this.emit("line", line);
		}
	}
}
