import * as React from "react";
import {HSReplayNetUser} from "../interfaces";

const {shell} = require('electron');

interface AccountProps extends React.ClassAttributes<any> {
	claimAccount?:(success: (url: string) => void) => void;
	claiming?:boolean;
	querying?:boolean;
	waiting?:boolean;
	user?:HSReplayNetUser;
}

export default class Account extends React.Component<AccountProps, any> {

	private openAccount(e) {
		e.preventDefault();
		shell.openExternal("https://hsreplay.net/account/login/?next=/account/");
	}

	render():React.ReactElement<any> {
		if (this.props.claiming) {
			return <span><i className="fa fa-refresh fa-spin fa-fw"></i> {"Claiming Account"}</span>
		}
		if (this.props.waiting) {
			return <span><i className="fa fa-refresh fa-spin fa-fw"></i> {"Waiting for claim"}</span>
		}
		if (this.props.querying) {
			return <span><i className="fa fa-refresh fa-spin fa-fw"></i> {"Checking account"}</span>
		}
		if (this.props.user) {
			return <span><a href="#" onClick={(e) => this.openAccount(e)}>{this.props.user.username}</a></span>
		}
		return <button onClick={() => {this.props.claimAccount((url: string) => shell.openExternal(url))}}
					   disabled={!this.props.claimAccount ? "disabled" : ""}>Claim account</button>;
	}
}
