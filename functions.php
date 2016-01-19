
//class SteamSignIn
//{
//	const STEAM_LOGIN = 'https://steamcommunity.com/openid/login';
//
//	/**
//	* Get the URL to sign into steam
//	*
//	* @param mixed returnTo URI to tell steam where to return, MUST BE THE FULL URI WITH THE PROTOCOL
//	* @param bool useAmp Use &amp; in the URL, true; or just &, false.
//	* @return string The string to go in the URL
//	*/
//	public static function genUrl($returnTo = false, $useAmp = true)
//	{
//		$returnTo = (!$returnTo) ? (!empty($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'] : $returnTo;
//
//		$params = array(
//			'openid.ns'			=> 'http://specs.openid.net/auth/2.0',
//			'openid.mode'		=> 'checkid_setup',
//			'openid.return_to'	=> $returnTo,
//			'openid.realm'		=> (!empty($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'],
//			'openid.identity'	=> 'http://specs.openid.net/auth/2.0/identifier_select',
//			'openid.claimed_id'	=> 'http://specs.openid.net/auth/2.0/identifier_select',
//		);
//
//		$sep = ($useAmp) ? '&amp;' : '&';
//		return self::STEAM_LOGIN . '?' . http_build_query($params, '', $sep);
//	}

///////////////////////////////////////////////////////////
  var steamProvider = 'https://steamcommunity.com/openid/login';

  function genUrl(bReturnTo = false, bUseAmp = true) {

		bReturnTo = (!bReturnTo) ? 'http://localhost:12345/index' : bReturnTo ;

		var params = [
			'openid.ns'			: 'http://specs.openid.net/auth/2.0',
			'openid.mode'		: 'checkid_setup',
			'openid.return_to'	: bReturnTo,
			'openid.realm'		: 'http://localhost:12345/index',
			'openid.identity'	: 'http://specs.openid.net/auth/2.0/identifier_select',
			'openid.claimed_id'	: 'http://specs.openid.net/auth/2.0/identifier_select'
		];

		var sep = (bUseAmp) ? '&amp;' : '&';
    var url = 
		
  }
//
//	/**
//	* Validate the incoming data
//	*
//	* @return string Returns the SteamID64 if successful or empty string on failure
//	*/
//	public static function validate()
//	{
//		// Star off with some basic params
//		$params = array(
//			'openid.assoc_handle'	=> $_GET['openid_assoc_handle'],
//			'openid.signed'			=> $_GET['openid_signed'],
//			'openid.sig'			=> $_GET['openid_sig'],
//			'openid.ns'				=> 'http://specs.openid.net/auth/2.0',
//		);
//
//		// Get all the params that were sent back and resend them for validation
//		$signed = explode(',', $_GET['openid_signed']);
//		foreach($signed as $item)
//		{
//			$val = $_GET['openid_' . str_replace('.', '_', $item)];
//			$params['openid.' . $item] = get_magic_quotes_gpc() ? stripslashes($val) : $val;
//		}
//
//		// Finally, add the all important mode.
//		$params['openid.mode'] = 'check_authentication';
//
//		// Stored to send a Content-Length header
//		$data =  http_build_query($params);
//		$context = stream_context_create(array(
//			'http' => array(
//				'method'  => 'POST',
//				'header'  =>
//					"Accept-language: en\r\n".
//					"Content-type: application/x-www-form-urlencoded\r\n" .
//					"Content-Length: " . strlen($data) . "\r\n",
//				'content' => $data,
//			),
//		));
//
//		$result = file_get_contents(self::STEAM_LOGIN, false, $context);
//
//		// Validate wheather it's true and if we have a good ID
//		preg_match("#^http://steamcommunity.com/openid/id/([0-9]{17,25})#", $_GET['openid_claimed_id'], $matches);
//		$steamID64 = is_numeric($matches[1]) ? $matches[1] : 0;
//
//		// Return our final value
//		return preg_match("#is_valid\s*:\s*true#i", $result) == 1 ? $steamID64 : '';
//	}
//}
//
//


