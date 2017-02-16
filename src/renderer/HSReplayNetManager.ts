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
		return this.client.createToken().then(
			(response: CreateTokenResponse) => {
				const token = response.key;
				this._token = token;
				this.emit("token", token, !!response.test_data);
				return (response.key);
			}
		);
	}

	public getTokenDetails(): Promise<void> {
		if (!this.token) {
			throw new Error("Cannot get token details without token");
		}
		return this.client.getTokenDetails(this._token).then(
			(response: GetTokenDetailsResponse) => {
				this.user = response.user;
			}
		);
	}

	public createAccountClaim(): Promise<string> {
		if (!this.token) {
			throw new Error("Cannot claim without token");
		}
		return this.client.createAccountClaim(this._token).then(
			(response: CreateAccountClaimResponse) => {
				const claimUrl = response.full_url;
				this.emit("claim", claimUrl);
				return (claimUrl);
			},
			(error: Error) => {
				this.getTokenDetails();
				throw error;
			}
		);
	}

	public prepareReplay(metadata: ReplayMetadata): Promise<PrepareReplayResponse> {
		if (!this.token) {
			throw new Error("Cannot upload replay without token");
		}
		return this.client.prepareReplay(this.token, metadata);
	}

	public uploadReplay(log: string, metadata: ReplayMetadata): Promise<void> {
		if (!this.token) {
			throw new Error("Cannot upload replay without token");
		}
		return this.prepareReplay(metadata).then(
			(response: PrepareReplayResponse) => {
				this.client.putReplay(response.put_url, this.token, log);
			}
		);
	}
}
