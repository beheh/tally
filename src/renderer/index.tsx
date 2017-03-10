import * as React from "react";
import * as ReactDOM from "react-dom";
import Tally from "./components/Tally";
import HSReplayNetClient from "./HSReplayNetClient";
import HSReplayNetManager from "./HSReplayNetManager";
import {remote, ipcRenderer} from "electron";
import * as moment from "moment-timezone";
import {
	HSREPLAYNET_API_KEY,
	HSREPLAYNET_API_URL,
	HSREPLAYNET_UPLOAD_API_URL
} from "../constants";

const config = remote.require("./Configuration");

const client = new HSReplayNetClient(
	HSREPLAYNET_API_KEY,
	HSREPLAYNET_API_URL,
	HSREPLAYNET_UPLOAD_API_URL,
);
const manager = new HSReplayNetManager(client);

Promise.all([
	config.get("token"),
	config.get("test_data"),
]).then(([token, testData]) => {
	client.testClient = !!testData;
	if (token) {
		manager.token = token;
		ipcRenderer.send("ready-for-games");
	}
	else {
		manager.createToken().then((token: string) => {
			config.set("token", token);
			ipcRenderer.send("ready-for-games");
		});
	}
});

ipcRenderer.on("game", (event, game: any) => {
	const regexp = /\d+/g;
	const timestamps = [
		game.earliestTimestamp,
		game.latestTimestamp
	].map((raw: string) => {
		const matches = raw.match(regexp);
		const timestamp = moment();
		if (!matches) {
			throw new Error(`Invalid timestamp "${raw}"`);
		}
		timestamp.hours(+matches[0]);
		timestamp.minutes(+matches[1]);
		timestamp.seconds(+matches[2]);
		timestamp.millisecond(+matches[3] / 10 / 1000); // / 10 is for the trailing zero
		return timestamp;
	});

	// if we're starting more than 12 hours after we finished we must have rolled over midnight
	if (timestamps[0].isAfter(timestamps[1]) && timestamps[0].diff(timestamps[1], "hours") > 12) {
		timestamps[0] = timestamps[0].add(-1, "day");
	}

	manager.uploadReplay(game.log, {
		match_start: timestamps[0].format(),
		friendly_player_id: 1,
	});
});

ReactDOM.render(
	<Tally />,
	document.getElementById("container")
);
