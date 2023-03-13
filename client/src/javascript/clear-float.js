( function() {

    const plugin = {
        init(editor) {
            const clear_html = '<br style="clear: both;">',
                clear_html_no_semicolon = clear_html.replace( ';', '' ),
                clear_title = 'Clear float',
                clear_placeholder = '<img ' +
                    'src="' + tinymce.Env.transparentSrc + '" ' +
                    'class="mce-tinymce-clear-float" ' +
                    'alt="" ' +
                    'title="' + clear_title + '" ' +
                    'data-mce-resize="false" ' +
                    'data-mce-placeholder="1" ' +
                    '/>';

            editor.ui.registry.addButton( 'clear-float', {
                icon: 'page-break',
                tooltip: 'Clear float',
                onAction: insertClearFloat
            } );

            function insertClearFloat() {
                editor.execCommand( 'mceInsertContent', false, clear_placeholder );
            }

            editor.on( 'BeforeSetContent', function( event ) {
                if ( event.content ) {
                    var re_clear_html = new RegExp( clear_html, 'g' );
                    var re_clear_html_no_semicolon = new RegExp( clear_html_no_semicolon, 'g' );
                    event.content = event.content.replace( re_clear_html, clear_placeholder );

                    /**
                     * Under certain circumstances, TinyMCE will strip the semicolon from `<br style="clear: both;">.
                     * Also replace this.
                     */
                    event.content = event.content.replace( re_clear_html_no_semicolon, clear_placeholder );
                    /**
                     * Replace `<div style="clear: (left|right|both);"></div>` with placeholder too.
                     * This HTML markup has been used until version 1.1.
                     */
                    event.content = event.content.replace( /<div style="clear:(.+?)"><\/div>/g, clear_placeholder );
                }
            } );

            editor.on( 'PostProcess', function( event ) {
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

            return {
                getMetadata() {
                    return {
                        name: 'Clear Floats',
                        url: 'https://github.com/xini/silverstripe-tinymce-clearfloats',
                    };
                }
            };
        }
    };

    // Adds the plugin class to the list of available TinyMCE plugins
    tinymce.PluginManager.add('clear-float', (editor) => plugin.init(editor));
} )();
