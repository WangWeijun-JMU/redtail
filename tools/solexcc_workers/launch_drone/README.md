# Launch Drone

The `launch_drone` worker initiates the px4 ROS node to read in the position estimates from trailnet. It will arm the drone, initiate takeoff and then switch to GUIDED to automatically follow a trail.
