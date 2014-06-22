

sudo mkdir -p /opt/NodeAppDirector

sudo cp app.js /opt/NodeAppDirector
sudo cp acts.js /opt/NodeAppDirector
sudo cp tools/closure-compiler.jar /opt/closure-compiler.jar

alias app='node /opt/NodeAppDirector/app.js'
