import {app} from "electron";

export let configurationFile = app.getPath("userData") + "/tally.yml";
