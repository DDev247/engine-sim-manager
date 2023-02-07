#!/bin/bash

cd es # were in es

WINEPREFIX=$PWD/wineprefix # use a custom wineprefix
WINEDEBUG=-fixme # tell wine to not print "fixme" logs

cd ../install # were in install

wine # setup wine prefix

wine ./DX.exe # setup DX
wine ./VC.exe # setup VC
wine ./Vulkan.exe # setup Vulkan

cd ..

echo "done" >> setup.txt

echo "Done setting up wine..."

