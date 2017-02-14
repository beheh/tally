import {Transform} from "stream";
import LocalGame from "./LocalGame";

const logLineRegExp = /^(D|W|E)\s*((\d+):(\d+):(\d+).(\d+))\s*((.+)\.(.+)\(\))\s*-(\s*)(.*)/;
const gameOverRegExp = /^TAG_CHANGE Entity=((GameEntity)|1) tag=STATE value=COMPLETE/;

export default class PowerLogParser extends Transform {

	private currentGame: LocalGame|null;
	private buffer: string;

	constructor() {
		super({objectMode: true, decodeStrings: false});
		this.currentGame = null;
	}

	protected _transform(chunk: any, encoding: string, callback: Function): void {
		const line: string = "" + chunk;
		const parsed = logLineRegExp.exec(line);
		if (!parsed) {
			console.error(`Invalid log line "${line}"`);
			return;
		}

		const timestamp = parsed[2];
		const className = parsed[8];
		const methodName = parsed[9];
		const indentation = parsed[10];
		const body = parsed[11];

		this.buffer += line;

		if (className === "GameState" && methodName === "DebugPrintPower") {

			const newGame = body.startsWith("CREATE_GAME");
			const gameOver = gameOverRegExp.test(body);

			if (gameOver && this.currentGame !== null) {
				this.currentGame.append(line, timestamp);
			}

			if (newGame || gameOver) {
				if (this.currentGame !== null) {
					this.push(this.currentGame);
					this.currentGame = null;
				}
			}

			if (!gameOver) {
				if (this.currentGame === null) {
					this.currentGame = new LocalGame(timestamp, newGame);
				}

				this.currentGame.append(line, timestamp);
			}
		}

		callback();
	}

	public flushGame(): void {
		this.push(this.currentGame);
		this.currentGame = null;
	}

	protected _flush(callback: Function): void {
		this.flushGame();
		callback();
	}
}
