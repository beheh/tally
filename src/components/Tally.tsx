import * as React from "react";
import ClaimAccountButton from "./ClaimAccountButton";
import Configuration from "../Configuration";
import Token from "./Token";
import {HSReplayNetClient} from "../interfaces";

interface TallyProps extends React.ClassAttributes<any> {
	configuration:Configuration;
	client:HSReplayNetClient;
}

interface TallyState {
	requestingToken?:boolean;
	claimingAccount?:boolean;
}

class Tally extends React.Component<TallyProps, TallyState> {

	constructor(props:TallyProps, context:any) {
		super(props, context);
		this.state = {
			requestingToken: false,
			claimingAccount: false,
		};
	}

	private requestToken() {
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

	private claimAccount(success:(url:string) => void) {
		this.setState({
			claimingAccount: true,
		});
		this.props.client.claimAccount(this.props.configuration.get('token'), (url:string) => {
			this.setState({
				claimingAccount: false
			});
			if (url) {
				success('https://hsreplay.net' + url);
			}
		});
	}

	public render():React.ReactElement<any> {
		let token = this.props.configuration.get('token');
		return <div>
			<h1>Tally</h1>
			<h2>Account</h2>
			<dl>
				<dt>Token</dt>
				<dd>
					<Token token={token} working={this.state.requestingToken}
						   requestToken={() => this.requestToken()}/>
				</dd>
				<dt>User</dt>
				<dd>
					<ClaimAccountButton working={this.state.claimingAccount}
										claimAccount={token && ((success) => this.claimAccount(success))}/>
				</dd>
			</dl>
			<h2>Replays</h2>
			<ul></ul>
		</div>;
	}
}

export default Tally;
