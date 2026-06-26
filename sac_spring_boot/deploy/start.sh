#!/bin/bash
export PATH=/home/u841409365/jre21/bin:$PATH

echo "Stopping any existing Spring Boot instances..."
pkill -f 'erp.jar' || true
sleep 2

mkdir -p /home/u841409365/sac_springboot/logs

echo "Starting erp-test-sacgotek on port 8085..."
nohup java -Xms64m -Xmx256m -Xss256k -XX:ActiveProcessorCount=1 -XX:ParallelGCThreads=1 -XX:CICompilerCount=2 -XX:TieredStopAtLevel=1 -jar /home/u841409365/sac_springboot/erp.jar --spring.config.location=file:/home/u841409365/sac_springboot/config/application-test-sacgotek.properties > /home/u841409365/sac_springboot/logs/test-sacgotek.log 2>&1 &
disown

echo "Starting erp-erpv2 on port 8089..."
nohup java -Xms64m -Xmx256m -Xss256k -XX:ActiveProcessorCount=1 -XX:ParallelGCThreads=1 -XX:CICompilerCount=2 -XX:TieredStopAtLevel=1 -jar /home/u841409365/sac_springboot/erp.jar --spring.config.location=file:/home/u841409365/sac_springboot/config/application-erpv2.properties > /home/u841409365/sac_springboot/logs/erpv2.log 2>&1 &
disown

echo "Spring Boot apps started."
sleep 2
ps aux | grep erp.jar | grep -v grep
