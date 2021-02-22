#!/bin/bash -c 

startdnn() {
if ps -ef | grep [c]affe_ros
   then
      echo "Trailnet already running" >&2
      exit 1
fi

roslaunch caffe_ros ap_zed_ros_trailnet_yolo_robot.launch > /dev/null &
sleep 7
roslaunch ros_rtsp rtsp_streams.launch > /dev/null &
echo "TrailnetDNN launched"
}

stopdnn() {
    pkill -f "caffe_ros" 
    pkill -f "ros_rtsp" 
echo "Trailnet node shutdown"
}

# Trailnet can only be launced if StereoDNN is not running
if ps -ef | grep [s]tereo_dnn_ros
   then
      echo "StereoDNN already running must be stopped first" >&2
      exit 1
fi

case "$1" in 
    start)   startdnn ;;
    stop)    stopdnn ;;
    *) echo "usage: $0 start|stop" >&2
       exit 1
       ;;
esac