// //Getting my inventory through steam API
//   $api = "http://steamcommunity.com/id/Naunau63/inventory/json/730/2";
//   $api_user_url = "http://steamcommunity.com/profiles/".$steamprofile['steamid']."/inventory/json/730/2";
//   die(print($steamprofile['steamid']));
//   $file= file_get_contents($api_user_url);
//   $schema = json_decode($file);
//
// //Instancing my global array that will contain all the skins I want to display
//   $iNumberOfItems = [];
//
// //Instancing object for my items
//   class stdObject {
//     public function __construct(array $arguments = array()) {
//       if (!empty($arguments)) {
//           foreach ($arguments as $property => $argument) {
//               $this->{$property} = $argument;
//           }
//       }
//     }
//     public function __call($method, $arguments) {
//       $arguments = array_merge(array("stdObject" => $this), $arguments); // Note: method argument 0 will always referred to the main class ($this).
//       if (isset($this->{$method}) && is_callable($this->{$method})) {
//           return call_user_func_array($this->{$method}, $arguments);
//       } else {
//           throw new Exception("Fatal error: Call to undefined method stdObject::{$method}()");
//       }
//     }
//   }
//
// //The loop to fill the array
//   $i = 0;
//
//   foreach ($schema->rgInventory as $stuff) {
//     $bIsInArray = false;
//     $item = new stdObject();
//     $item->id = $stuff->classid;
//
//     if($i == 0){ // First Item
//       $item->amount = 1;
//       array_push($iNumberOfItems, $item);
//     }
//
//     else{
//       foreach ($iNumberOfItems as $id) {
//         if($id->id == $item->id){
//           $bIsInArray = true;
//           $id->amount++;
//         }
//       }
//       if (!$bIsInArray) {
//         $item->amount = 1;
//         array_push($iNumberOfItems, $item);
//       }
//     }
//
//     $i++; //Providing First Item Statement
//
//   }
//
// //The loop to sort the item (tradable or not etc)
//   $i = 0;
//
//   foreach($iNumberOfItems as $XiNumberOfItems){ //$XiNumberOfItems = an item from my global array
//
//     $classID = $XiNumberOfItems->id;
//
//     foreach($schema->rgDescriptions as $item){ //$item = an item from my inv from the Steam Api
//
//       if($item->classid == $classID){
//
//         $type = $item->type; //Get the type of The Item
//
//         $type_music_kit_search = strstr($type, 'Music Kit', true); //Looking if Music Kit
//
//         //I wont get any item that : is not marketable/tradable and is a Container or a Music Kit
//         if( ( $item->marketable === 1  && $item->tradable === 1 ) && ( $type != 'Base Grade Container' && ( !$type_music_kit_search ) ) ){
//
//           $XiNumberOfItems->url = "http://cdn.steamcommunity.com/economy/image/".$item->icon_url; //Getting the skin's image
//
//           $fullName = $item->market_name; //Getting the skin's name
//
//           $exploded_fullName = explode( '(', $fullName );
//
//           $XiNumberOfItems->name = $exploded_fullName[0];
//
//           $quality = explode( ')', $exploded_fullName[1] );
//
//           $XiNumberOfItems->quality = $quality[0];
//
//           //Getting skin price for steam Market
//             // $price_json_url = "http://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=".urlencode($item->market_hash_name);
//             // $price_json = file_get_contents($price_json_url);
//             // $price = json_decode($price_json);
//             // $prise = utf8_decode($price->lowest_price);
//             // $price_euro = explode('?', $prise);
//             // $XiNumberOfItems->price = $price_euro;
//
//             // TODO: Getting price for unreferenced (too expensive) skins
//
//           //Saying that the skin is tradable
//           $XiNumberOfItems->showable = true;
//
//         }
//
//         else{
//
//           //Saying that the skin is untradable
//           $XiNumberOfItems->showable = false;
//
//         }
//       }
//     }
//
//     if(!$XiNumberOfItems->showable){
//
//       //Delete skins/items that are untrable from my array
//       unset($iNumberOfItems[$i]);
//
//     }
//
//     $i++;
//
//   }
