<?php
  die('ok');
  $api = "http://steamcommunity.com/id/Naunau63/inventory/json/730/2";
  $file= file_get_contents($api_user_url);
  $schema = json_decode($file);
  return $schema;
  $fp = fopen ("get_inventory.json", "r+");
  fputs ($fp, $nb_visites);
  fclose ($fp);
