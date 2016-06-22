/*
** Olé - Integration of OpenLayers 3 and Esri ArcGIS REST services
** Copyright 2015-present Boundless Spatial, Inc.
** License: https://raw.githubusercontent.com/boundlessgeo/ole/master/LICENSE
** Version: v0.6.3
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ole = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global ol */

var LayerGenerator = function () {
  function LayerGenerator(props) {
    _classCallCheck(this, LayerGenerator);

    this._config = props.config;
    this._url = props.url;
    this._resolutions = this._getResolutions();
    this._projection = this._getProjection();
    this._attribution = this._getAttribution();
    this._fullExtent = this._getFullExtent();
  }

  _createClass(LayerGenerator, [{
    key: 'getFullExtent',
    value: function getFullExtent() {
      return this._fullExtent;
    }
  }, {
    key: '_getFullExtent',
    value: function _getFullExtent() {
      return [this._config.fullExtent.xmin, this._config.fullExtent.ymin, this._config.fullExtent.xmax, this._config.fullExtent.ymax];
    }
  }, {
    key: 'getResolutions',
    value: function getResolutions() {
      return this._resolutions;
    }
  }, {
    key: '_getResolutions',
    value: function _getResolutions() {
      var tileInfo = this._config.tileInfo;
      if (tileInfo) {
        var resolutions = [];
        for (var i = 0, ii = tileInfo.lods.length; i < ii; ++i) {
          resolutions.push(tileInfo.lods[i].resolution);
        }
        return resolutions;
      }
    }
  }, {
    key: '_getProjection',
    value: function _getProjection() {
      var epsg = 'EPSG:' + this._config.spatialReference.wkid;
      var units = this._config.units === 'esriMeters' ? 'm' : 'degrees';
      var projection = ol.proj.get(epsg) ? ol.proj.get(epsg) : new ol.proj.Projection({ code: epsg, units: units });
      return projection;
    }
  }, {
    key: 'getProjection',
    value: function getProjection() {
      return this._projection;
    }
  }, {
    key: '_getAttribution',
    value: function _getAttribution() {
      return new ol.Attribution({
        html: this._config.copyrightText
      });
    }
  }, {
    key: 'createArcGISRestSource',
    value: function createArcGISRestSource() {
      return new ol.source.TileArcGISRest({
        url: this._url,
        attributions: [this._attribution]
      });
    }
  }, {
    key: 'createXYZSource',
    value: function createXYZSource() {
      var tileInfo = this._config.tileInfo;
      var tileSize = [tileInfo.width || tileInfo.cols, tileInfo.height || tileInfo.rows];
      var tileOrigin = [tileInfo.origin.x, tileInfo.origin.y];
      var urls;
      var suffix = '/tile/{z}/{y}/{x}';
      if (this._config.tileServers) {
        urls = this._config.tileServers;
        for (var i = 0, ii = urls.length; i < ii; ++i) {
          urls[i] += suffix;
        }
      } else {
        urls = [this._url += suffix];
      }
      var width = tileSize[0] * this._resolutions[0];
      var height = tileSize[1] * this._resolutions[0];
      var tileUrlFunction, extent, tileGrid;
      if (this._projection.getCode() === 'EPSG:4326') {
        tileUrlFunction = function tileUrlFunction(tileCoord) {
          var url = urls.length === 1 ? urls[0] : urls[Math.floor(Math.random() * (urls.length - 0 + 1)) + 0];
          return url.replace('{z}', (tileCoord[0] - 1).toString()).replace('{x}', tileCoord[1].toString()).replace('{y}', (-tileCoord[2] - 1).toString());
        };
      } else {
        extent = [tileOrigin[0], tileOrigin[1] - height, tileOrigin[0] + width, tileOrigin[1]];
        tileGrid = new ol.tilegrid.TileGrid({
          origin: tileOrigin,
          extent: extent,
          resolutions: this._resolutions
        });
      }
      return new ol.source.XYZ({
        attributions: [this._attribution],
        projection: this._projection,
        tileSize: tileSize,
        tileGrid: tileGrid,
        tileUrlFunction: tileUrlFunction,
        urls: urls
      });
    }
  }, {
    key: 'createLayer',
    value: function createLayer() {
      var layer = new ol.layer.Tile();
      if (this._config.tileInfo) {
        layer.setSource(this.createXYZSource());
      } else {
        layer.setSource(this.createArcGISRestSource());
      }
      return layer;
    }
  }]);

  return LayerGenerator;
}();

