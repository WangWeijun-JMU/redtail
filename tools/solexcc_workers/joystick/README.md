# ROS Joystick control
Publish joystick buttons and stick movements to the ROS /joy topic. 
The notion follows the ROS /joy message definition.
To test, launch `roscore` on your ROS master computer and then call `rostopic echo /joy`
You shoud receive an output like:
```
---
header: 
  seq: 885
  stamp: 
    secs: 1906559595
    nsecs:         1
  frame_id: ''
axes: [0.0, -0.14509797096252441, 0.0, 0.0, 0.0, 0.0]
buttons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
---
```
