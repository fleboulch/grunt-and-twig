<?php

require_once(__DIR__."/../vendor/autoload.php");

$loader = new \Twig_Loader_Filesystem(__DIR__.'/views');
$twig = new \Twig_Environment($loader);

echo $twig->render('base.html.twig', [
    'name' => 'florent',
    'name2' => 'tony'
]);