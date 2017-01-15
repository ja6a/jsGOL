<?php

include("Mobile_Detect.php");
$detect = new Mobile_Detect();

// Set the cache control header (1 month is good for images)
// (Please note that the Expires HTTP header should also be set in real life)
header("Cache-Control: max-age=60");

// Set the Vary HTTP header. Detection is made on the User-Agent HTTP header
header("Vary: User-Agent");

if (isset($_GET['m'])) {							// We have a value directly from the user that we need to store
	setcookie('m', $_GET['m'], time()+60*60*24*30);	// Although we may already have a cookie, the value may
	$_COOKIE['m'] = $_GET['m'];
	$mobile_browser = $_COOKIE['m'];
}
else if (isset($_COOKIE['m'])) {
	$mobile_browser = $_COOKIE['m'];
}
else {
	$mobile_browser = 0;
}


//echo "mob ".$mobile_browser;

$domain= "http://s388430620.websitehome.co.uk/";
$path= "gol/";
$base = $domain . $path;
//echo "base ".$base;
if($mobile_browser==1){
	// serve up the mobile brew	
	$redirect = $base.'mobile.html';
	header("Location: $redirect");
	//echo "mobile ". $mobile_browser;
}
else if($mobile_browser==0){
	// serve up the desktop brew
	$redirect = $base.'desktop.html';
	header("Location: $redirect");
	//echo "desktop " . $mobile_browser;
}

?>