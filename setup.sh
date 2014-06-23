

sudo mkdir -p /opt/NodeAppDirector

sudo cp app.js /opt/NodeAppDirector
sudo cp app /opt/NodeAppDirector
sudo cp -r externs /opt/NodeAppDirector
sudo cp tools/closure-compiler.jar /opt/closure-compiler.jar

sudo ln -fs /opt/NodeAppDirector/app /usr/local/bin/app
