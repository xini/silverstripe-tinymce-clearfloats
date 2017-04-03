( function() {

	var availableLangs = ['en'];
	if(jQuery.inArray(tinymce.settings.language, availableLangs) != -1) {
		tinymce.PluginManager.requireLangPack("clearfloats");
	}
	
	tinymce.create( 'tinymce.plugins.tinymce_clear_float', {
		/**
		 * @param {tinymce.Editor} editor Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function( editor, url ) {
			var clear_html = '<br style="clear: both;" />',
				clear_title = editor.getLang('tinymce_clearfloats.clearfloats');
				clear_placeholder = '<img ' +
					'src="' + url + '/images/clearfloats-placeholder.png' + '" ' +
					'class="mce-tinymce-clear-float" ' +
					'alt="" ' +
					'title="' + clear_title + '" ' +
					'style="clear:both;" ' +
					'data-mce-resize="false" ' +
					'data-mce-placeholder="1" ' +
				'/>';

			editor.addButton( 'clearfloats', {
				title: clear_title,
				cmd: 'clear_both',
				image: url + '/images/clearfloats-icon.svg',
			} );

			editor.addCommand( 'clear_both', function(){
                editor.execCommand( 'mceInsertContent', false, clear_placeholder );
			} );
			
			// Disable button when text is selected
			editor.onNodeChange.add(function(editor, cm, n, co) {
				cm.setDisabled('clearfloats', !co);
			});

			editor.onBeforeSetContent.add(function(editor, event) {
				if ( event.content ) {
					var re = new RegExp( clear_html, 'g' );
					event.content = event.content.replace( /<br style=[^>]+>/g, clear_placeholder );
				}
			} );

			editor.onPostProcess.add(function(editor, event) {
				if ( event.get ) {
					event.content = event.content.replace( /<img[^>]+>/g, function( image ) {
						var string;
						if ( image.indexOf( 'mce-tinymce-clear-float' ) !== -1 ) {
							string = clear_html;
						}
						return string || image;
					} );
				}
			} );
		},

	} );

	// Register plugin
	tinymce.PluginManager.add( 'clearfloats', tinymce.plugins.tinymce_clear_float );
} )();
