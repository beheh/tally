import {HSReplayNetClient} from "./interfaces";
import {request} from "https";
import {IncomingMessage} from "http";

export default class HSReplayNetClientImpl implements HSReplayNetClient {

	public endpoint: string = null;
	public api_key: string = null;

	public requestToken(cb:(token:string)=>void): void {
		let req = request({
			host: "hsreplay.net",
			port: 443,
			path: "/api/v1/tokens/",
			method: "POST",
			headers: {
				"Accept": "application/json",
				"X-Api-Key": this.api_key,
			},
		}, (res: IncomingMessage) => {
			res.setEncoding('utf-8');
			let data = "";
			res.on('data', (chunk: string) => {
				data += chunk;
			});
			res.on('end', () => {
				let payload = JSON.parse(data);
				cb(payload['key']);
			})
		});
		req.end();
	}

	public claimAccount(token:string, cb:(url:string)=>void): void {
		let req = request({
			host: "hsreplay.net",
			port: 443,
			path: "/api/v1/claim_account/",
			method: "POST",
			headers: {
				"Accept": "application/json",
				"X-Api-Key": this.api_key,
				"Authorization": "Token " + token,
			},
		}, (res: IncomingMessage) => {
			res.setEncoding('utf-8');
			let data = "";
			res.on('data', (chunk: string) => {
				data += chunk;
			});
			res.on('end', () => {
				let payload = JSON.parse(data);
				cb(payload['url']);
			})
		});
		req.end();
	}

	public queryToken(token:string): void {

	}
}
