// Populate a set of rooms

var muoncore = require('muon-core');
var expect = require('expect.js');


var amqpurl = process.env.MUON_URL || "amqp://muon:microservices@rabbitmq"

var muon = muoncore.create('mmc-rooms-populator', amqpurl);


var poptimerlen = 8000;
var popTimers = {};

const outRooms = [
    {id: 'reception', name: 'Living Room', occupied: true},
    {id: 'reception2', name: 'Dining Room', occupied: true},
    {id: 'kitchen', name: 'Kitchen', occupied: true},
    {id: 'bed1', name: 'Master Bedroom', occupied: true}
];

var userRoomStores = {};

const populate = (userid = false) => {

    if(userid == false) return false;

    outRooms.map(function(o) {

        if(typeof userRoomStores[userid]['rooms'][o.id] == 'undefined') {
            console.log('Emitting room '+ o.id+' for '+userid);
            var promise = muon.emit({
                "stream-name": 'registered-rooms-'+userid,
                "event-type": 'room-created',
                "service-id": 'mmc-rooms-assigned',
                "payload": o
            });
            promise.then(function (event) {
                var now = new Date().getTime()
                console.log('Sent room: ');
                console.dir(o);
            }).catch(function(error) {
                console.dir("FAILED< BOOO ");
                console.dir(error);

            });
        }


    })
}

const listenRegisters = () => {

    //muon.replay("aether-user-accounts")

    var listen = muon.replay("aether-password-registration", {}, function (event) {
        if(event['event-type'] == 'UserAccountUpdated') {
            console.log('User registered');
            console.dir(event.payload);
            if(!hasUserStore(event.payload.id)) {
                genUserStore(event.payload.id) // aether needs standardised ID of some sort?
                connectRoom(event.payload.id)
                popTimers[event.payload.id] = setTimeout(function() {
                    populate(event.payload.id);
                }, poptimerlen);
            }

        }
    }, (error) => {
        setTimeout(listenRegisters, 1000)
    }, (complete) => {
        setTimeout(listenRegisters, 1000)
    })
}

// Connect to a rooms stream

const connectRoom = (userid = false) => {
    if(userid == false) return false;

    var stream = muon.subscribe('stream://photon/stream', {"stream-name": "registered-rooms-" + userid},
        function (event) {
            //console.log(event);

            switch(event['event-type']) {

                case 'room-created':

                    console.log('Room found');
                    console.log(event.payload);
                    registerRoom(event.payload, userid)
                    break;
            }
        }.bind(this),
        function (error) {
            setTimeout(function() {
                connectRoom(userid);
                //stream.cancel();
            })
        },
        function () {
            console.log('Stream Completed');
        }
    )
}

const genUserStore = (userid) => {
    if(userid == false) return false;

    if(typeof userRoomStores[userid] == 'undefined') {
        console.log('Creating storage');
        let o = {};
        o[userid] = {id: userid, rooms: {}}

        userRoomStores = Object.assign(userRoomStores, o);
        console.dir(userRoomStores);
    }
}

const hasUserStore = (userid) => {
    if(userid in userRoomStores) return true;
    return false;
}

const registerRoom = (payload = {}, userid = false) => {
    if(userid == false) return false;
    userRoomStores[userid]['rooms'][payload.id] = payload;
    if(popTimers[userid] !== null) {
        clearTimeout(popTimers[userid])
    }
    popTimers[userid] = setTimeout(function() {
        populate(userid);
    }, poptimerlen);
}

listenRegisters();