import * as React from "react";
import {HSReplayNetUser} from "../interfaces";
import Spinner from "./Spinner";

const {shell} = require('electron');

interface AccountProps extends React.ClassAttributes<any> {
	claimAccount?:(success:(url:string) => void) => void;
	cancelClaim?:() => void;
	claiming?:boolean;
	querying?:boolean;
	waiting?:boolean;
	user?:HSReplayNetUser;
}

export default class Account extends React.Component<AccountProps, any> {

	private openAccount(e) {
		e.preventDefault();
		shell.openExternal("https://hsreplay.net/account/");
	}

	render():React.ReactElement<any> {
		if (this.props.claiming) {
			return <Spinner message="Claiming account"/>;
		}
		if (this.props.waiting) {
			return <span>
				<Spinner message="Waiting for claim"/>
				{this.props.cancelClaim && <span>&nbsp;<button onClick={this.props.cancelClaim}>Cancel</button></span>}
			</span>;
		}
		if (this.props.querying) {
			return <Spinner message="Checking for account"/>;
		}
		if (this.props.user) {
			return <span>Connected to <a href="#" onClick={(e) => this.openAccount(e)}>{this.props.user.username}</a></span>
		}
		return <span>
			Anonymous&nbsp;
				<button className="btn btn-large btn-primary" onClick={() => {this.props.claimAccount((url: string) => shell.openExternal(url))}}
					   disabled={!this.props.claimAccount ? "disabled" : ""}>Claim account</button>
			</span>;
	}
}
