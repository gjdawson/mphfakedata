#!/bin/bash

node populateRooms.js
node populateSensors.js
node sensors-rooms.js
npm run start