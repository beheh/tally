import * as React from "react";

interface SpinnerProps extends React.ClassAttributes<any> {
	message:string;
}

export default class Spinner extends React.Component<SpinnerProps, any> {
	render():JSX.Element {
		return <div className="spinner"><img src="img/gear.svg" /> <span>{this.props.message}&hellip;</span></div>;
	}
}
