echo '----------install LoopBack connectors---------'
npm install -g loopback-connector-mongodb

echo '----------build rest-server image---------'
docker build -t pwc/composer-rest-server-pro .

echo '----------set up mongodb------------'
docker run -d --name mongo --network composer_default -p 27017:27017 mongo

echo '--------export environment variables---------'
source envvars.txt

echo "COMPOSER_CARD:" $COMPOSER_CARD
echo "COMPOSER_NAMESPACES:" $COMPOSER_NAMESPACES
echo "COMPOSER_AUTHENTICATION:" $COMPOSER_AUTHENTICATION
echo "COMPOSER_MULTIUSER:" $COMPOSER_MULTIUSER
echo "COMPOSER_PROVIDERS:" $COMPOSER_PROVIDERS
echo "COMPOSER_DATASOURCES:" $COMPOSER_DATASOURCES

echo '--------run rest-server as docker container---------'
# solve volume permission issue
if [ !`uname` == "Darwin" ]; then # no need to do this step on MAC
  sudo chown -R 1000 ~/.composer
fi

docker run --privileged=true \
    -d \
    -e COMPOSER_CARD=${COMPOSER_CARD} \
    -e COMPOSER_NAMESPACES=${COMPOSER_NAMESPACES} \
    -e COMPOSER_AUTHENTICATION=${COMPOSER_AUTHENTICATION} \
    -e COMPOSER_MULTIUSER=${COMPOSER_MULTIUSER} \
    -e COMPOSER_PROVIDERS="${COMPOSER_PROVIDERS}" \
    -e COMPOSER_DATASOURCES="${COMPOSER_DATASOURCES}" \
    -v ~/.composer:/home/composer/.composer:Z \
    --name rest \
    --network composer_default \
    -p 3000:3000 \
    pwc/composer-rest-server-pro
