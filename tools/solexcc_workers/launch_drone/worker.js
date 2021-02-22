'use strict';
const spawn = require("child_process").spawn;
const path = require("path");

const ATTRS = {
    id: "launch_drone",
    // Name/description
    name: "Launch Drone",
    description: "Launch drone on trailnet",
    // Does this worker want to loop?
    looper: false,
    // Mavlink messages we're interested in
    mavlinkMessages: []
};

function d(str) {
    ATTRS.log(ATTRS.id, str);
}

/*
Return an object describing this worker. If looper is true, this module must expose a loop() export.
*/
function getAttributes() {
    return ATTRS;
}

// Called from dispatch.loop()
function loop() {
}

// Called when this worker is loaded.
function onLoad() {
    d("onLoad()");
}

// Called when unloading
function onUnload() {
    d("onUnload()");
}

// Called when a Mavlink message arrives
function onMavlinkMessage(msg) {
    d(`onMavlinkMessage(): msg.name=$msg.name`);
}

// Called when the GCS sends a message to this worker. Message format is 
// entirely dependent on agreement between the FCS and worker implementation.
function onGCSMessage(msg) {
    d(`onGCSMessage(): msg.id=${msg.id}`);

    const result = {
        ok: true
    };

    switch(msg.id) {
        case "launch": {
            if(trailnetlaunch == false) {
              d("launch drone");
              launchtrailnet();
            } else {
              d("resume drone");
              stoplaunchtrailnet();
            }
            break;
        }

        default: {
            result.ok = false;
            result.message = `No message with id ${msg.id}`;
            break;
        }
    }

    return result;
}

//
// Return a UI for the specified screen.
//
function onScreenEnter(screen) {
    switch(screen) {
        case ATTRS.api.WorkerUI.Const.SCREEN_VIDEO: {
            const body = loadLayoutFor(ATTRS.api.WorkerUI.Const.PANEL_WORKER_SHOT_BUTTONS);
            //var teststrg=JSON.stringify(body);
            //var teststrg2=JSON.stringify(screen);
            //d(`body=${teststrg}`);
            //d(`screen=${teststrg2}`);
        
            return (body)? {
                screen_id: screen, 
                video_bottom: body
            }: null;
       } 
    }
}



// Start and stop the trailnet ap_robot_controller launch node.
var mChildProcess1 = null;
var mChildProcess2 = null;
var trailnetlaunch = false;

function launchtrailnet() {
    trailnetlaunch = true;
    d(`message received is start trailnetlaunch node!`);
    if(mChildProcess1) {
        d(`Child process is already running`);
        return {ok: false, message: "Child process is already running"};
    }

    const server = path.join(__dirname, "startstoptrailnetlaunch.sh start");
    d(`server=${server}`);
    
    const child = spawn("sh", [ server ], { shell: true });
    child.stdin.setEncoding("utf-8");
    d(`child=${child}`);

    child.on("error", function (error) {
        d(`Error starting child process: ${error}`);
    });

    child.stdout.on("data", function(data) {
        d(`child.stdout: ${data.toString('utf-8')}`);
        if(data.toString('utf-8').includes ("launch initiated")) {
           ATTRS.api.WorkerUI.sendSpeechMessage(ATTRS, "Trailnet autonomous mode initiated", ATTRS.api.WorkerUI.SpeechType.TEXT);
           sendLaunchButtonUpdate();
        }
    });
    child.stderr.on("data", function(data) {
        d(`child.stderr: ${data.toString('utf-8')}`);
        if(data.toString('utf-8').includes ("must be launched first")) {
           ATTRS.api.WorkerUI.sendSpeechMessage(ATTRS, "Error: make sure that Trailnet and Mavros must be started first", ATTRS.api.WorkerUI.SpeechType.ERROR);
        } else if(data.toString('utf-8').includes ("Could not arm")) {
           ATTRS.api.WorkerUI.sendSpeechMessage(ATTRS, `ERROR: Could not arm FCU launch aborted`, ATTRS.api.WorkerUI.SpeechType.ERROR);
        } else {
           ATTRS.api.WorkerUI.sendSpeechMessage(ATTRS, `ERROR: process has died`, ATTRS.api.WorkerUI.SpeechType.ERROR);
        } 
        stoplaunchtrailnet();
    });

    child.on("close", function(code) {
        d(`Child closed with ${code}`);
        mChildProcess1 = null;
    });

    mChildProcess1 = child;

    return {ok: true, message: "started"};
}

function stoplaunchtrailnet() {
    trailnetlaunch = false;
    d(`message received is stop trailnetlaunch node!`);
    if(mChildProcess2) {
        d(`Child process is already running`);
        return {ok: false, message: "Child process is already running"};
    }

    const server = path.join(__dirname, "startstoptrailnetlaunch.sh stop");
    d(`server=${server}`);

    const child = spawn("sh", [ server ], { shell: true });
    child.stdin.setEncoding("utf-8");
    d(`child=${child}`);

    child.on("error", function (error) {
        d(`Error starting child process: ${error}`);
    });

    child.stdout.on("data", function(data) {
        d(`child.stdout: ${data.toString('utf-8')}`);
        sendLaunchButtonUpdate();
    });

    child.stderr.on("data", function(data) {
        d(`child.stderr: ${data.toString('utf-8')}`);
    });

    child.on("close", function(code) {
        d(`Child closed with ${code}`);
        mChildProcess2 = null;
    });

    mChildProcess2 = child;

    return {ok: true, message: "started"};
}


function sendLaunchButtonUpdate() {
    const buttonColor = (trailnetlaunch)? "#ff39aa00": "red";
    const buttonText = (trailnetlaunch)? "         Resume Control         ": " Launch Drone on Trailnet "
    ATTRS.sendGCSMessage(ATTRS.id, {
        id: "screen_update",
        screen_id: "video",
        values: {
            launch_button: {
                text: buttonText,
                background: buttonColor
            }
        }
    });
}

function onScreenExit(screen) {

}

function loadLayoutFor(panel) {
    return ATTRS.api.WorkerUI.loadLayout(__dirname, panel);
}

exports.getAttributes = getAttributes;
exports.loop = loop;
exports.onLoad = onLoad;
exports.onUnload = onUnload;
exports.onMavlinkMessage = onMavlinkMessage;
exports.onGCSMessage = onGCSMessage;
exports.onScreenEnter = onScreenEnter;
exports.onScreenExit = onScreenExit;

