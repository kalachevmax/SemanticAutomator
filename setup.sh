#!/bin/sh

SETUP_DIR=/opt/semantic.automator

sudo mkdir -p ${SETUP_DIR}

sudo cp auto.js ${SETUP_DIR}
sudo cp auto ${SETUP_DIR}
sudo cp -r externs ${SETUP_DIR}
sudo cp tools/closure-compiler.jar ${SETUP_DIR}

sudo ln -fs ${SETUP_DIR}/auto /usr/local/bin/auto