exports.default = LayerGenerator;

},{}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global ol */


var _Util = _dereq_('./Util');

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleGenerator = function () {
  function StyleGenerator() {
    _classCallCheck(this, StyleGenerator);

    this._converters = {};
    // TODO add support for picture fill symbol when ol3 supports it
    // see: https://github.com/openlayers/ol3/issues/2208
    this._converters.esriPMS = StyleGenerator._convertEsriPMS;
    this._converters.esriSFS = StyleGenerator._convertEsriSFS;
    this._converters.esriSLS = StyleGenerator._convertEsriSLS;
    this._converters.esriSMS = StyleGenerator._convertEsriSMS;
    this._converters.esriTS = StyleGenerator._convertEsriTS;
    this._renderers = {};
    this._renderers.uniqueValue = this._renderUniqueValue;
    this._renderers.simple = this._renderSimple;
    this._renderers.classBreaks = this._renderClassBreaks;
  }

  _createClass(StyleGenerator, [{
    key: '_convertLabelingInfo',
    value: function _convertLabelingInfo(labelingInfo, mapUnits) {
      var styles = [];
      for (var i = 0, ii = labelingInfo.length; i < ii; ++i) {
        var labelExpression = labelingInfo[i].labelExpression;
        // only limited support for label expressions
        var field = labelExpression.substr(labelExpression.indexOf('[') + 1, labelExpression.indexOf(']') - 1);
        var symbol = labelingInfo[i].symbol;
        var maxScale = labelingInfo[i].maxScale;
        var minScale = labelingInfo[i].minScale;
        var minResolution = null;
        if (maxScale !== 0) {
          minResolution = _Util2.default.getResolutionForScale(maxScale, mapUnits);
        }
        var maxResolution = null;
        if (minScale !== 0) {
          maxResolution = _Util2.default.getResolutionForScale(minScale, mapUnits);
        }
        var style = this._converters[symbol.type].call(this, symbol);
        styles.push(function () {
          return function (feature, resolution) {
            var visible = true;
            if (this.minResolution !== null && this.maxResolution !== null) {
              visible = resolution < this.maxResolution && resolution >= this.minResolution;
            } else if (this.minResolution !== null) {
              visible = resolution >= this.minResolution;
            } else if (this.maxResolution !== null) {
              visible = resolution < this.maxResolution;
            }
            if (visible) {
              var value = feature.get(this.field);
              this.style.getText().setText(value);
              return [this.style];
            }
          };
        }().bind({
          minResolution: minResolution,
          maxResolution: maxResolution,
          field: field,
          style: style
        }));
      }
      return styles;
    }
    /* convert an Esri Text Symbol */

  }, {
    key: '_renderSimple',
    value: function _renderSimple(renderer) {
      var style = this._converters[renderer.symbol.type].call(this, renderer.symbol);
      return function () {
        return function () {
          return [style];
        };
      }();
    }
  }, {
    key: '_renderClassBreaks',
    value: function _renderClassBreaks(renderer) {
      var defaultSymbol = renderer.defaultSymbol;
      var defaultStyle = this._converters[defaultSymbol.type].call(this, defaultSymbol);
      var field = renderer.field;
      var classes = [];
      for (var i = 0, ii = renderer.classBreakInfos.length; i < ii; ++i) {
        var classBreakInfo = renderer.classBreakInfos[i];
        var min;
        if (classBreakInfo.classMinValue === null || classBreakInfo.classMinValue === undefined) {
          if (i === 0) {
            min = renderer.minValue;
          } else {
            min = renderer.classBreakInfos[i - 1].classMaxValue;
          }
        } else {
          min = classBreakInfo.classMinValue;
        }
        var max = classBreakInfo.classMaxValue;
        var symbol = classBreakInfo.symbol;
        var style = this._converters[symbol.type].call(this, symbol);
        classes.push({ min: min, max: max, style: style });
      }
      return function () {
        return function (feature) {
          var value = feature.get(field);
          for (i = 0, ii = classes.length; i < ii; ++i) {
            var condition;
            if (i === 0) {
              condition = value >= classes[i].min && value <= classes[i].max;
            } else {
              condition = value > classes[i].min && value <= classes[i].max;
            }
            if (condition) {
              return [classes[i].style];
            }
          }
          return [defaultStyle];
        };
      }();
    }
  }, {
    key: '_renderUniqueValue',
    value: function _renderUniqueValue(renderer) {
      var defaultSymbol = renderer.defaultSymbol;
      var defaultStyle = [];
      if (defaultSymbol) {
        defaultStyle = [this._converters[defaultSymbol.type].call(this, defaultSymbol)];
      }
      var field = renderer.field1;
      var infos = renderer.uniqueValueInfos;
      var me = this;
      return function () {
        var hash = {};
        for (var i = 0, ii = infos.length; i < ii; ++i) {
          var info = infos[i],
              symbol = info.symbol;
          hash[info.value] = [me._converters[symbol.type].call(me, symbol)];
        }
        return function (feature) {
          var style = hash[feature.get(field)];
          return style ? style : defaultStyle;
        };
      }();
    }
  }, {
    key: 'generateStyle',
    value: function generateStyle(layerInfo, mapUnits) {
      var drawingInfo = layerInfo.drawingInfo;
      var styleFunctions = [];
      var drawingInfoStyle = this._renderers[drawingInfo.renderer.type].call(this, drawingInfo.renderer);
      if (drawingInfoStyle !== undefined) {
        styleFunctions.push(drawingInfoStyle);
      }
      if (layerInfo.labelingInfo) {
        var labelingInfoStyleFunctions = this._convertLabelingInfo(layerInfo.labelingInfo, mapUnits);
        styleFunctions = styleFunctions.concat(labelingInfoStyleFunctions);
      }
      if (styleFunctions.length === 1) {
        return styleFunctions[0];
      } else {
        return function () {
          return function (feature, resolution) {
            var styles = [];
            for (var i = 0, ii = styleFunctions.length; i < ii; ++i) {
              var result = styleFunctions[i].call(null, feature, resolution);
              if (result) {
                styles = styles.concat(result);
              }
            }
            return styles;
          };
        }();
      }
    }
  }], [{
    key: '_convertPointToPixel',
    value: function _convertPointToPixel(point) {
      return point / 0.75;
    }
  }, {
    key: '_transformColor',
    value: function _transformColor(color) {
      // alpha channel is different, runs from 0-255 but in ol3 from 0-1
      return [color[0], color[1], color[2], color[3] / 255];
    }
  }, {
    key: '_convertEsriTS',
    value: function _convertEsriTS(symbol) {
      var rotation = _Util2.default.isDefinedAndNotNull(symbol.angle) ? StyleGenerator._transformAngle(symbol.angle) : undefined;
      var text = _Util2.default.isDefinedAndNotNull(symbol.text) ? symbol.text : undefined;
      return new ol.style.Style({
        text: new ol.style.Text({
          fill: new ol.style.Fill({ color: StyleGenerator._transformColor(symbol.color) }),
          font: symbol.font.style + ' ' + symbol.font.weight + ' ' + symbol.font.size + ' px ' + symbol.font.family,
          textBaseline: symbol.verticalAlignment,
          textAlign: symbol.horizontalAlignment,
          offsetX: StyleGenerator._convertPointToPixel(symbol.xoffset),
          offsetY: StyleGenerator._convertPointToPixel(symbol.yoffset),
          rotation: rotation,
          text: text
        })
      });
    }
    /* convert an Esri Picture Marker Symbol */

  }, {
    key: '_convertEsriPMS',
    value: function _convertEsriPMS(symbol) {
      var width = Math.ceil(StyleGenerator._convertPointToPixel(symbol.width));
      var img = document.createElement('img');
      img.src = 'data:' + symbol.contentType + ';base64, ' + symbol.imageData;
      var rotation = _Util2.default.isDefinedAndNotNull(symbol.angle) ? StyleGenerator._transformAngle(symbol.angle) : undefined;
      return new ol.style.Style({
        image: new ol.style.Icon({
          img: img,
          imgSize: [img.width, img.height],
          scale: width / img.width,
          rotation: rotation
        })
      });
    }
    /* convert an Esri Simple Fill Symbol */

  }, {
    key: '_convertEsriSFS',
    value: function _convertEsriSFS(symbol) {
      // there is no support in openlayers currently for fill patterns, so style is not interpreted
      var fill = new ol.style.Fill({
        color: StyleGenerator._transformColor(symbol.color)
      });
      var stroke = symbol.outline ? StyleGenerator._convertOutline(symbol.outline) : undefined;
      return new ol.style.Style({
        fill: fill,
        stroke: stroke
      });
    }
  }, {
    key: '_convertOutline',
    value: function _convertOutline(outline) {
      var lineDash;
      var color = StyleGenerator._transformColor(outline.color);
      if (outline.style === 'esriSLSDash') {
        lineDash = [5];
      } else if (outline.style === 'esriSLSDashDot') {
        lineDash = [5, 5, 1, 2];
      } else if (outline.style === 'esriSLSDashDotDot') {
        lineDash = [5, 5, 1, 2, 1, 2];
      } else if (outline.style === 'esriSLSDot') {
        lineDash = [1, 2];
      } else if (outline.style === 'esriSLSNull') {
        // line not visible, make color fully transparent
        color[3] = 0;
      }
      return new ol.style.Stroke({
        color: color,
        lineDash: lineDash,
        width: StyleGenerator._convertPointToPixel(outline.width)
      });
    }
    /* convert an Esri Simple Line Symbol */

  }, {
    key: '_convertEsriSLS',
    value: function _convertEsriSLS(symbol) {
      return new ol.style.Style({
        stroke: StyleGenerator._convertOutline(symbol)
      });
    }
  }, {
    key: '_transformAngle',
    value: function _transformAngle(angle) {
      var normalRad = angle * Math.PI / 180;
      var ol3Rad = -normalRad + Math.PI / 2;
      if (ol3Rad < 0) {
        return 2 * Math.PI + ol3Rad;
      } else {
        return ol3Rad;
      }
    }
    /* convert an Esri Simple Marker Symbol */

  }, {
    key: '_convertEsriSMS',
    value: function _convertEsriSMS(symbol) {
      var fill = new ol.style.Fill({
        color: StyleGenerator._transformColor(symbol.color)
      });
      var stroke = symbol.outline ? StyleGenerator._convertOutline(symbol.outline) : undefined;
      var radius = StyleGenerator._convertPointToPixel(symbol.size) / 2;
      var rotation = _Util2.default.isDefinedAndNotNull(symbol.angle) ? StyleGenerator._transformAngle(symbol.angle) : undefined;
      if (symbol.style === 'esriSMSCircle') {
        return new ol.style.Style({
          image: new ol.style.Circle({
            radius: radius,
            fill: fill,
            stroke: stroke
          })
        });
      } else if (symbol.style === 'esriSMSCross') {
        return new ol.style.Style({
          image: new ol.style.RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: radius,
            radius2: 0,
            angle: 0,
            rotation: rotation
          })
        });
      } else if (symbol.style === 'esriSMSDiamond') {
        return new ol.style.Style({
          image: new ol.style.RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: radius,
            rotation: rotation
          })
        });
      } else if (symbol.style === 'esriSMSSquare') {
        return new ol.style.Style({
          image: new ol.style.RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: radius,
            angle: Math.PI / 4,
            rotation: rotation
          })
        });
      } else if (symbol.style === 'esriSMSX') {
        return new ol.style.Style({
          image: new ol.style.RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: radius,
            radius2: 0,
            angle: Math.PI / 4,
            rotation: rotation
          })
        });
      } else if (symbol.style === 'esriSMSTriangle') {
        return new ol.style.Style({
          image: new ol.style.RegularShape({
            fill: fill,
            stroke: stroke,
            points: 3,
            radius: radius,
            angle: 0,
            rotation: rotation
          })
        });
      }
    }
  }]);

  return StyleGenerator;
}();

