#!/bin/bash -c 
# set -x

startdnn() {
    if ps -ef | grep [a]p_robot_controller
    then
      echo "launch already running" >&2
      exit 1
    fi
    roslaunch px4_controller ap_robot_controller.launch > /dev/null &
    sleep 3
    if [ $? -eq 0 ]
                then
                        echo "drone launch initiated"
                        exit 0
        else
                        echo "err" >&2
                        exit 1
        fi

}

stopdnn() {
    pkill -f "ap_robot_controller" # kill the ros node
    rosrun mavros mavsys mode -c 0 # tell the drone to switch to STABILIZE
    echo "trailnet launch aborted"
    exit 0
}

# Autonomous flight requires trailnet, MAVROS must be launched first
if ! ps -ef | grep [p]x4_controller || ! ps -ef | grep [c]affe_ros 
   then
      echo "Either StereoDNN or TrailnetDNN must be launched first" >&2
      exit 1
fi

case "$1" in 
    start)   startdnn ;;
    stop)    stopdnn ;;
    *) echo "usage: $0 start|stop" >&2
       exit 0
       ;;
esac
