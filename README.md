# SomaFM Firefox OS app

Author: Daniel "MaTachi" Jonsson  
License: [MIT License](LICENSE.md)

## Prerequisites

Install npm, Grunt and Bower on a Debian based system (Ubuntu for example):

    $ sudo apt-get install nodejs
    $ sudo npm install -g bower grunt-cli
    $ sudo chown -R `whoami`:`whoami` ~/.npm ~/tmp

To export the SVG icon into PNG images Inkscape is also required to be
installed:

    $ sudo apt-get install inkscape

## Set up

Install development dependencies (Grunt and Grunt modules) and app dependencies
(jQuery, Backbone, Underscore and Building Blocks):

    $ npm install

## Build development version of the app

Watch for changes in the text files (JavaScript, HTML, etc) and perform
continuous building:

    $ grunt

## Build production version of the app

    $ grunt build

This does the same as `grunt`, but with more minimization, cleaning and without
the conitinious building.

## Run the app

The built app is available in the directory `dist/`. Use Firefox's [App
Manager](https://developer.mozilla.org/en-US/Firefox_OS/Using_the_App_Manager)
to install the app on either a real device or in the [Firefox OS
Simulator](https://ftp.mozilla.org/pub/mozilla.org/labs/fxos-simulator/).
With the App Manager it's also possible to debug the app's JS, DOM and CSS.

The app isn't runnable in the regular browser due to the [same-origin
policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
which restricts the app's JS code from making a GET request to [SomaFM's
API](http://somafm.com/channels.xml). This could be fixed if SomaFM were to
enable
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

## Credits

The app depends on the following JavaScript libraries:

* [jQuery](http://jquery.com/) licensed under the [MIT
  License](https://jquery.org/license/).
* [jQuery-xml2json](https://github.com/sergeyt/jQuery-xml2json) licensed under
  the [MIT
  License](https://github.com/sergeyt/jQuery-xml2json/blob/master/package.json).
* [Underscore.js](http://underscorejs.org/) licensed under the [MIT
  License](https://github.com/jashkenas/underscore/blob/master/LICENSE).
* [Backbone.js](http://backbonejs.org/) licensed under the [MIT
  License](https://github.com/jashkenas/backbone/blob/master/LICENSE).
* [Backbone.localStorage](http://documentup.com/jeromegn/backbone.localStorage)
  licensed under the [MIT
  License](http://documentup.com/jeromegn/backbone.localStorage#license).

The following font is used for the app's icon:

* [OCR-A](http://sourceforge.net/projects/ocr-a-font/) licensed as public
  domain.
