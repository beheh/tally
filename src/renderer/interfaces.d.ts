export interface CreateTokenResponse {
	key: string;
	test_data: boolean;
	user: HSReplayNetUser|null;
}

export interface CreateAccountClaimResponse {
	created: string;
	full_url: string;
	url: string;
}

export interface GetTokenDetailsResponse {
	key: string;
	user: HSReplayNetUser|null;
	test_data: boolean;
}

export interface HSReplayNetUser {
	id: number;
	battletag: string|null;
	username: string|null;
}

export interface ReplayMetadata {
	match_start: string;
	friendly_player: 1|2;
	spectator_mode?: boolean;
	game_type?: number;
	format?: number;
	test_data?: boolean;
}

export interface PrepareReplayResponse {
	shortid: string; // replay shortid
	url: string; // user facing upload url
	put_url: string; // replay put url
}

export interface HSReplayNetClientInterface {
	createToken(): Promise<CreateTokenResponse>;
	createAccountClaim(token: string): Promise<CreateAccountClaimResponse>;
	getTokenDetails(token: string): Promise<GetTokenDetailsResponse>;
	prepareReplay: (token: string, metadata: ReplayMetadata) => Promise<PrepareReplayResponse>;
}
