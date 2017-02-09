import {app, shell, Menu} from "electron";

const base = "https://hsreplay.net";
const repository = "https://github.com/beheh/tally";

const rawName = app.getName();
const appName = rawName.charAt(0).toUpperCase() + rawName.substr(1);

const openUrl = (url: string): void => {
	shell.openExternal(base + "/games/mine/");
};

const template = [
	{
		label: "Replays",
		submenu: [
			{
				label: "Clear latest",
			},
			{
				type: "separator",
			},
			{
				label: "Open in Browser",
				click: () => openUrl(""),
			},
		],
	},
	{
		label: "Account",
		submenu: [
			{
				label: "Claim…",
				click: () => {
					console.log("Claim!");
				},
			},
			{
				type: "separator",
			},
			{
				label: "Open in Browser",
				click: () => openUrl(base + "/account/"),
			},
			{
				type: "separator",
			},
			{
				label: "Logout",
			},
		],
	},
	{
		label: "Help",
		submenu: [
			{
				label: "Report issue",
				click: () => openUrl(repository + "/issues"),
			},
			{
				type: "separator",
			},
			{
				label: "HSReplay.net",
				submenu: [
					{
						label: "Terms of Service",
						click: () => openUrl(base + "/about/tos/"),
					},
					{
						label: "Privacy Policy",
						click: () => openUrl(base + "/about/privacy/"),
					},
				],
			},
			{
				type: "separator",
			},
			{
				label: "About",
				click: () => {
					console.log("Wow!");
				},
			},
		],
	}
];

/*if (process.platform === "darwin" || true) {
 // Max OS X menu
 template.unshift({
 label: appName,
 submenu: [
 {
 role: "about",
 },
 {
 type: "separator"
 },
 {
 role: "services",
 submenu: []
 },
 {
 type: "separator"
 },
 {
 role: "hide"
 },
 {
 role: "hideothers"
 },
 {
 role: "unhide"
 },
 {
 type: "separator"
 },
 {
 role: "quit"
 }
 ]
 });
 }*/

const menu = Menu.buildFromTemplate(template as any);

export default menu;
