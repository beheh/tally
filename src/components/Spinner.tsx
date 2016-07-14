import * as React from "react";

interface SpinnerProps extends React.ClassAttributes<any> {
	message:string;
}

export default class Spinner extends React.Component<SpinnerProps, any> {
	render():JSX.Element {
		return <span><i className="fa fa-refresh fa-spin fa-fw"></i> {this.props.message}&hellip;</span>;
	}
}
