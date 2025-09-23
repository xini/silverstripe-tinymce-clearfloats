<?php

use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\TinyMCE\TinyMCEConfig;

$path = ModuleLoader::getModule('innoweb/silverstripe-tinymce-clearfloats')
    ->getResource('client/dist/javascript/clear-float.js');

TinyMCEConfig::get('cms')->enablePlugins([
    'clear-float' => $path
]);

TinyMCEConfig::get('cms')->insertButtonsAfter('unlink', 'clear-float');
