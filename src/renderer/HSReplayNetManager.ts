import {EventEmitter} from "events";
import {
	HSReplayNetUser,
	CreateTokenResponse,
	CreateAccountClaimResponse,
	GetTokenDetailsResponse,
	ReplayMetadata,
	PrepareReplayResponse
} from "./interfaces";
import HSReplayNetClient from "./HSReplayNetClient";

export default class HSReplayNetManager extends EventEmitter {

	public client: HSReplayNetClient;
	public user: HSReplayNetUser|null;
	private _token;

	constructor(client: HSReplayNetClient) {
		super();
		this.client = client;
	}

	public get token(): string {
		return this._token;
	}

	public set token(token: string) {
		this._token = token;
		if (token) {
			this.getTokenDetails();
		}
	}

	public createToken(): Promise<string> {
		if (this.token) {
			throw new Error("Token already created");
		}
		return new Promise<string>((resolve, reject) => {
			this.client.createToken().then(
				(response: CreateTokenResponse) => {
					const token = response.key;
					this._token = token;
					this.emit("token", token, !!response.test_data);
					resolve(response.key);
				},
				reject
			);
		});
	}

	public getTokenDetails(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.client.getTokenDetails(this._token).then(
				(response: GetTokenDetailsResponse) => {
					this.user = response.user;
					resolve();
				},
				reject
			);
		});
	}

	public createAccountClaim(): Promise<string> {
		if (!this.token) {
			throw new Error("Cannot claim without token");
		}
		return new Promise((resolve: (a: any) => void, reject: (reason: any) => void) => {
			this.client.createAccountClaim(this._token).then(
				(response: CreateAccountClaimResponse) => {
					const claimUrl = response.full_url;
					this.emit("claim", claimUrl);
					resolve(claimUrl);
				},
				(reason: any) => {
					// maybe it was already claimed?
					this.getTokenDetails();
					reject(reason);
				}
			);
		});
	}

	public uploadReplay(log: string, metadata: ReplayMetadata): Promise<void> {
		if (!this.token) {
			throw new Error("Cannot upload replay without token");
		}
		return new Promise<void>((resolve) => {
			this.client.prepareReplay(this.token, metadata).then(
				(response: PrepareReplayResponse) => {
					console.log(response.url);
					return response.put_url;
				}
			).then((putUrl: string) => {
				return this.client.putReplay(putUrl, this.token, log);
			});
		});
	}
}
