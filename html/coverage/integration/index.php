<?php
$myFile = fopen("../js/nodes.js", "a") ;
$data1 = file_get_contents('php://input');
$data1 = serialize($data1);
$pattern = '/^s:[0-9]*:\"/';
$replacement = 'points.push(';
$data1 = preg_replace($pattern, $replacement, $data1);
$pattern = '/\}\";$/';
$replacement = '});';
$data1 = preg_replace($pattern, $replacement, $data1);
echo $data1;
fwrite($myFile, $data1."\n");
fclose($myFile);
?>
