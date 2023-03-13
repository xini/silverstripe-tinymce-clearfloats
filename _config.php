<?php

use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;
use SilverStripe\Core\Manifest\ModuleLoader;

$path = ModuleLoader::getModule('innoweb/silverstripe-tinymce-clearfloats')
    ->getResource('client/dist/javascript/clear-float.js');

TinyMCEConfig::get('cms')->enablePlugins([
    'clear-float' => $path
]);

TinyMCEConfig::get('cms')->insertButtonsAfter('unlink', 'clear-float');