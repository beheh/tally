import * as React from "react";
import AccountStatus from "./AccountStatus";

interface DashboardScreenProps extends React.ClassAttributes<DashboardScreen> {
	openUrl: (url: string) => void;
	accountStatus: any;
}

export default class DashboardScreen extends React.Component<DashboardScreenProps, void> {

	render(): JSX.Element {
		return <div id="tally">
			<aside className="account">
				<AccountStatus
					token={this.props.accountStatus.token}
					creating={this.props.accountStatus.creating}
					claiming={this.props.accountStatus.claiming}
				/>
			</aside>
			<div>
				<h1>Tally</h1>
			</div>
			<footer className="branding">
				<small>powered by</small>
				&nbsp;
				<a href="#"
				   onClick={(e) => {e.preventDefault(); this.props.openUrl("https://hsreplay.net/")}}
				>
					<img src="img/hsreplaynet.png" /><span>HSReplay.net</span>
				</a>
			</footer>
		</div>;
	}
}
