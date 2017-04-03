<?php
HtmlEditorConfig::get('cms')->enablePlugins(array('clearfloats' => '../../../tinymce-clearfloats/javascript/editor_plugin.js'));
HtmlEditorConfig::get('cms')->insertButtonsAfter('anchor', 'clearfloats');