exports.default = StyleGenerator;

},{"./Util":3}],3:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* global ol */
var utils = {
  isDefinedAndNotNull: function isDefinedAndNotNull(value) {
    return value !== undefined && value !== null;
  },
  getResolutionForScale: function getResolutionForScale(scale, units) {
    var dpi = 25.4 / 0.28;
    var mpu = ol.proj.METERS_PER_UNIT[units];
    var inchesPerMeter = 39.37;
    return parseFloat(scale) / (mpu * inchesPerMeter * dpi);
  }
};

exports.default = utils;

},{}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StyleGenerator = _dereq_('./StyleGenerator');

var _StyleGenerator2 = _interopRequireDefault(_StyleGenerator);

var _Util = _dereq_('./Util');

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VectorLayerModifier = function () {
  function VectorLayerModifier() {
    _classCallCheck(this, VectorLayerModifier);
  }

  _createClass(VectorLayerModifier, null, [{
    key: 'modifyLayer',
    value: function modifyLayer(layerInfo, layer, mapProjection) {
      var styleGenerator = new _StyleGenerator2.default();
      var transparency = layerInfo.drawingInfo.transparency;
      if (_Util2.default.isDefinedAndNotNull(transparency)) {
        layer.setOpacity((100 - transparency) / 100);
      }
      var mapUnits = mapProjection.getUnits();
      layer.setStyle(styleGenerator.generateStyle(layerInfo, mapUnits));
      if (layerInfo.minScale) {
        layer.setMaxResolution(_Util2.default.getResolutionForScale(layerInfo.minScale, mapUnits));
      }
      if (layerInfo.maxScale) {
        layer.setMinResolution(_Util2.default.getResolutionForScale(layerInfo.maxScale, mapUnits));
      }
    }
  }]);

  return VectorLayerModifier;
}();

exports.default = VectorLayerModifier;

},{"./StyleGenerator":2,"./Util":3}],5:[function(_dereq_,module,exports){
'use strict';

var _LayerGenerator = _dereq_('./LayerGenerator');

var _LayerGenerator2 = _interopRequireDefault(_LayerGenerator);

var _StyleGenerator = _dereq_('./StyleGenerator');

var _StyleGenerator2 = _interopRequireDefault(_StyleGenerator);

var _VectorLayerModifier = _dereq_('./VectorLayerModifier');

var _VectorLayerModifier2 = _interopRequireDefault(_VectorLayerModifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  LayerGenerator: _LayerGenerator2.default,
  StyleGenerator: _StyleGenerator2.default,
  VectorLayerModifier: _VectorLayerModifier2.default
}; /*
   ** Olé - Integration of OpenLayers 3 and Esri ArcGIS REST services
   ** Copyright 2015-present Boundless Spatial, Inc.
   ** License: https://raw.githubusercontent.com/boundlessgeo/ole/master/LICENSE
   ** Version: v0.6.3
   */

},{"./LayerGenerator":1,"./StyleGenerator":2,"./VectorLayerModifier":4}]},{},[5])(5)
});