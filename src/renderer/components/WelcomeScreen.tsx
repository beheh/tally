import * as React from "react";

interface WelcomeScreenProps extends React.ClassAttributes<WelcomeScreen> {
	onFinish: () => void;
}

export default class WelcomeScreen extends React.Component<WelcomeScreenProps, void> {

	render(): JSX.Element {
		return (
			<div>
				<h1>Welcome to Tally!</h1>
				<p>Have fun!</p>
			</div>
		);
	}
}
