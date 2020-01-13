#!/bin/bash

for i in dist/ font/ server.js index.html ; do cp -r $i ../coffee-build/ ; done

