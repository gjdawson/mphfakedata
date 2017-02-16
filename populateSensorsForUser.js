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