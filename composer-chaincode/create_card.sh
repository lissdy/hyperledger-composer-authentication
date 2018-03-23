CERT_PATH=../fabric-network/fabric-scripts/hlfv1/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem
KEYSTORE_PATH=../fabric-network/fabric-scripts/hlfv1/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk

# ~/.composer will be used to store imported cards,
# make sure current user own the folder to avoid import failed for permission reason.

if [ !`uname` == "Darwin" ]; then # no need to do this step on MAC
  USER=`whoami`
  sudo chown -R $USER ~/.composer
fi


# delete old cards
composer card delete -n PeerAdmin@healthcare-network
composer card delete -n admin@healthcare-network

# create card for org amdin to install and instantiate chaincode(bna)
# A card file named PeerAdmin@healthcare-network.card will be created after this step
# healthcare-network is specified in connection.json
composer card create -p connection.json -u PeerAdmin -c "$CERT_PATH" -k "$KEYSTORE_PATH" -r PeerAdmin -r ChannelAdmin
# import card to wallet
composer card import -f PeerAdmin@healthcare-network.card
# install the Hyperledger Composer runtime onto all of the Hyperledger Fabric peer nodes that specified in the connection profile file
# -n option must contain the same name as the business network name you intend to run on the Hyperledger Fabric peers.
# Only business networks with names(specified in package.json) matching the -n option given in this command will successfully run.
composer runtime install -c PeerAdmin@healthcare-network -n healthcare-network
# start the blockchain business network(instantiate chaincode)
composer network start -c PeerAdmin@healthcare-network -a healthcare-network@0.0.3.bna -A admin -S adminpw
composer card import -f admin@healthcare-network.card

# update bna
#composer network update -a healthcare-network@0.0.4.bna -c admin@healthcare-network
