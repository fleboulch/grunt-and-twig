<?php

require_once(__DIR__."/../vendor/autoload.php");

$loader = new \Twig_Loader_Filesystem(__DIR__.'/views');
$twig = new \Twig_Environment($loader);


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

echo $twig->render('base.html.twig', [
    'name' => 'florent',
    'name2' => 'tony'
]);
