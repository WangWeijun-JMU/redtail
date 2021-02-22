#!/bin/bash

export ROS_MASTER_URI=http://10.42.0.1:11311
export ROS_IP=10.42.0.209
rosrun joy joy_node _dev:=/dev/input/js0 _autorepeat_rate:=30
