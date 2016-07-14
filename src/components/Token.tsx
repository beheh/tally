import * as React from "react";

interface TokenProps extends React.ClassAttributes<any> {
	token:string;
	working?:boolean;
	requestToken: () => void;
}

export default class Token extends React.Component<TokenProps, any> {

	private timeout: number = null;

	private scheduleRequestToken() {
		if(this.timeout) {
			return;
		}
		this.timeout = window.setTimeout(() => this.props.requestToken(), 500);
	}

	render():React.ReactElement<any> {
		if (this.props.working) {
			return <span><i className="fa fa-refresh fa-spin fa-fw"></i> {"Requesting"}</span>;
		}
		if (this.props.token) {
			return <em className="token">{this.props.token}</em>;
		}
		this.scheduleRequestToken();
		return <span>{"Not found"}</span>;
	}
}
