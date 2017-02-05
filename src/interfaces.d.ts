export interface HSReplayNetClient {
	requestToken: (cb: (token: string) => void, error?: () => void) => void;
	claimAccount: (token: string, cb: (url: string) => void) => void;
	queryToken: (token: string, success: (user: HSReplayNetUser) => void, error?: (code: number, message: string) => void) => void;
	prepareReplay: (token: string, metadata: ReplayMetaData, cb: (shortid: string, url: string, put_url: string) => void) => void;
}

export interface ReplayMetaData {
	match_start: string;
	friendly_player_id: 1|2;
	specator_mode?: boolean;
	game_type?: number;
	format?: number;
}

export interface HSReplayNetUser {
	id: number;
	username: string;
}
