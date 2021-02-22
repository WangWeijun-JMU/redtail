'use strict';

const ATTRS = {
    id: "joystick",
    // Name/description
    name: "ROS Gamepad support",
    description: "ROS /joy node support for Logitech 710",
    // Does this worker want to loop?
    looper: false,
    // Mavlink messages we're interested in
    mavlinkMessages: []
};

const VERBOSE = true;
// Set the required parameters for the ROS /joy node
var joy_axes = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
var joy_buttons = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var json_joy_buttons=(JSON.stringify(joy_buttons));
var json_joy_axes= (JSON.stringify(joy_axes));
var sequence_ID = 0;
var time_stamp_sec;
var time_stamp_nsec=0;
var time_stamp_prev=0;
var frame_id="";


function d(str) {
    if(!VERBOSE) return;

    if(process.mainModule === module) {
        console.log(str);
    } else {
        ATTRS.log(ATTRS.id, str);
    }
}

function getAttributes() {
    return ATTRS;
}

function loop() {
}

function onLoad() {
    d("onLoad()");
}

function onUnload() {
    d("onUnload()");
    //const rosnodejs = require('rosnodejs');
    //rosnodejs.shutdown();
}

function onMavlinkMessage(msg) { }

function onGCSMessage(msg) {
    //d(`onGCSMessage(): msg.id=${msg.id}`);
    // define ROS /joy header parameters
    sequence_ID=sequence_ID+1;
    time_stamp_sec = Date.now();
    time_stamp_nsec = (time_stamp_sec - time_stamp_prev);
    time_stamp_prev = time_stamp_sec;
    
    const result = {
        ok: true
    };

    switch(msg.id) {
        case "on_key_event": {
            onKeyEvent(msg);
            break;
        }

        case "on_motion_event": {
            onMotionEvent(msg);
            break;
        }
    }

    return result;
}

function onKeyEvent(msg) {
    //d(`onGCSMessage(): msg=${msg[96]}`);
    if (msg[96] != null) {
       joy_buttons[1]=(msg[96] != null) ? msg[96] : 0;
    }
    if (msg[97] != null) {
       joy_buttons[2]=(msg[97] != null) ? msg[97] : 0;
    }
    if (msg[99] != null) {
       joy_buttons[0]=(msg[99] != null) ? msg[99] : 0;
    }
    if (msg[100] != null) {
       joy_buttons[3]=(msg[100] != null) ? msg[100] : 0;
    }
    if (msg[102] != null) {
       joy_buttons[4]=(msg[102] != null) ? msg[102] : 0;
    }
    if (msg[103] != null) {
       joy_buttons[5]=(msg[103] != null) ? msg[103] : 0;
    }
    if (msg[104] != null) {
       joy_buttons[6]=(msg[104] != null) ? msg[104] : 0;
    }
    if (msg[105] != null) {
       joy_buttons[7]=(msg[105] != null) ? msg[105] : 0;
    }
    if (msg[106] != null) {
       joy_buttons[10]=(msg[106] != null) ? msg[106] : 0;
    }
    if (msg[107] != null) {
       joy_buttons[11]=(msg[107] != null) ? msg[107] : 0;
    }
    if (msg[108] != null) {
       joy_buttons[8]=(msg[108] != null) ? msg[108] : 0;
    }
    if (msg[109] != null) {
       joy_buttons[9]=(msg[109] != null) ? msg[109] : 0;
    }
    json_joy_buttons=(JSON.stringify(joy_buttons));
    //d(json_joy_buttons);
    
    //send the movements to /joy_node
    const rosnodejs = require('rosnodejs');
    const log = rosnodejs.log;
    rosnodejs.initNode('my_node', {onTheFly: true})
    .then(nh => {
        const pub = nh.advertise('/joy', 'sensor_msgs/Joy');
        var joymsg = "{\"header\":{\"seq\":"+sequence_ID+",\"stamp\":{\"secs\":"+time_stamp_sec+",\"nsecs\":"+time_stamp_nsec+"},\"frame_id\":\""+frame_id+"\"},\"axes\":"+json_joy_axes+",\"buttons\":"+json_joy_buttons+"}";
        var joymsgObj=JSON.parse(joymsg);
        pub.publish(joymsgObj);
        })
    .catch(err => {
          d(`error log ${log(err)}`);
    });
}

function onMotionEvent(msg) {
    //d(JSON.stringify(msg));
    // joy axes represent stick mode #3 - for "normal" stick mode 1 behavior switch axes [0] and [3] plus axes [1] and [3] 
    joy_axes[2]=(msg.s_l_x != null) ? msg.s_l_x : 0;
    joy_axes[3]=(msg.s_l_y != null) ? msg.s_l_y : 0;
    joy_axes[0]=(msg.s_r_x != null) ? msg.s_r_x : 0;
    joy_axes[1]=(msg.s_r_y != null) ? msg.s_r_y : 0;
    joy_axes[4]=(msg.dp_x != null) ? msg.dp_x : 0;
    joy_axes[5]=(msg.dp_y != null) ? msg.dp_y : 0;

    json_joy_axes= (JSON.stringify(joy_axes));
    
    //send the movements to /joy_node
    const rosnodejs = require('rosnodejs');
    rosnodejs.initNode('my_node', {onTheFly: true})
    .then(nh => {
        const pub = nh.advertise('/joy', 'sensor_msgs/Joy');
        var joymsg = "{\"header\":{\"seq\":"+sequence_ID+",\"stamp\":{\"secs\":"+time_stamp_sec+",\"nsecs\":"+time_stamp_nsec+"},\"frame_id\":\""+frame_id+"\"},\"axes\":"+json_joy_axes+",\"buttons\":"+json_joy_buttons+"}";
        var joymsgObj=JSON.parse(joymsg);
        pub.publish(joymsgObj);
    })
    .catch(err => {
          d(`error log ${log(err)}`);
    });   
}

function onRosterChanged() {
    d("Roster has been changed");
}

function onBroadcastResponse(msg) {
    // d(`onBroadcastResponse(${JSON.stringify(msg)}`);

    if(msg.request) {
        switch(msg.request.type) {
            case "mission_item_support": {

                if(msg.response) {
                    if(!mMissionItemSupportWorkers) mMissionItemSupportWorkers = [];

                    mMissionItemSupportWorkers.push(msg.response);
                }

                break;
            }
        }
    }
}

function getFeatures() {
    d("getFeatures()");

    var output = {
        // Indicate this worker supports missions
        joystick: { 
            worker_id: ATTRS.id,
            key_event: "on_key_event",
            motion_event: "on_motion_event"
        }
    };

    return output;
}

exports.getAttributes = getAttributes;
exports.loop = loop;
exports.onLoad = onLoad;
exports.onUnload = onUnload;
exports.onMavlinkMessage = onMavlinkMessage;
exports.onGCSMessage = onGCSMessage;
exports.onRosterChanged = onRosterChanged;
exports.getFeatures = getFeatures;
exports.onBroadcastResponse = onBroadcastResponse;

if(process.mainModule === module) {
    d("Hi!");
}
