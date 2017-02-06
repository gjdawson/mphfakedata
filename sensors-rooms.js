// Sensors and rooms
var muoncore = require('muon-core');
var assert = require('assert');
var expect = require('expect.js');


var amqpurl = process.env.MUON_URL || "amqp://muon:microservices@rabbitmq"

var muon = muoncore.create('mmc-sensors-rooms', amqpurl);

var poptimerlen = 8000;
// server start for timing purposes
var loadtime = new Date().getTime();

var roomsSensors = [
    {id:'reception', sensors: ["temp0100", "hum0002"]},
    {id:'reception2', sensors: ["temp0200", "motion0001"]},
    {id: 'bed1', sensors: ['hum0001', 'temp0003', 'motion0002']}

];

inRooms = []

const populate = () => {
    roomsSensors.map(function(o) {

        var promise = muon.emit({
            "stream-name": 'sensors-rooms',
            "event-type": 'assign-sensors-to-room',
            "service-id": 'sensors-rooms',
            "payload": o
        });
        promise.then(function (event) {

            console.dir(o);
        }).catch(function(error) {
            console.dir("FAILED< BOOO " + error)

        });
    })
}

run = (e) => {
    inRooms.push(e);
    if(inRooms.length >= roomsSensors.length) {
        console.log('All room-sensor relations populated. Exiting...');
        process.exit();
    }
    if(poptimer !== null) {
        clearTimeout(poptimer);
    }
    poptimer = setTimeout(populate, poptimerlen);
}



muon.subscribe('stream://photon/stream', {"stream-name": "sensors-rooms"},
    function (event) {
        //console.log(event);

        switch(event['event-type']) {

            case 'assign-sensors-to-room':

                console.log('Sensor relationship found');
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

//t = {"stream-name": "sensors-rooms", "event-type":"assign-sensors-to-room", "service-id": "sensors-rooms", "payload":{"id": "bed1", "sensors": ["temp0100"]}}