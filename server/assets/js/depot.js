(function(){
  "use strict";

  $('.tradeItems').css('display', 'none');

  var listHidden = document.getElementById('ids'),
      listDisplayed = document.getElementById('list'),
      items,
      totalPrice = document.getElementById('totalPrice'),
      iTotalPrice,
      itemsToSend = [];

  function isLoaded() { // fonction à répéter
      items = document.getElementsByClassName('inventory__item');
      if(items.length != 0) { // si le nombre de répétitions courrant est égal au nombre de répétitions désiré, on désactive l'intervalle et on arrête la fonction
          clearInterval(interval);
          inventoryLoaded();
      }
  }
  var interval = setInterval(isLoaded, 100); // déclenchement de l'intervalle

  function inventoryLoaded(){
    for( var i = -1 ; ++i<items.length ; ){
      items[i].addEventListener('click', function(){addItem(this)}, false);
    }
  }
  function addItem(item){
    if(item.className ==  'inventory__item selectedItem'){
      //list
        var id = item.children[0].innerHTML;
        for(var i = -1 ; ++i < listDisplayed.children.length ; ){
          if(id == listDisplayed.children[i].children[0].innerHTML){

            var sPrice = listDisplayed.children[i].children[1].innerHTML;
            iTotalPrice = parseFloat(totalPrice.innerHTML);
            iTotalPrice -= parseFloat(sPrice);
            totalPrice.innerHTML = iTotalPrice.toFixed(2);

            listDisplayed.removeChild(listDisplayed.children[i]);
          }
        }

      //style
        item.className = 'inventory__item';

      //input hidden
        listHidden.value = listHidden.value.replace(('#' + id), '');

    }
    else{
      //list
        var li = document.createElement('li');
          var span = document.createElement('span');
          var id = document.createTextNode(item.children[0].innerHTML);
          span.className = 'hidden';

          var text = ( (item.children[3].children.length>1 ? 'StatTrak ' : '' ) + item.children[1].children[0].innerHTML) + " | " + (item.children[1].children[1].innerHTML) + " (" + (item.children[4].children[0].innerHTML) + ") ";
          var textNode = document.createTextNode(text);
          span.appendChild(id)
          li.appendChild(span)

          var price = document.createElement('span');
          var sPrice = item.children[4].children[1].innerHTML;
          var priceNode = document.createTextNode(sPrice);
          price.appendChild(priceNode);
          price.className = 'prices';

          li.appendChild(textNode);
          li.appendChild(price);

          listDisplayed.appendChild(li);

          iTotalPrice = parseFloat(totalPrice.innerHTML);

          iTotalPrice += parseFloat(sPrice);

          totalPrice.innerHTML = iTotalPrice.toFixed(2);


      //style
        var oldClassName = item.className;
        item.className = oldClassName + ' selectedItem';

      //input hidden
        listHidden.value += ('#' + item.children[0].innerHTML);
    }

    if(listDisplayed.children.length>0){
      $('.tradeItems').css('display', 'flex');
    }
    else{
      $('.tradeItems').css('display', 'none');
    }
  }

})();
