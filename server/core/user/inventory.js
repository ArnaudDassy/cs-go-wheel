
"use strict";

var request = require('request');

// install the 'onceler' package first
var TOTP = require('onceler').TOTP;

// create a TOTP object with your Secret
var totp = new TOTP('3JEX2HPQH3VLPFW7');

// print out a code that's valid right now
var code = totp.now();

var result, names;

function fRequestItems(id){
  request('http://steamcommunity.com/profiles/'+ id +'/inventory/json/730/2', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var inventory = JSON.parse(body);
      var rgInventory = inventory.rgInventory;
      var rgDescription = inventory.rgDescriptions;
      var idOfItems = [];
      var allMyItems = [];
      var tradableInventory = [];

      //loop to get identifier of object rgInventory
      for(var item in rgInventory){
        idOfItems.push(item);
      }

      //loop to get all my item (id + classid)
      for(var i = -1 ; ++i < idOfItems.length ; ){
        var isInArray = false;
        var oItem = {
          id:'',
          classid:'',
          instanceid:''
        }
        oItem.id = rgInventory[idOfItems[i]].id;;
        oItem.classid = rgInventory[idOfItems[i]].classid;
        oItem.instanceid = rgInventory[idOfItems[i]].instanceid;
        allMyItems.push(oItem);
      }
      idOfItems = [];

      //loop to get identifier of object rgDescription
      for(var item in rgDescription){
        idOfItems.push(item);
      }

      //loop to get more infos about skins and fill a array with only tradable items
      for(var i = -1 ; ++i < idOfItems.length ; ){
        for(var y = -1 ; ++y < allMyItems.length ; ){
          if ( idOfItems[i] == (allMyItems[y].classid+'_'+allMyItems[y].instanceid) ) {
            //TO GET : *id - *nom item - *nom skin - *url - *rarity - *st - *quality - *price - *showable
            //Nom - skin - st
              var fullName = rgDescription[idOfItems[i]].market_hash_name;
              var exploded_fullName = fullName.split(' (');
              var exploded_again = exploded_fullName[0].split(' | ');
              if(exploded_again[0].search('StatTrak') == -1){
                allMyItems[y].item_name = exploded_again[0];
                allMyItems[y].stattrak = false;
              }else{
                var string = exploded_again[0].split('StatTrak™ ');
                allMyItems[y].item_name = string[1];
                allMyItems[y].stattrak = true;
              }
              allMyItems[y].skin_name = exploded_again[1];

            //Quality - rarity
              allMyItems[y].tags = rgDescription[idOfItems[i]].tags;

            //Icon url
              allMyItems[y].icon_url = rgDescription[idOfItems[i]].icon_url;

            //Market name
              allMyItems[y].market_hash_name = rgDescription[idOfItems[i]].market_hash_name;

            //Type
              allMyItems[y].type = rgDescription[idOfItems[i]].type;

            //Gettable
              allMyItems[y].tradable = false;
              if( (rgDescription[idOfItems[i]].tradable == 1 && rgDescription[idOfItems[i]].marketable == 1) && (allMyItems[y].type.search('Music Kit') == -1 && allMyItems[y].type.search('Container') == -1 )){
                allMyItems[y].tradable = true;
              }

            //Cleaning the mess
              if(allMyItems[y].tradable){
                var rarityName = allMyItems[y].tags[4].internal_name;
                var exploded = rarityName.split('_');
                allMyItems[y].rarity = exploded[1];
                var quality = exploded_fullName[1].split(')');
                allMyItems[y].quality = quality[0];
                allMyItems[y].tags = {};
                names += allMyItems[y].market_hash_name + '!END!';
                // console.log('************************');
                // console.log(allMyItems[y]);
                // console.log('________________________');
                tradableInventory.push(allMyItems[y]);
              }
          }
        }
      }
      fRequestPrices(tradableInventory);
    }
  })
}

function fRequestPrices(oInv){
  var inv = oInv;
  var URINames = encodeURI(names).replace('undefined', '');
  request('https://bitskins.com/api/v1/get_item_price/?api_key=a7551c3a-8fec-4521-91d7-09f65fba108e&names='+ URINames +'&delimiter=!END!&code=' + code, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var JSONPrices = JSON.parse(body);
      for( var i = -1 ; ++i < inv.length ; ){
        inv[i].price = JSONPrices.data.prices[i].price;
      }
      result = inv;
    }
    else{
      // console.log(error);
      // console.log(response);
      // console.log(body);
    }
  })
}

exports.loadUserInventory = function(id) {
  fRequestItems(id);
};

exports.getUserInventory = function() {
  return result;
};

exports.getItemsMinInfo = function(sIds){
    var aItemsId = sIds.split('#');
    var aTrade = {
        totalPrice: 0,
        aSkins: []
    };
    var oItem = {};
    for(var y = -1 ; ++y<aItemsId.length ; ){
        for(var i = -1 ; ++i<result.length ; ){
            if(aItemsId[y] == result[i].id){
                oItem.id = aItemsId[y];
                oItem.name = result[i].market_hash_name;
                oItem.price = result[i].price;
                oItem.imgUrl = result[i].icon_url;
                aTrade.totalPrice += parseFloat(oItem.price);
                aTrade.aSkins.push(oItem);
                oItem = {};
            }
        }
    }
    aTrade.totalPrice = aTrade.totalPrice.toFixed(2);
    return aTrade;
};
