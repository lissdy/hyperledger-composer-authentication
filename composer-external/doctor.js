const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
let businessNetworkConnection = new BusinessNetworkConnection();
const IdCard = require('composer-common').IdCard;
const BusinessNetworkCardStore = require('composer-common').BusinessNetworkCardStore;

const fs = require('fs');
const path = require('path');
const request = require("request");

const ACCESS_TOKEN = '8QoE5XVjWFBpNzvtmQx9byinObK9dYn5uvZhbUfjNq7BOeU3THXfosUkjQFKfcCF'

let connectionProfile = {"name":"healthcare-network","type":"hlfv1","mspID":"Org1MSP","peers":[{"requestURL":"grpc://172.31.160.16:7051","eventURL":"grpc://172.31.160.16:7053"}],"ca":{"url":"http://172.31.160.16:7054","name":"ca.org1.example.com"},"orderers":[{"url":"grpc://172.31.160.16:7050"}],"channel":"composerchannel","timeout":300};

function writeCardToFile(cardFileName,card) {
       let cardFilePath;
       return card.toArchive({ type: 'nodebuffer' })
          .then( (cardBuffer)=>{
              // got the id card to write to a buffer
              cardFilePath = path.resolve(cardFileName);
              try {
                  console.log(cardFilePath)
                  fs.writeFileSync(cardFilePath,cardBuffer);
              } catch (cause) {
                  const error = new Error(`Unable to write card file: ${cardFilePath}`);
                  error.cause = cause;
                  return Promise.reject(error);
              }
          });
   }

function createIdentityCard(userName, cardName, businessNetworkName, enrollmentSecret, connectionProfile) {
    const metadata = {
        version: 1,
        userName: userName,
        businessNetwork: businessNetworkName,
    };

    if (enrollmentSecret !== null) {
        metadata.enrollmentSecret = enrollmentSecret;
    }

    let card = new IdCard(metadata, connectionProfile);
    // cardRef = BusinessNetworkCardStore.getDefaultCardName(card)
    console.log(BusinessNetworkCardStore.getDefaultCardName(card))
    return writeCardToFile('cards/'+userName+'.card',card)
}


function createDoctor(name){
  return businessNetworkConnection.connect('admin@healthcare-network')
      .then(() => {
          return businessNetworkConnection.getParticipantRegistry('org.acme.healthcare.doctor');
      })
      .then((participantRegistry) => {
          let factory = businessNetworkConnection.getBusinessNetwork().getFactory();
          let participant = factory.newResource('org.acme.healthcare', 'doctor', name);
          return participantRegistry.add(participant);
      })
      .then(() => {
          return businessNetworkConnection.disconnect();
      })
      .catch((error) => {
          console.error(error);
          process.exit(1);
      });
}



function IssueIdentity(name){
  return businessNetworkConnection.connect('admin@healthcare-network')
       .then(() => {
           return businessNetworkConnection.issueIdentity('org.acme.healthcare.doctor#'+name, name)
       })
       .then((result) => {
           console.log(`userID = ${result.userID}`);
           console.log(`userSecret = ${result.userSecret}`);
           businessNetworkConnection.disconnect();
           return result.userSecret
       })
       .catch((error) => {
           console.error(error);
           process.exit(1);
       });
}


function ImportCard(cardName){
  var options = { method: 'POST',
    url: 'http://localhost:3000/api/wallet/import',
    qs: { access_token: ACCESS_TOKEN },
    headers:{'content-type': 'multipart/form-data' },
    formData:
     { card:{ value: fs.createReadStream('cards/'+cardName+".card"),
          options:{contentType: null }},
       name: cardName } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });
}


let doctorName = 'Doctor-Ryan'
createDoctor(doctorName).then(()=>{
  return IssueIdentity(doctorName)
}).then((userSecret)=>{
  createIdentityCard(doctorName,null,'healthcare-network',userSecret,connectionProfile).then(()=>{
    ImportCard(doctorName)
  })
})
