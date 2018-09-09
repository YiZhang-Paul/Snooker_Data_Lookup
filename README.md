# Snooker Data Lookup

## Description

A simple data query for [_**snooker**_][snooker wikipedia] players information, rankings and more!

Live version available at: [jacksonlearnstocode.com][live site]

The application is developed using Angular 6 with the help of third-party APIs (such as [api.snooker.org](http://api.snooker.org/)). For more details on functionalities of the application, please refer to the functional requirement file available in this repository.

The source code is unit-tested using Jasmine.

## Future plans and improvements

Player images, broken url links will be fixed.

Some additional functionalities will be added:

* snooker event & match information lookup;
* more player statistics (win ratio, highest breaks, long-pot success rate, etc.);
* a heads-on section that allows users to randomly pick two players and show match-ups in the past (if applicable) and estimate match results base on career performances.

A dedicated back-end will be added:

* store & pre-process information for faster lookup, less data transfer;
* boost up site performance by providing pre-calculated, stored results rather than re-calculate on the client side on every visit to the site;
* save data usage for mobile devices.

A public API (RESTful) maybe created for easier data query and consumption.

## License & Disclaimers

Copyright (c) 2018 Yi Zhang

Released under MIT license.

[snooker wikipedia]: https://en.wikipedia.org/wiki/Snooker "Snooker Wikipedia Page"
[live site]: http://www.jacksonlearnstocode.com "Live Version"
