/**
* A transaction processor function description
* @param {org.acme.healthcare.makeAppointment} parameter-name A human description of the parameter
* @transaction
*/

function makeAppointment(tx) {
  console.log(tx);
  var appointmentId = Date.parse(tx.appointmentTime).toString();
  var doctor = tx.doctor;
  var patient = tx.patient;
  var factory = getFactory();
  return getParticipantRegistry('org.acme.healthcare.doctor')
    .then(function(participantRegistry) {
      var doctorRegistered = participantRegistry.exists(doctor.name)
    .then(function(doctorRegistered){
      if (doctorRegistered) {
        console.log('Doctor registered already');
      } else {
        console.log('Need to add doctor as participant');
        return getParticipantRegistry('org.acme.healthcare.doctor')
          .then(function(participantRegistry) {
            var newDoctor = factory.newResource('org.acme.healthcare', 'doctor', doctor.name);
            newDoctor.name = doctor.name;
            console.log('newDoctor added')
            return participantRegistry.add(newDoctor);
        })
      }
    })
  }).then(function() {
    return getParticipantRegistry('org.acme.healthcare.patient')
      .then(function(participantRegistry) {
        var patientRegistered = participantRegistry.exists(patient.name)
      .then(function(patientRegistered){
        if (patientRegistered) {
          console.log('Patient registered already');
        } else {
          console.log('Need to add patient as participant');
          return getParticipantRegistry('org.acme.healthcare.patient')
            .then(function(participantRegistry) {
              var newPatient = factory.newResource('org.acme.healthcare', 'patient', patient.name);
              newPatient.name = patient.name;
              newPatient.healthIssue = patient.healthIssue;
              console.log('new Patient added')
              return participantRegistry.add(newPatient);
          })
        }
      })
    })
  }).then(function() {
    return getAssetRegistry('org.acme.healthcare.appointment')
      .then(function(assetRegistry) {
        var newAppointment = factory.newResource('org.acme.healthcare', 'appointment', appointmentId)
        newAppointment.doctor = doctor;
        newAppointment.patient = patient;
        newAppointment.appointmentTime = tx.appointmentTime;
        newAppointment.appointmentStatus = tx.appointmentStatus;
        return assetRegistry.add(newAppointment);
    })
  }).catch(function (error) {
    console.log(error);
  });
}

/**
* A transaction processor function description
* @param {org.acme.healthcare.issueResults} parameter-name A human description of the parameter
* @transaction
*/

function issueResults(tx) {
  var resultsId = tx.appointmentId
  var factory = getFactory();
  return getAssetRegistry('org.acme.healthcare.appointment')
  	.then(function(appointmentAssetRegistry) {
      return appointmentAssetRegistry.get(tx.appointmentId)
    .then(function(appointment) {
		  return getAssetRegistry('org.acme.healthcare.results')
    .then(function(resultsAssetRegistry) {
      var newResult = factory.newResource('org.acme.healthcare', 'results', resultsId)
      newResult.appointment = appointment;
      newResult.bloodPressure = tx.results.bloodPressure;
      newResult.doctorNotes = tx.results.bloodPressure;
      newResult.weight = tx.results.bloodPressure;
      appointment.appointmentStatus = 'COMPLETED'
      appointmentAssetRegistry.update(appointment);
      resultsAssetRegistry.add(newResult);
      })
    })
  }).catch(function (error) {
    console.log(error);
  });
}