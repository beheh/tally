export interface HSReplayNetClient {
	requestToken: (cb: (token: string) => void) => void;
	claimAccount: (token: string, cb: (url: string) => void) => void;
	queryToken: (token: string, success: (user: HSReplayNetUser) => void) => void;
}

export interface HSReplayNetUser {
	id: number;
	username: string;
}
