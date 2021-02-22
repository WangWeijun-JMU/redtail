# Redtail project with Jetpack 4.2

本项目派生自 Nvidia Redtail 项目(Jetpack 3.2 with OpenCV 3.3.1)，原始项目已停止更新。有关原始项目的更多信息，转至[本页](https://github.com/NVIDIA-AI-IOT/redtail)。

本工程对原始项目代码进行了更新和调整，已适配 Jectpack 4.2。

### 本项目在以下平台上完成验证和实现：

* [阿木实验室无人车](https://item.taobao.com/item.htm?spm=a312a.7700824.w5003-22617251033.7.7af0f907ub8Jgj&id=605161981364&scene=taobao_shop)

本项目主要研究基于深度学习的无人机和无人车自主视觉导航。

请参考[wiki](https://github.com/frozeneyefree/redtail/wiki)开始本项目。

该项目包含深度神经网络、计算机视觉和控制代码、硬件命令和其他组件，可以使无人驾驶平台在复杂环境中进行自主导航，如森林中弯曲的小路、人行道等。

本项目用于视觉导航的TrailNet DNN运行在Nvidia的Jetson TX2官方载板上。

该项目的深度神经网络(DNNs)可以使用公开数据从零开始进行训练。
本项目提供一部分 [预训练的DNNs模型](../master/models/pretrained/)。
如果您想从头开始培训TrailNet DNN，请按照[本页](../../wiki/Models)上的步骤进行。

该项目还包含[Stereo DNN](../master/stereoDNN/)模型和运行时，允许在Nvidia平台上进行立体摄像机深度估算。

## 参考文献和演示
* [Stereo DNN, CVPR18 paper](https://arxiv.org/abs/1803.09719), [Stereo DNN video demo](https://youtu.be/0FPQdVOYoAU)
* [TrailNet Forest Drone Navigation, IROS17 paper](https://arxiv.org/abs/1705.02550), [TrailNet DNN video demo](https://youtu.be/H7Ym3DMSGms)

## 最新的修改
* **2020-9-20**: 
  * 添加ROS安装国内源。
  * 增加stereo_dnn_ros node安装
  * 增加stereo_dnn_ros_viz node安装
* **2020-9-30**:
  * 修复sudo rosdep init国内无法访问
  * OpenCV Bug修复
* **2020-10-1**:
  * 增加板载摄像头支持
  * FATAL Bug修复
  * 修复Bug Could not get gstreamer sample.

***********************************************
中外友好分割线
Beautiful split line of Hua Lili.
***********************************************

This project has been matched to the Jectpack 4.2. 

This project is forked from Nvidia Redtail project.

For more information about the original project, follow the steps on [this page](https://github.com/NVIDIA-AI-IOT/redtail).

## This project is verified and implemented on the following platforms:

* [AmovLab ground vehicles](https://item.taobao.com/item.htm?spm=a312a.7700824.w5003-22617251033.7.7af0f907ub8Jgj&id=605161981364&scene=taobao_shop)

This project mainly studies autonomous visual navigation components for drones and ground vehicles using deep learning. 

Refer to [wiki](https://github.com/frozeneyefree/redtail/wiki) for more information on how to get started.

This project contains deep neural networks, computer vision and control code, hardware instructions and other artifacts that allow users to build a drone or a ground vehicle which can autonomously navigate through highly unstructured environments like forest trails, sidewalks, etc. 
The TrailNet DNN for visual navigation is running on NVIDIA's Jetson embedded platform.

The project's deep neural networks (DNNs) can be trained from scratch using publicly available data. A few [pre-trained DNNs](../master/models/pretrained/) are also available as a part of this project. In case you want to train TrailNet DNN from scratch, follow the steps on [this page](../../wiki/Models).

The project also contains [Stereo DNN](../master/stereoDNN/) models and runtime which allow to estimate depth from stereo camera on NVIDIA platforms.

## References and Demos
* [Stereo DNN, CVPR18 paper](https://arxiv.org/abs/1803.09719), [Stereo DNN video demo](https://youtu.be/0FPQdVOYoAU)
* [TrailNet Forest Drone Navigation, IROS17 paper](https://arxiv.org/abs/1705.02550), [TrailNet DNN video demo](https://youtu.be/H7Ym3DMSGms)
