"use strict";

var nedb = require('nedb'),
    db = new nedb({ filename:'./database', autoload: true });

module.exports = db;
