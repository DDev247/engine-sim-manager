#!/bin/bash

cd es # were in es

WINEPREFIX=$PWD/wineprefix # use a custom wineprefix
WINEDEBUG=-fixme # tell wine to not print "fixme" logs

cd latest/bin # were in es/latest/bin

wine engine-sim-app.exe $1
