<?php

use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;
use SilverStripe\Core\Manifest\ModuleLoader;

$path = ModuleLoader::getModule('innoweb/silverstripe-tinymce-clearfloats')
    ->getResource('client/tinymce/tinymce-clear-float/js/plugin.min.js');

TinyMCEConfig::get('cms')->enablePlugins([
    'tinymce_clear_float_plugin' => $path
]);

TinyMCEConfig::get('cms')->insertButtonsAfter('unlink', 'tinymce-clear-float');