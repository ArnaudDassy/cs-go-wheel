(function(){
  // TODO: Use fs to read number of files

  "use strict";

  //Global variables
    var arrayOfCombinaisons = [],
        i = 0,
        indexes = [0,1,2,3,4,5,6],
        aImages = [],
        aSlotsObject = [],
        combinaison;
  //End Global variables

  // Init images
    function initImages(){
      var tags = [
        "", "decoi", "glock", "ak", "m4", "deagle", "awp", "cut"
      ];
      while(++i < 8){
        var img = document.createElement('img')
        img.src = './img/slotmachine/' + i + '.png';
        img.alt = tags[i];
        aImages.push(img);
      };
    };
  //End Init Images

  //Init Canvas
    var canvas = [
      document.getElementById('slot_one'),
      document.getElementById('slot_two'),
      document.getElementById('slot_three'),
    ];
  //End Init Canvas

  //Tools
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;

    };
  //End Tools

  //Event Listener
    document.getElementById('playButton').addEventListener('click', function(){
      play();
    }, false);

    window.addEventListener('load', function(){
      arrayOfCombinaisons = allCombinaisons();
      initImages();
      for( var i = -1 ; ++i<3 ; ){
        aSlotsObject.push(new Slot(canvas[i], i));
        aSlotsObject[i].fillSkins(shuffle(indexes));
        aSlotsObject[i].renderSkins();
      };
    }, false);
  //End Event Listener

  //Game function
    function play(){
      var aSetOfCombinaisons = shuffle(arrayOfCombinaisons);
      var index = ~~( Math.random() * aSetOfCombinaisons.length )
      combinaison = aSetOfCombinaisons[index];
      for( var i = -1 ; ++i<3 ; ){
        aSlotsObject[i].canIStop = false;
        aSlotsObject[i].fillSkins(shuffle(indexes));
        aSlotsObject[i].renderSkins();
        aSlotsObject[i].animationLoop();
      }
      setTimeout(stopSlotOne, 1000);
      setTimeout(stopSlotTwo, 1800);
      setTimeout(stopSlotThree, 2600);
      setTimeout(returnScore, 3000);

    }

    function stopSlotOne(){
      aSlotsObject[0].canIStop = true;
    }
    function stopSlotTwo(){
      aSlotsObject[1].canIStop = true;
    }
    function stopSlotThree(){
      aSlotsObject[2].canIStop = true;
    }

    function allCombinaisons(){
      var a,b,c,array;
      a=b=c=0;
      array = [];
      var arrayOfWinningCombinaisons = {
        '111' : 463,
        '222' : 479,
        '333' : 159,
        '444' : 79,
        '555' : 47,
        '666' : 23,
        '777' : 7,
      };
      for( ; ++a < 8 ; ){
        for( ; ++b < 8 ; ){
          for( ; ++c < 8 ; ){
            if( a == b && b == c ){
              var index = a+''+b+''+c;
              for( var i = -1 ; ++i < arrayOfWinningCombinaisons[index] ; ){
                array.push(a+''+b+''+c);
              }
            }
            array.push(a+''+b+''+c);
          }//End loop on c
          c = 0
        }//End loop on b
        b = 0
      }//End loop on a
      return array;
    };
  //End Game function


  /*
  *|*|*|*|*|*|*|*|*|*|*|*
  *|*|* C A N V A S *|*|*
  *|*|*|*|*|*|*|*|*|*|*|*
                       */
var Slot = function(oCanvas, iId){
  var that = this;
  this.skins = [];
  this.ctx = oCanvas.getContext("2d");
  this.animationFrameId = 0;
  this.speed = 30;
  this.canIStop = false;
  this.id = iId + 1;

  this.fillSkins = function(aOrder){
    var i = -1;
    for( ; ++i<aImages.length ; ){
      that.skins[i] = {
        name: aImages[aOrder[i]].alt,
        skinImageName : aOrder[i]+1,
        position: i,
        dy: (5 * (i+1)) + (i*136),
        img: aImages[aOrder[i]]
      }
    }
  }

  this.renderSkins = function(){
    var i = -1;
    that.ctx.clearRect(0,0,oCanvas.width,oCanvas.height);
    for( ; ++i<that.skins.length ; ){
      that.ctx.drawImage(that.skins[i].img, 0, 0, 512, 384, 5, that.skins[i].dy, 184, 136);
    }
  }

  this.animation = function(){
    var i = -1;

    for( ; ++i<that.skins.length ; ){

      that.skins[i].dy += that.speed ;

      // that.skins[i].img.style.blur = '30px';

      if(that.skins[i].dy > 985){
        var goTo;
        i == 6 ? goTo = 0 : goTo = i+1;
        that.skins[i].dy = (that.skins[goTo].dy)-5-136;
      }

      if(that.canIStop){
        var startIndex = that.id -1;
        var myKey = combinaison.substring(startIndex,that.id);
        if(that.skins[i].skinImageName == myKey){
          if( that.skins[i].dy > 650 && that.skins[i].dy < 740 ){
            that.skins[i].dy = 660;
            i == 0 ? goTo = 6 : goTo = i-1;
            that.skins[goTo].dy = (that.skins[i].dy)-5-156;
            window.cancelAnimationFrame(that.animationFrameId);
          }
        }
      }

    }
    that.renderSkins();
  }

  this.animationLoop = function(){
    that.animationFrameId = window.requestAnimationFrame(that.animationLoop);
    that.animation();
  }
};

  /*
  *|*|*|*|*|*|*|*|*|*|*|*
  *|*|*  S C O R E  *|*|*
  *|*|*|*|*|*|*|*|*|*|*|*
                       */
function returnScore(){
  var aScore = {
    '111' : 0,
    '222': 10,
    '333': 30,
    '444': 50,
    '555': 100,
    '666': 200,
    '777': 1000
  };

  var historyList = document.getElementById('history');
  var li = document.createElement('li');
  var span = document.createElement('span');
  var spanDate = document.createElement('span');


  var a,b,c;
  a = combinaison.substring(0,1);
  b = combinaison.substring(1,2);
  c = combinaison.substring(2,3);

  spanDate = document.createElement('span');
  var date = new Date();
  var parsedDate = date.getDate()+'/'+(date.getMonth() +1 )+'/'+date.getFullYear()+'  '+( date.getHours() < 10 ? '0' + date.getHours() : date.getHours() )+':'+( date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() )+':'+( date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() );
  textNode = document.createTextNode(parsedDate);
  spanDate.appendChild(textNode);
  spanDate.className = 'dateHistory';
  li.appendChild(spanDate);

  var text, score, className;
  if(a == b && b == c){
    score = aScore[combinaison];
    !score ? text = '0 coins' : text = '+'+score+' coins';
    !score ? className = 'badScore' : className = 'goodScore';
  }
  else{
    score = 0;
    text = '0 coins';
    className = 'badScore';
  }

  var textNode = document.createTextNode(text);
  span.appendChild(textNode);
  span.className = className;
  li.appendChild(span);
  var liOrder = ""+(-1)*(historyList.children.length)
  li.style.order = liOrder;
  historyList.appendChild(li);

  var parsedScore = (score-10)+'';
  $.ajax({
    url : './gameresult',
    type: 'post',
    data: {
      result: parsedScore,
      date: parsedDate
    },
    dataType: 'text'
  })
}

})();
