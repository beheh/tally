import * as React from "react";
import * as fs from "fs";

const {dialog, getCurrentWindow} = require('electron').remote;

interface LogDirectoryProps extends React.ClassAttributes<any> {
	directory: string;
	setDirectory: (logDirectory: string) => void;
}

interface LogDirectoryState {
	intermediateDirectory?: string;
	working?: boolean;
	invalid?: boolean;
}

export default class LogDirectory extends React.Component<LogDirectoryProps, LogDirectoryState> {

	constructor(props:LogDirectoryProps, context:any) {
		super(props, context);
		this.state = {
			intermediateDirectory: props.directory,
			working: false,
			invalid: false,
		}
	}

	private selectDirectory() {
		let win = getCurrentWindow();
		dialog.showOpenDialog(win, {
			defaultPath: this.props.directory,
			properties: ['openDirectory'],
		}, (folders: string[]) => {
			if(!folders || !folders.length) {
				return;
			}
			let directory = folders[0];
			this.validateAndSaveDirectory(directory);
		});
	}

	private changeDirectory(e) {
		let directory = e.target.value;
		this.setState({
			intermediateDirectory: directory,
			invalid: false,
		});
	}

	private validateAndSaveDirectory(directory: string) {
		this.setState({
			intermediateDirectory: directory,
			working: true,
		});
		fs.access(directory, fs.R_OK, (err) => {
			let invalid = !!err;
			this.setState({
				working: false,
				invalid: invalid,
			});
			if(!invalid) {
				this.props.setDirectory(directory);
			}
		});
	}

	render():JSX.Element {
		let canEdit = !this.props.setDirectory || this.state.working;
		let input = <input type="text" value={this.state.intermediateDirectory || ""} disabled={canEdit} onChange={(e) => this.changeDirectory(e)}  onBlur={() => this.validateAndSaveDirectory(this.state.intermediateDirectory)} className={this.state.invalid ? "invalid" : null} />;
		let button = <button onClick={() => this.selectDirectory()} disabled={canEdit}>Browse&hellip;</button>;
		return <span>{input} {button}</span>;
	}
}
