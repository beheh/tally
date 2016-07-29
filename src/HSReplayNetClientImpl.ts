import {HSReplayNetClient, HSReplayNetUser} from "./interfaces";
import {request} from "https";
import {IncomingMessage} from "http";

export default class HSReplayNetClientImpl implements HSReplayNetClient {

	public endpoint:string = null;
	public port: number = 80;
	public api_key:string = null;

	private jsonRequest(resource:string, success:(payload:any) => void, error?:(details?:any) => void, method?:"POST" | "GET", additionalHeaders?:{[key:string]:any}):void {
		let headers = {
			"Accept": "application/json",
			"X-Api-Key": this.api_key,
		};
		if (additionalHeaders && typeof additionalHeaders === 'object') {
			let keys = Object.keys(additionalHeaders);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				headers[key] = additionalHeaders[key];
			}
		}
		let req = request({
			host: this.endpoint,
			port: this.port,
			path: "/api/v1/" + resource,
			method: method || "POST",
			headers: headers,
		}, (res:IncomingMessage) => {
			res.setEncoding('utf-8');
			let data = "";
			res.on('data', (chunk:string) => {
				data += chunk;
			});
			res.on('end', () => {
				if (res.statusCode.toString().startsWith("2")) {
					console.debug(data);
					success(JSON.parse(data));
					return;
				}
				if (res.statusCode.toString().startsWith("4")) {
					console.error(res.statusCode + " " + res.statusMessage + ":", JSON.parse(data));
				}
				error && error();
			})
		});
		req.end();
	}

	public requestToken(cb:(token:string)=>void):void {
		this.jsonRequest("tokens/", (payload:any) => cb(payload['key']));
	}

	public claimAccount(token:string, cb:(url:string)=>void):void {
		this.jsonRequest("claim_account/", (payload:any) => cb(payload['url']), null, null, {"Authorization": "Token " + token});
	}

	public queryToken(token:string, success:(user:HSReplayNetUser)=>void):void {
		this.jsonRequest("tokens/" + token + "/", (payload:any) => success(payload['user']), null, "GET");
	}
}
