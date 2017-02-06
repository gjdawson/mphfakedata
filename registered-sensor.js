var muoncore = require('muon-core');
var assert = require('assert');
var expect = require('expect.js');


var amqpurl = process.env.MUON_URL || "amqp://muon:microservices@rabbitmq"

var muon = muoncore.create('registered-sensors', amqpurl);

var sensors = {};

// server start for timing purposes
var loadtime = new Date().getTime();

const registerSensor = (payload) => {
    if('sensorid' in payload) {
        if(typeof sensors[payload.sensorid] === 'undefined') {
            sensors[payload.sensorid] = {id: payload.sensorid};
        }
    }
}

muon.handle('/sensors', function(data, response) {

});

function connect() {
    muon.replay('mmc-sensor-data', {}, function(event) {
        // incoming sensors are recorded to a database
        registerSensor(event.payload);

    }, function(error) {
        setTimeout(connect, 1000);
    }, function(complete) {
        // done
        setTimeout(connect, 1000);
    });
}

connect();