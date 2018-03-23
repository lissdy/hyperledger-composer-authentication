# Step Zero: Destroy a previous setup
If you've setup a previous fabric network, in case of container name conflict, you may want to kill and remove all previous Docker containers, which you can do with these commands:

```
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q) // remove old chaincode images
```

# Step One: Starting a Hyperledger Fabric network

Start a clean Hyperledger Fabric by running the following commands:

```
cd fabric-network
./stopFabric.sh
./teardownFabric.sh
./downloadFabric.sh
./startFabric.sh
```

The simple Hyperledger Fabric network is made up of a single organization called Org1. The organization uses the domain name org1.example.com. Additionally, the Membership Services Provider (MSP) for this organization is called Org1MSP.

Find more details:
https://hyperledger.github.io/composer/tutorials/deploy-to-fabric-single-org


# Step Two: Deploying Hyperledger Composer bna to fabric network

**note: please edit connection.json, and replace all localhost with your host ip.**

```
cd ../composer-chaincode
./create_card.sh
```
# Step Three: Starting Composer Rest Server

```
cd ../authentication-demo
./start_rest_server.sh
```

# Step Three: Starting Explorer

```
cd ../blockchain-explorer
npm install
./start.sh
```
