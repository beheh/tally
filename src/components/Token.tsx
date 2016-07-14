import * as React from "react";
import Spinner from "./Spinner";

interface TokenProps extends React.ClassAttributes<any> {
	token:string;
	working?:boolean;
	requestToken?:() => void;
}

export default class Token extends React.Component<TokenProps, any> {

	private timeout:number = null;

	private scheduleRequestToken() {
		if (this.timeout || !this.props.requestToken) {
			return;
		}
		this.timeout = window.setTimeout(() => this.props.requestToken(), 500);
	}

	render():React.ReactElement<any> {
		if (this.props.working) {
			return <Spinner message="Requesting token"/>;
		}
		if (this.props.token) {
			return <em className="token">{this.props.token}</em>;
		}
		if(this.props.requestToken) {
			this.scheduleRequestToken();
		}
		return <span>Not found.</span>;
	}
}
