(function(){
    "use strict";

    var bIsLogged = false;
    var elements;

    var CheminComplet = document.location.href;
    var NomDuFichier     = CheminComplet.substring(CheminComplet.lastIndexOf( "/" )+1 );

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    function createUrlForLogInButtons(){

        function genUrl( bReturnTo) { //Function that generate the url to log to steam through an account

            var steamProviderUrl = 'https://steamcommunity.com/openid/login?';

            bReturnTo = (!bReturnTo) ? 'http://localhost:12345/login' : bReturnTo ;

            var params = {
                'openid.ns'		 : 'http://specs.openid.net/auth/2.0',
                'openid.mode'		 : 'checkid_setup',
                'openid.return_to' :  bReturnTo,
                'openid.realm'	 :  bReturnTo,
                'openid.ns.sreg'   : 'http://openid.net/extensions/sreg/1.1',
                'openid.identity'	 : 'http://specs.openid.net/auth/2.0/identifier_select',
                'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
            };

            var encodedParams = $.param(params);

            var url = steamProviderUrl + encodedParams;

            return url;
        }

        var idSteam = false;

        var cookies = (document.cookie).split(';');

        for(var i = -1 ; ++i < cookies.length ; ){ //Loop to check all cookies
            if( (cookies[i].search('userID=')) != -1) {
                idSteam = i;
            }
        }
        //For the top menu steam button
        console.log(idSteam !== false);
        var steamButton = document.getElementById('logButton');
        if(idSteam === false){ //If idSteam still on 'false' then it means you are offline
            steamButton.href = genUrl() ;
            steamButton.children[0].alt = 'Naviguer vers la page de connexion de Steam';
            steamButton.children[0].src = './img/in.png';
        }else{
            console.log('logout');
            steamButton.href = '/logout' ;
            steamButton.children[0].src = './img/out.png';
            steamButton.children[0].alt = 'Déconnexion';
            var temp = cookies[idSteam].split('=');
            var userID = temp[temp.length-1];
        }

        //For the proceed log in button (views/pages/proceed/step_one.jade)
        $('.LogInProceedButton').attr('href', genUrl('http://localhost:12345/proceed_login'));
    }

    function connectUser(body){

        //User profil infos

        var img_profil = document.getElementById('toFill__img_profil');
        var nom_steam = document.getElementById('toFill__nom_steam');
        var nombre_coins = document.getElementById('toFill__nombre_coins');
        var nombre_coins_won = document.getElementById('toFill__nombre_coins_won');
        var nombre_depot_skin = document.getElementById('toFill__nombre_depot_skin');
        var valeur_depot = document.getElementById('toFill__valeur_depot');
        var nombre_retrait = document.getElementById('toFill__nombre_retrait');
        var valeur_retrait = document.getElementById('toFill__valeur_retrait');

        var numberOfDeposedSkins = 0, valueAllDepot = 0;

        for( var i = -1 ; ++i<Object.size(body[0].droppedSkin) ; ){
            numberOfDeposedSkins += body[0].droppedSkin[i].skins.length;
            valueAllDepot +=  parseFloat(body[0].droppedSkin[i].totalPrice);
        }

        img_profil.src = body[1].avatarfull;
        nom_steam.innerHTML = body[1].personaname;
        nombre_coins.innerHTML = body[0].coins;
        nombre_coins_won.innerHTML = body[0].coinsEarned;
        nombre_depot_skin.innerHTML = numberOfDeposedSkins;
        valeur_depot.innerHTML = valueAllDepot + '$';
        nombre_retrait.innerHTML = Object.size(body[0].skinsBought);
        valeur_retrait.innerHTML = '/';

        //User actions history infos
        var aTabs = [
            document.getElementById('tab-dropped'),
            document.getElementById('tab-removed'),
            document.getElementById('tab-coins')
        ],
            aTabsButtonsList = document.getElementsByClassName('nav-tabs')[0];

        // 1) Dropped
        if(body[0].droppedSkin.length > 0) aTabs[0].removeChild(aTabs[0].children[0]);

        for( i = body[0].droppedSkin.length ; --i > -1 ; ){

            //Create necessary basic elements

            var div_tabInfos = document.createElement('div');
            var div_textInfos = document.createElement('div');
            var div_skins = document.createElement('div');

            var span_buttonMore = document.createElement('span');
            var span_tabDate = document.createElement('span');
            var span_tabValue = document.createElement('span');

            //Inner HTML

            span_buttonMore.innerHTML = '+';
            span_tabDate.innerHTML = body[0].droppedSkin[i].date;
            span_tabValue.innerHTML = body[0].droppedSkin[i].totalPrice + '$';

            //Class names

            div_tabInfos.className = 'tab-infos';
            div_textInfos.className = 'tab-textInfos';
            div_skins.className = 'tab-skins-hidden';

            span_buttonMore.className = 'button_more';
            span_tabDate.className = 'tab-date';
            span_tabValue.className = 'tab-value';

            //Appending elements + create img tags

            div_textInfos.appendChild(span_buttonMore);
            div_textInfos.appendChild(span_tabDate);
            div_textInfos.appendChild(span_tabValue);

            div_tabInfos.appendChild(div_textInfos);

            for( var y = -1 ; ++y < body[0].droppedSkin[i].skins.length ; ){
                var imgTag = document.createElement('img');
                imgTag.src = 'http://cdn.steamcommunity.com/economy/image/' + body[0].droppedSkin[i].skins[y].imgUrl;

                div_skins.appendChild(imgTag);
            }

            div_tabInfos.appendChild(div_skins);

            aTabs[0].appendChild(div_tabInfos);

        }

        //Add event listener to display the skin list
        var aButtonMore = document.getElementsByClassName('button_more');

        for( i = -1 ; ++i<aButtonMore.length ; ){
            aButtonMore[i].addEventListener('click', function(){displaySkins(this)}, false);
        }

        // 2) Removed
        if(body[0].skinsBought.length > 0) aTabs[1].removeChild(aTabs[1].children[0]);

        // 3) Coins
        if(body[0].coinsHistory.length > 0) aTabs[2].removeChild(aTabs[2].children[0]);

        for( i = body[0].coinsHistory.length ; --i > -1 ; ){

            //Create necessary basic elements

            div_tabInfos = document.createElement('div');
            div_textInfos = document.createElement('div');

            span_tabDate = document.createElement('span');
            span_tabValue = document.createElement('span');

            //Inner HTML

            span_tabDate.innerHTML = body[0].coinsHistory[i].date;
            var spanValue = parseInt(body[0].coinsHistory[i].gain) + 10;
            span_tabValue.innerHTML = spanValue + '$';

            //Class names

            div_tabInfos.className = 'tab-infos';
            div_textInfos.className = 'tab-textInfos';

            span_tabDate.className = 'tab-date';
            spanValue > 0 ? span_tabValue.className = 'tab-value goodScore' : span_tabValue.className = 'tab-value badScore';

            //Appending elements + create img tags

            div_textInfos.appendChild(span_tabDate);
            div_textInfos.appendChild(span_tabValue);

            div_tabInfos.appendChild(div_textInfos);

            aTabs[2].appendChild(div_tabInfos);

        }

        //Event listener to display the clicked tab
        for( i = -1 ; ++i<aTabsButtonsList.children.length ; ){
            aTabsButtonsList.children[i].index = i;
            aTabsButtonsList.children[i].addEventListener('click', function(){displayTab(this, aTabs)}, false);
        }
    }

    function displaySkins(item){
        if(item.parentNode.parentNode.children[1].className == 'tab-skins-hidden'){
            item.innerHTML = '-';
            item.parentNode.parentNode.children[1].className = 'tab-skins';
        }
        else{
            item.innerHTML = '+';
            item.parentNode.parentNode.children[1].className = 'tab-skins-hidden';
        }
    }
    function displayTab(item, aTabs){
        document.getElementsByClassName('active')[0].className = '';
        document.getElementsByClassName('tab-active')[0].className = '';

        item.className = 'active';
        aTabs[item.index].className = 'tab-active';
    }

    function hideElements(){
        elements = document.getElementsByClassName('connect');
        for( var i = -1 ; ++i<elements.length ; ){
            elements[i].style.position = 'fixed' ;
            elements[i].style.top = '-5000px' ;
        }
    }
    function showElements(){
        bIsLogged = true;
        //Tabs Menus
        for( var i = -1 ; ++i<elements.length ; ){
            elements[i].style.position = 'static' ;
        }
    }

    function checkForConnection(){
        $.ajax({
            url : './user',
            type: 'get',
            dataType: 'json',
            success : function(body){
                if (body[0] != 'not logged') showElements();
                if (NomDuFichier == 'profil') connectUser(body);
            },
            error : function(resultat, statut, erreur){
                console.log(resultat);
                console.log(statut);
                console.log(erreur);
            }
        })
    }

    window.addEventListener('load', function(){
        hideElements();
        createUrlForLogInButtons();
        checkForConnection();
    }, false);
})();
