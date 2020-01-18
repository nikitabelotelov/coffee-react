#!/bin/bash

for i in dist/ ext/ font/ server.js index.html ; do cp -r $i ../coffee-build/ ; done

# test trig #
