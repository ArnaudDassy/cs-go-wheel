(function(){
  'use strict';

  $.ajax({
    url : './getinventory',
    type: 'post',
    dataType: 'json',
    beforeSend: function(request){

      $('.inventory').append('<img class="loader" src="../img/ajax-loader.gif" alt="Chargement de l\'inventaire en cours ..." /><span class="loader_text">Chargement de l\'inventaire en cours</span>');
    },
    success: function(body, statut){
        console.log(body);
      if(body[0] != 'not logged'){
        var userInventory = body[0];
        var inventorySection = document.getElementById('inventory');
        for( var i = -1 ; ++i < userInventory.length ; ){

          //Creating Element + text Node
            var div_container = document.createElement('div');

              var span_hidden = document.createElement('span');
                span_hidden.innerHTML = userInventory[i].id;

              var div_item_name = document.createElement('div');
                var p_item_name = document.createElement('p');
                var p_skin_name = document.createElement('p');
                  p_item_name.innerHTML = userInventory[i].item_name;
                  p_skin_name.innerHTML = userInventory[i].skin_name;

              var img_skin = document.createElement('img')
                img_skin.src = 'http://cdn.steamcommunity.com/economy/image/' + userInventory[i].icon_url;
                img_skin.alt = 'skin image';

              var div_tags = document.createElement('div');
                var p_rarity_tag = document.createElement('p');
                  p_rarity_tag.innerHTML = userInventory[i].rarity;

                if(userInventory[i].stattrak){
                var p_st_tag = document.createElement('p');
                  p_st_tag.innerHTML = 'ST';
                  p_st_tag.className = 'inventory__item__tags__st';
                }

              var div_quality_price = document.createElement('div');
                var span_quality = document.createElement('span');
                  span_quality.innerHTML = userInventory[i].quality;
                var span_price = document.createElement('span');
                  span_price.innerHTML = userInventory[i].price;

          //Setting class name
            div_container.className = 'inventory__item';
            span_hidden.className = 'itemID hidden';
            div_item_name.className = 'inventory__item__name';
            img_skin.className = 'inventory__item__img';
            div_tags.className = 'inventory__item__tags';
            p_rarity_tag.className = 'inventory__item__tags__rarity quality__'+userInventory[i].rarity;
            div_quality_price.className = 'inventory__item__quality_and_price';
            span_quality.className = 'inventory__item__quality';
            span_price.className = 'inventory__item__price';

          //Appending
            div_quality_price.appendChild(span_quality);
            div_quality_price.appendChild(span_price);

            userInventory[i].stattrak ? div_tags.appendChild(p_st_tag) : null ;
            div_tags.appendChild(p_rarity_tag);

            div_item_name.appendChild(p_item_name);
            div_item_name.appendChild(p_skin_name);

            div_container.appendChild(span_hidden);
            div_container.appendChild(div_item_name);
            div_container.appendChild(img_skin);
            div_container.appendChild(div_tags);
            div_container.appendChild(div_quality_price);

            inventorySection.appendChild(div_container);
        }

        $('.loader').remove();
        $('.loader_text').remove();

      }
      else{
        console.log('pas okok');
      }
    },
    error : function(resultat, statut, erreur){
      console.log(resultat);
      console.log(statut);
      console.log(erreur);
    }
  })

})();
