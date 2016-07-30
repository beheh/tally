export interface HSReplayNetClient {
	requestToken: (cb: (token: string) => void, error?: () => void) => void;
	claimAccount: (token: string, cb: (url: string) => void) => void;
	queryToken: (token: string, success: (user: HSReplayNetUser) => void, error?: (code: number, message: string) => void) => void;
}

export interface HSReplayNetUser {
	id: number;
	username: string;
}
