( function() {

    tinymce.create( 'tinymce.plugins.tinymce_clear_float', {
        /**
         * @param {tinymce.Editor} editor Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */
        init : function( editor, url ) {
            var clear_html = '<br style="clear: both;">',
                clear_html_no_semicolon = clear_html.replace( ';', '' ),
                clear_title = editor.getLang( 'tinymce_clear_float.img_title', 'Clear float' ),
                clear_placeholder = '<img ' +
                    'src="' + tinymce.Env.transparentSrc + '" ' +
                    'class="mce-tinymce-clear-float" ' +
                    'alt="" ' +
                    'title="' + clear_title + '" ' +
                    'data-mce-resize="false" ' +
                    'data-mce-placeholder="1" ' +
                    '/>';

            editor.addButton( 'tinymce-clear-float', {
                title: editor.getLang( 'tinymce_clear_float.tooltip', 'Clear float' ),
                cmd: 'clear_both',
                image: url + '/../images/tinymce-clear-float-icon.svg'
            } );

            editor.addCommand( 'clear_both', function(){
                editor.execCommand( 'mceInsertContent', false, clear_placeholder );
            } );

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
        },

    } );

    // Register plugin
    tinymce.PluginManager.add( 'tinymce_clear_float_plugin', tinymce.plugins.tinymce_clear_float );
} )();
