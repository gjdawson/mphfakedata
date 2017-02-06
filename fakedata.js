var muoncore = require('muon-core');
var assert = require('assert');
var expect = require('expect.js');

var amqpurl = process.env.MUON_URL || "amqp://muon:microservices@rabbitmq"

var muon = muoncore.create('sensors', amqpurl);

function perform() {

    //console.log(s);


    var rand = Math.round(Math.random() * 5000) + 1000;
    setTimeout(function () {
        let s = sensors[Math.floor(Math.random() * sensors.length)].slice();
        var now = new Date().getTime();

        var promise = muon.emit({
            "stream-name": 'sensor-data-' + s,
            "event-type": 'sensor-data',
            "service-id": 'sensor-data',
            "payload": {
                "sensorid": s,
                "value": Math.floor(Math.random() * 100) + 1,
                "time": now
            }
        });
        promise.then(function (event) {
            var now = new Date().getTime()
        }).catch(function(error) {
            console.dir("FAILED< BOOO ")
            console.dir(error);
        });
    }, rand);

}

var sensors = [
    'temp0100',
    'temp0200',
    'temp0300',
    'motion0001',
    'motion0002',
    'motion0003',
    'hum0001',
    'hum0002',
    'hum0003'
];

(function loop() {
    var rand = Math.round(Math.random() * 4000) + 600;
    setTimeout(function() {
        perform();
        loop();
    }, rand);
}());
