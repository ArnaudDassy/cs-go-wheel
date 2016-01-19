/* server-test
 *
 * /routes/main.js - main express routes declarations
 */

"use strict";

var nedb = require('nedb'),
    db = new nedb({ filename:'./db', autoload: true }),
    userInfos = require('../core/user/infos.js'),
    userInv = require('../core/user/inventory.js'),
    multer = require('multer'),
    upload = multer(),
    User = {
      userID : '',
      coins : 0,
      droppedSkin : [],
      played : 0,
      coinsEarned : 0,
      skinsBought : [
        //{
        //  date : 'date',
        //  id : 'id',
        //  name : 'name',
        //  price : 'price'
        //}
      ],
      coinsHistory : []
    },
    oUser;

var userInformations, userInventory;

Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

exports.init = function( oServerInstance, inventory ) {

    //Accueil
    oServerInstance.get( "/index", function( oRequest, oResponse ) {
        oResponse.render( "./pages/index.jade" );
    } );

    //L'utilisateur accède à son profil
    oServerInstance.get( "/profil", function( oRequest, oResponse ) {
        oResponse.render( "./pages/profil.jade");
    } );

    // //L'utilisateur met à jour son url d'échange
    // oServerInstance.post('/profil', upload.array(), function( oRequest, oResponse ) {
    //     User.userID = oRequest.cookies.userID;
    //     db.update({'userID' : User.userID}, User, {}, function(err, numberOfReplace, updatedUser){});
    //     oResponse.render( "./pages/profil.jade");
    // } );

    //L'utilisateur accède à la page dépot
    oServerInstance.get( "/depot", function( oRequest, oResponse ) {
        oResponse.render( "./pages/depot.jade" );
    } );

    //L'utilisateur dépose des skins -> demande d'échange
    oServerInstance.post( "/depot", function( oRequest, oResponse ){
        var aItems = oRequest.body.ids.split('#');
        var date = new Date();
        var parsedDate = date.getDate()+'/'+(date.getMonth() +1 )+'/'+date.getFullYear()+'  '+( date.getHours() < 10 ? '0' + date.getHours() : date.getHours() )+':'+( date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() )+':'+( date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() );
        var UserMinInv = userInv.getItemsMinInfo(oRequest.body.ids);
        db.findOne({'userID' : oRequest.cookies.userID}, function(err, usr){
            oUser = usr;
            var newTrade = {
                id: usr.droppedSkin.length + 1,
                date: parsedDate,
                status: 'waiting',
                totalPrice: UserMinInv.totalPrice,
                skins: UserMinInv.aSkins
            };
            oUser.droppedSkin.push(newTrade);
            oUser.coins += (newTrade.totalPrice * 100);
            db.update({'userID' : oUser.userID}, oUser, {}, function(err, numberOfReplace, updatedUser){
            });
        });

        // require('../core/bot/offer.js').makeOffer(aItems, oRequest.cookies.userID, 'AERER');
        oResponse.render( "./pages/depot.jade" );
    } );

    oServerInstance.get( "/login", function( oRequest, oResponse ) {
        //Getting id from steam
          var res = oRequest.query["openid.claimed_id"].split('/');
          var userID = res[res.length-1];

        //Looking if the user is already in the database
          db.findOne({'userID' : userID}, function(err, user){
            oResponse.cookie( 'userID', userID, { expires: new Date(Date.now() + 604800000) } );
            if(user == null){
              User.userID = userID;
              db.insert(User, function(err, newDoc){
                oResponse.redirect("http://localhost:12345/profil#tradeURL");
              })
            }
            else{
              if(user.tradeURL != ''){
                userInformations = userInfos.loadUserInfos(userID);
                userInventory = userInv.loadUserInventory(userID);
                oResponse.redirect("http://localhost:12345/index");
              }
              else{
                oResponse.redirect("http://localhost:12345/profil#tradeURL");
              }
            }
          });
    } );

    oServerInstance.get( "/logout", function( oRequest, oResponse ) {
        oResponse.clearCookie( 'userID' );
        oResponse.redirect("http://localhost:12345/index");
    } );

    oServerInstance.get( "/jouer", function( oRequest, oResponse ) {
        oResponse.render( "./pages/game.jade");
    } );

    oServerInstance.post( "/gameresult", function( oRequest, oResponse ) {
        db.findOne({'userID' : oRequest.cookies.userID}, function(err, usr){
            oUser = usr;
            oUser.coins += parseInt(oRequest.body.result);
            oUser.played++;
            var temp = oUser.coinsHistory.length + 1;
            oUser.coinsHistory.push({
                id: temp,
                gain: oRequest.body.result,
                date: oRequest.body.date
            });
            if(oRequest.body.result > -1){
                oUser.coinsEarned += (parseInt(oRequest.body.result) + 10);
            }
            db.update({'userID' : oUser.userID}, oUser, {}, function(err, numberOfReplace, updatedUser){
                oResponse.send('ok');
            });
        });
    } );

    oServerInstance.get( "/user", function( oRequest, oResponse) {
        if(!(oRequest.cookies.userID)){
            oResponse.send(['not logged', 'no infos']);
        }else{
            db.findOne({'userID' : oRequest.cookies.userID}, function(err, usr){
                var infos = userInfos.getUserInfos();
                oResponse.send([usr, infos]);
            });
        }
    } );
    oServerInstance.get('/resetuser', function( oRequest, oResponse) {

        db.update({'userID' : oRequest.cookies.userID}, User, {}, function(err, numberOfReplace, updatedUser){

        });
        oResponse.redirect("http://localhost:12345/index");

    } );

    oServerInstance.post( "/getinventory", function( oRequest, oResponse ){
      if(!(oRequest.cookies.userID)){
        oResponse.send(['not logged', 'no infos']);
      }else{
        var inv = userInv.getUserInventory();
        oResponse.send([inv]);
      }
    } );
};

exports.trade = function(){

}