import * as React from "react";

const {shell} = require('electron');

interface ClaimAccountButtonProps extends React.ClassAttributes<any> {
	claimAccount?:(success: (url: string) => void) => void;
	working?:boolean;
}

export default class ClaimAccountButton extends React.Component<ClaimAccountButtonProps, any> {

	render():React.ReactElement<any> {
		if (this.props.working) {
			return <span><i className="fa fa-refresh fa-spin fa-fw"></i> {"Claiming Account"}</span>
		}
		return <button onClick={() => {this.props.claimAccount((url: string) => shell.openExternal(url))}}
					   disabled={!this.props.claimAccount ? "disabled" : ""}>Claim account</button>;
	}
}
