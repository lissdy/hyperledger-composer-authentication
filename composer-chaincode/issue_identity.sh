#composer participant add -c admin@healthcare-network -d '{"$class":"org.acme.healthcare.doctor","name":"Lisa"}'
#composer identity issue -c admin@healthcare-network -f Lisa.card -u doctor-Lisa -a "resource:org.acme.healthcare.doctor#Lisa"

#composer card create --file I.card --businessNetworkName healthcare-network --connectionProfileFile connection.json --user Doctor-I --enrollSecret UJFwalHsRgBA
