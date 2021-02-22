# Solex-CC Support
This directory contains a set of Workers for Solex-CC to control the various aspects of Redtail.
To install, just copy the worker subdirectories into the solex-cc workers directory and follow the Solex-CC instructions to enable.
Current workers include:
- camera: adds ZED camera control for recording video and taking pictures
- joystick: adds gamepad control via a ROS /joy node
- launch_drone: launches drone on trailnet
- start_panel: startup and shutdown of all required ROS nodes and TX2
- video: toggle video feed between available ros image nodes

![image](https://github.com/mtbsteve/redtail/blob/master/tools/images/Screenshot_20200117-160204.png)
