import * as React from "react";
import DashboardScreen from "./DashboardScreen";
import {AccountStatusProps} from "./AccountStatus";

const {shell} = require("electron").remote;

interface TallyProps extends React.ClassAttributes<Tally> {
	//firstStart: boolean;
}

interface TallyState {
	welcomeScreenDone?: boolean;
	accountStatus?: AccountStatusProps;
}

export default class Tally extends React.Component<TallyProps, TallyState> {

	constructor(props: TallyProps, context: any) {
		super(props, context);
		this.state = {
			welcomeScreenDone: false,
			accountStatus: {},
		};
	}

	render(): JSX.Element {
		return (
			<div>
				<DashboardScreen
					openUrl={(url: string) => {
						shell.openExternal(url);
					}}
					accountStatus={this.state.accountStatus}
				/>
			</div>
		);
	}

	/*componentDidMount(): void {
	 const token = null;//this.props.configuration.get("token");
	 const accountStatus: AccountStatusProps = {token: token};
	 if (token) {
	 console.debug("Using token", token, "from settings");
	 //this.props.manager.token = token; // will trigger token details load
	 }
	 else {
	 console.debug("No token found, requesting new token");
	 let backoff = 0;
	 const requestToken = () => this.props.manager.createToken().then(
	 (token) => {
	 console.debug("Got new token", token);
	 this.setState({accountStatus: {token: token, claiming: false}});
	 //this.props.configuration.set("token", token);
	 },
	 () => {
	 console.debug("Failed, retrying");
	 // exponential backoff
	 window.setTimeout(() => {
	 requestToken();
	 }, backoff * 1000);
	 if (backoff < 2) {
	 backoff++;
	 }
	 backoff = backoff ** 2;
	 if (backoff > 600) {
	 backoff = 600;
	 }
	 }
	 );
	 requestToken();
	 accountStatus.claiming = true;
	 }
	 this.setState({accountStatus: accountStatus});
	 }*/
}
