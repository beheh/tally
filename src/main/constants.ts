import {app} from "electron";

export var configurationFile = app.getPath("userData") + "/tally.yml";
