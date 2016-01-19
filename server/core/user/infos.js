"use strict";

var request = require('request');

var result = '';


function fRequest(id){
  request('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=44A48099D12AE20F272E30BCEC1D0E33&steamids='+id,
    function (error, response, body) {
      var userInfos = JSON.parse(body);
      var userInfosParsed = userInfos.response.players[0];
      result = userInfosParsed;
    }
  );
}

exports.loadUserInfos = function(id) {
    fRequest(id);
};

exports.getUserInfos = function(id) {
    return result;
};
