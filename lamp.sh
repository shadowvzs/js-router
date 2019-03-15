#!/bin/bash
WORK_DIR="/home/shadowvzs/projects/bible"
IMAGE_NAME="devos:7"
NAME="Lamp"
ENTRY="/bin/bash"

PROJECT_OUT="${WORK_DIR}/project"
PROJECT_IN="/var/www/html/"

PORT_OUT="80"
PORT_IN="80"



sudo docker run -p ${PORT_OUT}:${PORT_IN} --rm -it -v ${PROJECT_OUT}:${PROJECT_IN} --privileged --name ${NAME} ${IMAGE_NAME} ${ENTRY}
