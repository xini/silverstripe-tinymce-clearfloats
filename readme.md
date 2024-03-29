# Silverstripe TinyMCE clear-floats plugin

[![Version](http://img.shields.io/packagist/v/innoweb/silverstripe-tinymce-clearfloats.svg?style=flat-square)](https://packagist.org/packages/innoweb/silverstripe-tinymce-clearfloats)
[![License](http://img.shields.io/packagist/l/innoweb/silverstripe-tinymce-clearfloats.svg?style=flat-square)](license.md)

This is a Silverstripe port of the [Wordpress plugin](https://github.com/tyrann0us/tinymce-clear-buttons) by [David Bammes](https://github.com/tyrann0us).

## Overview

Adds a clear-floats plugin to the TinyMCE editor in the CMS. 

It uses an image in the editor to visualise the clearing element and replaces it with a `<br style="clear:both;" />` 
for display on the site. 

![CMS view](./docs/en/_images/screenshot-cms.png)
*CMS view*

![Frontend view](./docs/en/_images/screenshot-frontend.png)
*Frontend view*

## Requirements

* Silverstripe CMS 5.x

Note: this version is compatible with Silverstripe 5. 

* For Silverstripe 4, please see the [2.x release line](https://github.com/xini/silverstripe-tinymce-clearfloats/tree/2).
* For Silverstripe 3, please see the [1.x release line](https://github.com/xini/silverstripe-tinymce-clearfloats/tree/1.1).

## Installation

Install the module using composer:
```
composer require innoweb/silverstripe-tinymce-clearfloats dev-master
```
or download or git clone the module into a ‘tinymce-clearfloats’ directory in your webroot.

Then run dev/build.

## Configuration

To clean up whitespace added when the clearing `<br>` is the only element in a `<p>`, please add the following CSS in your editor.css file:

```
p > br[style="clear: both;"]:only-child:first-child {
	content: ' ';
	display: block;
	margin: 0 0 -1.2em 0;
	overflow: hidden;
}
```

You should adjust the negative margin in the code above to negate the margin set on your `<p>` elements. 

## License

BSD 3-Clause License, see [License](license.md)
