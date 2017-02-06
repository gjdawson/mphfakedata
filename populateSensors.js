// Populate a set of rooms

var muoncore = require('muon-core');
var assert = require('assert');
var expect = require('expect.js');


var amqpurl = process.env.MUON_URL || "amqp://muon:microservices@rabbitmq"

var muon = muoncore.create('sensors-populator', amqpurl);

var poptimerlen = 8000;

const outSensors = [
    {id: 'temp0100', type: 'temp'},
    {id: 'temp0200', type: 'temp'},
    {id: 'temp0300', type: 'temp'},
    {id: 'motion0001', type: 'motion'},
    {id: 'motion0002', type: 'motion'},
    {id: 'motion0003', type: 'motion'},
    {id: 'hum0001', type: 'humidity'},
    {id: 'hum0002', type: 'humidity'},
    {id: 'hum0003', type: 'humidity'}
];

var inSensors = [];

const populate = () => {


    outSensors.map(function(o) {

        var promise = muon.emit({
            "stream-name": 'registered-sensors',
            "event-type": 'sensor-connected',
            "service-id": 'sensors-populator',
            "payload": o
        });
        promise.then(function (event) {
            var now = new Date().getTime()
            console.log('Sent sensor: ' + o);
        }).catch(function(error) {
            console.dir("FAILED< BOOO " + error)

        });
    })
}


run = (e) => {
    inSensors.push(e);
    console.log('Restarting populator');
    if(inSensors.length >= outSensors.length) {
        console.log('All sensors populated. Exiting...');
        process.exit();
    }
    if(poptimer !== null) {
        clearTimeout(poptimer);
    }
    poptimer = setTimeout(populate, poptimerlen);
}

muon.subscribe('stream://photon/stream', {"stream-name": "registered-sensors"},
    function (event) {
        //console.log(event);

        switch(event['event-type']) {

            case 'sensor-connected':

                console.log('Sensor found');
                console.log(event.payload);

                run(event.payload)
                break;
        }
    }.bind(this),
    function (error) {
        console.dir(error);
    },
    function () {
        console.log('Stream Completed');
    }
)

var poptimer = setTimeout(populate, poptimerlen);