export interface HSReplayNetClient {
	requestToken: (cb: (token: string) => void) => void;
	claimAccount: (token: string, cb: (url: string) => void) => void;
}
