# Olé

Integration of OpenLayers 3 and Esri ArcGIS REST services.

Provides the following functionality:
  * translation of ArcGIS REST API styling to OpenLayers 3 styles
  * automatic configuration of tile and image layers from the ArcGIS REST API

## Getting started
    npm install
    npm run build

## Unit tests
    npm start
    npm test
    http://127.0.0.1:1337/test/index.html

## Linting
    npm run lint

## Examples
    npm start
    http://127.0.0.1:1337/examples/

## Using npm

There is no package on npmjs.com but you can use a git type url for instance:
    "dependencies": {
      "ole": "boundlessgeo/ole#v0.6.1"
    }

## What is supported?

### <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Symbol_Objects/02r3000000n5000000/">Symbol objects</a>
  * Simple Marker Symbol: except for xoffset and yoffset
  * Simple Line Symbol
  * Simple Fill Symbol: except for style
  * Picture Marker Symbol: except for xoffset and yoffset
  * Text Symbol: except for backgroundColor, borderLineSize, borderLineColor, haloSize, haloColor, rightToLeft, kerning

### <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Renderer_objects/02r30000019t000000/">Renderer objects</a>
  * Simple renderer: except for rotationType, rotationExpression
  * Unique value renderer: except for field2, field3, fieldDelimiter, defaultLabel, rotationType, rotationExpression
  * Class breaks renderer: except for backgroundFillSymbol, rotationType, rotationExpression

## License

Copyright 2015 Boundless Spatial, Inc.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
