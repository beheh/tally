import * as React from "react";
import Account from "./Account";
import Configuration from "../Configuration";
import Token from "./Token";
import {HSReplayNetClient, HSReplayNetUser} from "../interfaces";

interface TallyProps extends React.ClassAttributes<any> {
	configuration:Configuration;
	client:HSReplayNetClient;
}

interface TallyState {
	requestingToken?:boolean;
	claimingAccount?:boolean;
	queryingToken?:boolean;
	waitingForClaim?:boolean;
	user?:HSReplayNetUser;
	showToken?:boolean;
}

class Tally extends React.Component<TallyProps, TallyState> {

	constructor(props:TallyProps, context:any) {
		super(props, context);
		let token = this.props.configuration.get('token');
		this.state = {
			requestingToken: false,
			claimingAccount: false,
			queryingToken: !!token,
			waitingForClaim: false,
			showToken: false,
		};
		if (token) {
			this.queryToken(null, true);
		}
	}

	private requestToken():void {
		if (this.state.requestingToken) {
			return;
		}
		this.setState({
			requestingToken: true,
		});
		this.props.client.requestToken((token:string) => {
			if (token) {
				this.props.configuration.set('token', token);
			}
			this.setState({
				requestingToken: false,
			})
		});
	}

	private claimAccount(success:(url:string) => void):void {
		if (this.state.claimingAccount) {
			return;
		}
		this.setState({
			claimingAccount: true,
		});
		this.props.client.claimAccount(this.props.configuration.get('token'), (url:string) => {
			this.setState({
				claimingAccount: false,
			});
			if (url) {
				this.setState({
					waitingForClaim: true,
				});
				success('https://hsreplay.net' + url);
				let interval = null;
				let timeout = null;
				let end = () => {
					if (interval) {
						window.clearInterval(interval);
					}
					if (timeout) {
						window.clearTimeout(timeout);
					}
					this.setState({
						waitingForClaim: false,
					});
				};
				interval = window.setInterval(() => {
					if(!this.state.waitingForClaim) {
						end();
						return;
					}
					this.queryToken((user:HSReplayNetUser) => {
						if (user) {
							end();
						}
					});
				}, 2 * 1000);
				timeout = window.setTimeout(end, 30 * 1000);
			}
		});
	}

	private queryToken(cb?:(user:HSReplayNetUser) => void, force?:boolean):void {
		if (this.state.queryingToken && !force) {
			return;
		}
		if (!this.state.queryingToken) {
			this.setState({
				queryingToken: true,
			});
		}
		this.props.client.queryToken(this.props.configuration.get('token'), (user:HSReplayNetUser) => {
			this.setState({
				queryingToken: false,
				user: user,
			});
			cb && cb(user);
		});
	}

	public render():React.ReactElement<any> {
		let token = this.props.configuration.get('token');
		let accountComponent = null;
		let tokenComponent = null;
		if (token) {
			accountComponent = <Account user={this.state.user}
							   claiming={this.state.claimingAccount}
							   querying={this.state.queryingToken}
							   waiting={this.state.waitingForClaim}
							   claimAccount={token && ((success) => this.claimAccount(success))}
							   cancelClaim={() => this.setState({waitingForClaim: false})}
			/>;
			if(this.state.showToken) {
				tokenComponent = <span>with token: <Token token={token} /></span>;
			}
			else {
				tokenComponent = <button onClick={() => this.setState({showToken: true})}>Show token</button>;
			}
		}
		else {
			tokenComponent = <Token token={token} working={this.state.requestingToken}
							 requestToken={() => this.requestToken()}/>;
		}
		let replays = [];
		return <div>
			<h1>Tally</h1>
			<h2>Account</h2>
			<p>{accountComponent}&nbsp;{tokenComponent}</p>
			<h2>Replays</h2>
			<ul>{replays}</ul>
		</div>;
	}
}

export default Tally;
