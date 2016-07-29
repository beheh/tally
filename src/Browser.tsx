/// <reference path="../typings/index.d.ts"/>

import * as React from "react";
import * as ReactDOM from "react-dom";
import Tally from "./components/Tally";
import Configuration from "./Configuration";
import HSReplayNetClientImpl from "./HSReplayNetClientImpl";
const {remote} = require("electron");

let config = new Configuration(remote.app.getPath("userData") + "/tally.yml");
let client = new HSReplayNetClientImpl();
client.api_key = "efe2aa81-0195-488c-a2da-83a19be54f62";
client.endpoint = "hsreplay.net";
client.port = 443;

ReactDOM.render(
	<Tally configuration={config} client={client}/>,
	document.getElementById("container")
);
