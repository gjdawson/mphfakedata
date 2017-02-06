// Populate a set of rooms

var muoncore = require('muon-core');
var assert = require('assert');
var expect = require('expect.js');


var amqpurl = process.env.MUON_URL || "amqp://muon:microservices@rabbitmq"

var muon = muoncore.create('mmc-rooms-populator', amqpurl);


var poptimerlen = 8000;



const outRooms = [
    {id: 'reception', name: 'Living Room', occupied: true},
    {id: 'reception2', name: 'Dining Room', occupied: true},
    {id: 'kitchen', name: 'Kitchen', occupied: true},
    {id: 'bed1', name: 'Master Bedroom', occupied: true}
];

var inRooms = [];

const populate = () => {


    outRooms.map(function(o) {

        var promise = muon.emit({
            "stream-name": 'registered-rooms',
            "event-type": 'room-created',
            "service-id": 'mmc-rooms-assigned',
            "payload": o
        });
        promise.then(function (event) {
            var now = new Date().getTime()
            console.log('Sent room: ' + o);
        }).catch(function(error) {
            console.dir("FAILED< BOOO ");
            console.dir(error);

        });
    })
}

run = (e) => {
    inRooms.push(e);
    if(inRooms.length >= outRooms.length) {
        console.log('All rooms populated. Exiting...');
        process.exit();
    }
    if(poptimer !== null) {
        clearTimeout(poptimer);
    }
    poptimer = setTimeout(populate, poptimerlen);
}

var stream = muon.subscribe('stream://photon/stream', {"stream-name": "registered-rooms"},
    function (event) {
        //console.log(event);

        switch(event['event-type']) {

            case 'room-created':

                console.log('Room found');
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


//t = {"stream-name": "registered-sensors", "event-type":"sensor-connected", "service-id": "sensor-registry", "payload":{"id": "temp0100"}}