```
docker build -t pwc/composer-rest-server-pro .
```

```
docker run \
    -d \
    -e COMPOSER_CARD=${COMPOSER_CARD} \
    -e COMPOSER_NAMESPACES=${COMPOSER_NAMESPACES} \
    -e COMPOSER_AUTHENTICATION=${COMPOSER_AUTHENTICATION} \
    -e COMPOSER_MULTIUSER=${COMPOSER_MULTIUSER} \
    -e COMPOSER_PROVIDERS="${COMPOSER_PROVIDERS}" \
    -e COMPOSER_DATASOURCES="${COMPOSER_DATASOURCES}" \
    -v ~/.composer:/home/composer/.composer \
    --name rest \
    --network composer_default \
    -p 3000:3000 \
    pwc/composer-rest-server-pro
```
