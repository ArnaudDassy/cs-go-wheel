/* server-test
 *
 * /core/express.js - express configuration
 */

"use strict";

var express = require( "express" ),
    cors = require("cors"),
    cookieParser = require("cookie-parser");

var nedb = require('nedb'),
    db = new nedb({ filename:'./database', autoload: true });
var bodyParser = require('body-parser');

var oApp;

// instantiate express
  oApp = express();

//Log bots
//  require('./bot/offer.js').logBot();

// configure middlewares
  // oApp.use( require( "./express/middlewares/log.js" ) );
  oApp.use( cookieParser() );
  oApp.use(bodyParser.json());
  oApp.use(bodyParser.urlencoded({ extended: true }));

// configure engine
  oApp.set( "views", __dirname + "/../views" );
  oApp.set( "view engine", "jade" );

// configure static
  oApp.use( express.static( __dirname + "/../assets" ) );

// configure routes
  require( __dirname + "/../routes/main.js" ).init( oApp );
  require( __dirname + "/../routes/proceed.js" ).init( oApp );


// listen port
  oApp.listen( 12345 );
  console.log( "Server is listening port 12345." );
