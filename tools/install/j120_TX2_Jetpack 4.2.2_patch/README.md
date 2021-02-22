# Enable USB ports and Fan for the Auvidea J120 board (<=Rev 8) with Jetpack 4.2.x
For Jetpack 4.2 and Jetson TX2 please follow the instructions provided on the Auvidea support site with their Firmware 2.0 at www.auvidea.com

Jetpack 4.2.2 as well as 4.2.1 however contain a number of changes to the device tree compared to Jetpack 4.2. The Auvidea firmware therefore does not work with the latest Jetpack versions.
You may purchase the latest J121 board, or apply the folllowing patch to the Jetpack kernel.

This directory contains modified .dtsi files here which contain all changes needed to run the J120 along with JP 4.2.2.

Please follow the instructions here to compile the kernel manually and to flash it to your TX2:
https://developer.ridgerun.com/wiki/index.php?title=Compiling_Jetson_TX2_source_code_L4T_32.1

Before step 3, you need to copy the attached .dts and .dtsi files into the respective
```
..../t18x/common
and
..../t18x/quill
```
directories. After flashing the kernel, you can continue to install the Jetpack libraries by using SDKManager as usual.

You get one USB3.0, one USB 2.0 and one microUSB 2.0 port operational.

Known issues:
- no OTG support on the microUSB port - so you are not able to flash the TX2 from a host computer when mounted on the J120 (for flashing, you need to switch to the Development Board) I am not sure if that ever worked with the J120 Rev 8 though..
- Fan is always on. There is no access to the fan. This issue also persisted with the official Auvidea firmware 2.0 and JP 4.2.
