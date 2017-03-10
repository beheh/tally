import {
	CreateAccountClaimResponse,
	CreateTokenResponse,
	GetTokenDetailsResponse,
	HSReplayNetClientInterface,
	PrepareReplayResponse,
	ReplayMetadata,
} from "./interfaces";

export default class HSReplayNetClient implements HSReplayNetClientInterface {

	public apiKey: string;
	public apiUrl: string;
	public uploadUrl: string;
	public testClient: boolean = false;

	constructor(apiKey: string, apiUrl: string, uploadUrl: string) {
		this.apiKey = apiKey;
		this.apiUrl = apiUrl;
		this.uploadUrl = uploadUrl;
	}

	private buildHeaders(headers: any): Headers {
		const defaultHeaders = {
			"X-Api-Key": this.apiKey,
		};
		return new Headers(Object.assign({}, defaultHeaders, headers));
	}

	private fetchJson(url: string, options?: any): Promise<any> {
		options.headers = this.buildHeaders(options.headers);
		return new Promise<any>((resolve: any, reject: any) => {
			fetch(url, options).then((response: any) => {
				const statusCode = response.status;
				if ([200, 201].indexOf(statusCode) === -1) {
					throw new Error(`Unexpected status code ${statusCode}`);
				}
				response.json().then(resolve, reject);
			}, reject).catch(reject);
		});
	}

	public createToken(): Promise<CreateTokenResponse> {
		return this.fetchJson(
			this.apiUrl + "tokens/",
			{
				method: "POST",
				body: this.testClient ? JSON.stringify({test_data: true}) : null,
				headers: {"Content-Type": "application/json"},
			},
		);
	}

	public createAccountClaim(token: string): Promise<CreateAccountClaimResponse> {
		return this.fetchJson(
			this.apiUrl + "claim_account/" + token,
			{
				method: "POST",
				headers: {Authorization: "Token " + token},
			},
		);
	}

	public getTokenDetails(token: string): Promise<GetTokenDetailsResponse> {
		return this.fetchJson(
			this.apiUrl + "tokens/" + token + "/",
			{
				method: "GET",
				headers: {Authorization: "Token " + token},
			},
		);
	}

	public prepareReplay(token: string, metadata: ReplayMetadata): Promise<PrepareReplayResponse> {
		return this.fetchJson(
			this.uploadUrl + "replay/upload/request",
			{
				method: "POST",
				body: JSON.stringify(metadata),
				headers: {Authorization: "Token " + token},
			},
		);
	}

	public putReplay(putUrl: string, token: string, log: string): Promise<any> {
		return fetch(putUrl, {
			method: "PUT",
			body: log,
			headers: this.buildHeaders({
				"Content-Type": "text/plain",
			}),
		});
	}
}
