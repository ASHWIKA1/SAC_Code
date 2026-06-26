#!/bin/bash
echo "Stopping any running Spring Boot instances..."
pkill -f 'erp.jar' || true
sleep 1
ps aux | grep erp.jar | grep -v grep
