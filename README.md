# SomaFM Firefox OS app

Author: Daniel "MaTachi" Jonsson  
License: [MIT License](LICENSE.md)

## Prerequisites

Install npm, Grunt and Bower on a Debian based system (Ubuntu for example):

    $ sudo apt-get install nodejs
    $ sudo npm install -g bower grunt-cli
    $ sudo chown `whoami`:`whoami` ~/.npm ~/tmp

To export the SVG icon into PNG images Inkscape is also required to be
installed:

    $ sudo apt-get install inkscape

## Set up

Install development dependencies (Grunt and Grunt modules):

    $ npm install

Install deployment dependencies that the app requires (jQuery, Backbone,
Underscore and Building Blocks):

    $ bower install

## Build the project

Build the whole project and produce a runnable app:

    $ grunt

## Run the app

The built app is available in the directory `dist/`. Either open
`dist/index.html` in Firefox or install the app on Firefox OS using Firefox's
[App Manager](https://developer.mozilla.org/en-US/Firefox_OS/Using_the_App_Manager).
With the App Manager it's possible to debug the app on both a real device and
in the
[Firefox OS Simulator](https://ftp.mozilla.org/pub/mozilla.org/labs/fxos-simulator/).

## Other available Grunt tasks

Watch for changes in the text files (JavaScript, HTML, etc) and perform
continuous compilation:

    $ grunt watch

Export the [SVG icon](icons/icon.svg) into PNG icons of various sizes:

    $ grunt icons

Delete compiled files:

    $ grunt clean:dist

Only compile the JavaScript files:

    $ grunt compile

