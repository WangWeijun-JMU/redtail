#!/bin/bash -c 

startdnn() {
   if ps -ef | grep [s]tereo_dnn_ros
   then
      echo "StereoDNN already running" >&2
      exit 1
   fi

   roslaunch stereo_dnn_ros ap_zed_resnet18_2D_fp16.launch > /dev/null & 
   sleep 7
   roslaunch stereo_dnn_ros_viz ap_debug_viz.launch > /dev/null &
   roslaunch ros_rtsp rtsp_streams.launch > /dev/null &
   echo "StereoDNN launched"
}

stopdnn() {
    pkill -f "ros_rtsp"
    pkill -f "stereo_dnn_ros_viz" 
    pkill -f "stereo_dnn_ros" 
echo "StereoDNN shutdown"
}

# StereoDNN can only be launched if trailnet is not running
if ps -ef | grep [c]affe_ros 
   then
      echo "Trailnet already running must be stopped first" >&2
      exit 1
fi

case "$1" in 
    start)   startdnn ;;
    stop)    stopdnn ;;
    *) echo "usage: $0 start|stop" >&2
       exit 1
       ;;
esac
