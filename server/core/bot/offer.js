var fs = require('fs');
var crypto = require('crypto');
var request = require('request');

var Steam = require('steam');
var SteamWebLogOn = require('steam-weblogon');
var getSteamAPIKey = require('steam-web-api-key');
var SteamTradeOffers = require('steam-tradeoffers'); // change to 'steam-tradeoffers' if not running from the examples subdirectory

var steamClient = new Steam.SteamClient();
var steamUser = new Steam.SteamUser(steamClient);
var steamFriends = new Steam.SteamFriends(steamClient);
var steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
var offers = new SteamTradeOffers();

var apiKey;

exports.logBot = function(){
  var logOnOptions = {
    account_name: '*******',
    password: '********'
  };

  var authCode = '2GMG8'; // code received by email

  try {
    logOnOptions.sha_sentryfile = getSHA1(fs.readFileSync('sentry'));
  } catch (e) {
    if (authCode !== '') {
      logOnOptions.auth_code = authCode;
    }
  }

  // if we've saved a server list, use it
  if (fs.existsSync('servers')) {
    Steam.servers = JSON.parse(fs.readFileSync('servers'));
  }

  steamClient.connect();
  steamClient.on('connected', function() {
    steamUser.logOn(logOnOptions);
  });

  steamClient.on('logOnResponse', function(logonResp) {
    if (logonResp.eresult === Steam.EResult.OK) {
      console.log('Logged in!');
      steamFriends.setPersonaState(Steam.EPersonaState.Online);

      steamWebLogOn.webLogOn(function(sessionID, newCookie) {
        getSteamAPIKey({
          sessionID: sessionID,
          webCookie: newCookie
        }, function(err, APIKey) {
          offers.setup({
            sessionID: sessionID,
            webCookie: newCookie,
            APIKey: APIKey
          }, apiKey = APIKey);
        });
      });
    }
  });

  steamClient.on('servers', function(servers) {
    fs.writeFile('servers', JSON.stringify(servers));
  });

  steamUser.on('updateMachineAuth', function(sentry, callback) {
    fs.writeFileSync('sentry', sentry.bytes);
    callback({ sha_file: getSHA1(sentry.bytes) });
  });

  function getSHA1(bytes) {
    var shasum = crypto.createHash('sha1');
    shasum.end(bytes);
    return shasum.read();
  }
}

exports.makeOffer = function(aItems, sUserSteamId, sCode) {

    var aItemsToTrade = [];

    for( var i = 0 ; ++i < aItems.length ; ){
        aItemsToTrade[i-1] = {
            appid: 730,
            contextid: 2,
            amount: 1,
            assetid: aItems[i]
        }
    }

    offers.makeOffer ({
        partnerSteamId: '76561198015275910',
        itemsFromMe: aItemsToTrade,
        itemsFromThem: [],
        message: 'Protection code : '+ sCode
    }, function(err, response) {
        if (err) {
            throw err;
        }
        console.log(response);
        checkTrade(response);
    });

};

function checkTrade(response) {
    var steamResponse = response;
    request( "http://api.steampowered.com/IEconService/GetTradeOffer/v1/?key=" + apiKey + "&tradeofferid=" + response.tradeofferid, function (error, serverResponse, body) {
        if (!error && serverResponse.statusCode == 200) {
            var parsedBody = JSON.parse(body);
            if(parsedBody.response.offer.trade_offer_state != 3){
                setTimeout(checkTrade(steamResponse), 500);
                console.log('trade not ok');
            }
            if(parsedBody.response.offer.trade_offer_state == 3){
                console.log('trade ok');
            }
        }
    });
}
