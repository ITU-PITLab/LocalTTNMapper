<?php
// This is the receiving end of the TTN integration
// receiving the objects, doing a bit of clean up and writing into ../js/nodes.js
// It is an alternative to having /home/coverage.py running

$myFile = fopen("../js/nodes.js", "a") ;
$data1 = file_get_contents('php://input');
$data1 = serialize($data1);
/////////// cleaning up
$pattern = '/^s:[0-9]*:\"/';
$replacement = 'points.push(';
$data1 = preg_replace($pattern, $replacement, $data1);
$pattern = '/\}\";$/';
$replacement = '});';
$data1 = preg_replace($pattern, $replacement, $data1);
//// done cleaning up
fwrite($myFile, $data1."\n");
fclose($myFile);
?>
