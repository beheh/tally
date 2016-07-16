import * as React from "react";
import Account from "./Account";
import Configuration from "../Configuration";
import Token from "./Token";
import {HSReplayNetClient, HSReplayNetUser} from "../interfaces";
import LogDirectory from "./LogDirectory";

const {shell} = require('electron').remote;

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
			user: null,
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
					if (!this.state.waitingForClaim) {
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

	private openUrl(e, url:string) {
		e.preventDefault();
		shell.openExternal(url);
	}

	public render():React.ReactElement<any> {
		let token = this.props.configuration.get('token');
		let component = null;
		if (token) {
			component = <Account user={this.state.user}
								 claiming={this.state.claimingAccount}
								 querying={this.state.queryingToken}
								 waiting={this.state.waitingForClaim}
								 claimAccount={token && ((success) => this.claimAccount(success))}
								 cancelClaim={() => this.setState({waitingForClaim: false})}
			/>;
		}
		else {
			component = <Token token={token} working={this.state.requestingToken}
							   requestToken={() => this.requestToken()}/>;
		}
		let replays = [];
		return <div id="tally">
			<aside className="account">
				{component}
			</aside>
			<div>
				<h1>Replays</h1>
				<p>Hearthstone Logs: <LogDirectory directory={this.props.configuration.get('logs')} setDirectory={(directory: string)  => {
					this.props.configuration.set('logs', directory);
					this.setState({});
				}}/></p>
				{replays.length ? <ul>{replays}</ul> : <p>You have not uploaded any replays yet.</p>}
				<p>{this.state.user ?
					<a href="#"
					   onClick={(e) => this.openUrl(e, "https://hsreplay.net/account/login/?next=/games/mine/")}>Open in browser</a> :
					<a href="#" onClick={(e) => this.openUrl(e, "https://hsreplay.net/account/login/")}>Sign in using Battle.net</a>
				}</p>
			</div>
			<footer className="branding">
				<small>powered by</small>
				&nbsp;
				<a href="#" onClick={(e) => this.openUrl(e, "https://hsreplay.net/")}><img
					src="img/hsreplaynet.png"/><span>HSReplay.net</span></a>
			</footer>
		</div>;
	}
}

export default Tally;
