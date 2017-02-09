import * as React from "react";

export interface AccountStatusProps extends React.ClassAttributes<AccountStatus> {
	token?: string;
	creating?: boolean;
	claiming?: boolean;
	updating?: boolean;
}

export default class AccountStatus extends React.Component<AccountStatusProps, void> {

	render(): JSX.Element {
		let message = "No token";
		if(this.props.token) {
			message = this.props.token;
		}
		if(this.props.claiming) {
			message = "Claiming..."
		}
		if(this.props.creating) {
			message = "Creating token..."
		}
		return (
			<div>{message}</div>
		);
	}
}
