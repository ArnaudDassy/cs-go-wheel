/* server-test
 *
 * /routes/proceed.js - express routes declarations for log in procedure
 */

"use strict";

exports.init = function( oServerInstance, inventory ) {

    oServerInstance.get( "/step_one", function( oRequest, oResponse ) {
        if(oRequest.cookies.userID){
            oResponse.redirect("http://localhost:12345/step_two");
        }
        oResponse.render( "./pages/proceed/step_one.jade" );
    } );
    
    oServerInstance.get( "/step_two", function( oRequest, oResponse ) {
        oResponse.render( "./pages/proceed/step_two.jade" );
    } );
    
    oServerInstance.get( "/proceed_login", function( oRequest, oResponse ) {
        var res = oRequest.query["openid.claimed_id"].split('/');
        var userID = res[res.length-1];
        oResponse.cookie( 'userID', userID, { expires: new Date(Date.now() + 900000) } );
        oResponse.redirect("http://localhost:12345/step_two");
        oResponse.render( "./pages/index.jade" );
    } );

};
