"use strict";

const os = require("os");
const path = require("path");

function main(isTurnOn) {
	const platform = os.platform();
	switch (platform) {
		case "win32": {
			win32(isTurnOn);
			break;
		}

		case "darwin": {
			darwin(isTurnOn);
			break;
		}

		default: {
			throw Error("Platform " + platform + " is not supported yet. Pull requests are welcome.");
			break;
		}
	}
}

function win32(isTurnOn) {
	// Credits: http://www.powershellmagazine.com/2013/07/18/pstip-how-to-switch-off-display-with-powershell/
	//
	//     Turn display off by calling WindowsAPI.
	//
	//     SendMessage(HWND_BROADCAST,WM_SYSCOMMAND, SC_MONITORPOWER, POWER_OFF)
	//     HWND_BROADCAST  0xffff
	//     WM_SYSCOMMAND   0x0112
	//     SC_MONITORPOWER 0xf170
	//     POWER_OFF       0x0002
	//     POWER_ON        0x0001

	const ffi = require("ffi");

	const user32 = ffi.Library("user32", {
		SendMessageW: ["int", ["ulong", "uint", "long", "long"]]
	});

	const HWND_BROADCAST = 0xffff;
	const WM_SYSCOMMAND = 0x0112;
	const SC_MONITORPOWER = 0xf170;
	const POWER_OFF = 0x0002;
	const POWER_ON  = 0x0001;
	if(isTurnOn){
		user32.SendMessageW(HWND_BROADCAST, WM_SYSCOMMAND, SC_MONITORPOWER, POWER_ON);
	}else{
		user32.SendMessageW(HWND_BROADCAST, WM_SYSCOMMAND, SC_MONITORPOWER, POWER_OFF);
	}
}

function darwin(isTurnOn) {
	if (os.release() >= "13.0.0") {
		const execFile = require("child_process").execFile;
		execFile("pmset", ["displaysleepnow"], (error, stdout, stderr) => {
			if (error) {
				throw error;
			}
		});
	}
	else {
		throw new Error("OS X < 10.9 is not supported.");
	}
}

function turnOnDisplay(){
main(true)
}

function turnOffDisplay(){
main()
}
module.exports = {turnOnDisplay,turnOffDisplay};
