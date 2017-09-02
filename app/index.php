<?php

require_once(__DIR__."/../vendor/autoload.php");

$loader = new \Twig_Loader_Filesystem(__DIR__.'/views');
$twig = new \Twig_Environment($loader);

//$sfLoader = require (__DIR__."/../vendor/autoload.php");
//$sfLoader->register();
//
//$loader = require '../vendor/autoload.php';
//$loader->register();
//
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
$response = new Response();

require 'lib/Framework/Core.php';

$request = Request::createFromGlobals();

// Our framework is now handling itself the request
$app = new Framework\Core();

// tuto for i18n: http://yutaf.github.io/php-i18n-with-twig-and-symfony-translation-component-outside-of-symfony-framework/

$locale = 'fr';
if(isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) && strlen($_SERVER['HTTP_ACCEPT_LANGUAGE'])>0) {
    $locale = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
//    $locale = 'en'; // play with this variable to change the locale
}
$translator = new Symfony\Component\Translation\Translator($locale, new \Symfony\Component\Translation\MessageSelector());
$translator->setFallbackLocales(['en']);
$translator->addLoader('yaml', new Symfony\Component\Translation\Loader\YamlFileLoader());
$translator->addResource('yaml', __DIR__ . '/translations/messages.en.yml', 'en');
$translator->addResource('yaml', __DIR__ . '/translations/messages.fr.yml', 'fr');

$twig->addExtension(new \Symfony\Bridge\Twig\Extension\TranslationExtension($translator));

echo $twig->render('homepage.html.twig', [
    'locale' => $locale,
    'name' => 'florent',
    'name2' => 'tony'
]);

$app->map('/hello-{toto}', function ($toto) {
    return new Response('Hello '.$toto);
});

$app->map('/', function () {
    return new Response('This is the home page');
});

$app->map('/about', function () {
    return new Response('This is the about page');
});

$response = $app->handle($request);
$response->send();
