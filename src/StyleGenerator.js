/* global ol */
import utils from './Util';

export default class StyleGenerator {
  constructor() {
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
  static _convertPointToPixel(point) {
    return (point / 0.75);
  }
  static _transformColor(color) {
    // alpha channel is different, runs from 0-255 but in ol3 from 0-1
    return [color[0], color[1], color[2], color[3] / 255];
  }
  /* convert an Esri Text Symbol */
  static _convertEsriTS(symbol) {
    var rotation = utils.isDefinedAndNotNull(symbol.angle) ?
      StyleGenerator._transformAngle(symbol.angle) : undefined;
    var text = utils.isDefinedAndNotNull(symbol.text) ? symbol.text : undefined;
    return new ol.style.Style({
      text: new ol.style.Text({
        fill: new ol.style.Fill({color: StyleGenerator._transformColor(symbol.color)}),
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
  static _convertEsriPMS(symbol) {
    var width = Math.ceil(StyleGenerator._convertPointToPixel(symbol.width));
    var img = document.createElement('img');
    img.src = 'data:' + symbol.contentType + ';base64, ' + symbol.imageData;
    var rotation = utils.isDefinedAndNotNull(symbol.angle) ?
      StyleGenerator._transformAngle(symbol.angle) : undefined;
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
  static _convertEsriSFS(symbol) {
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
  static _convertOutline(outline) {
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
  static _convertEsriSLS(symbol) {
    return new ol.style.Style({
      stroke: StyleGenerator._convertOutline(symbol)
    });
  }
  static _transformAngle(angle) {
    var normalRad = (angle * Math.PI) / 180;
    var ol3Rad = -normalRad + Math.PI / 2;
    if (ol3Rad < 0) {
      return 2 * Math.PI + ol3Rad;
    } else {
      return ol3Rad;
    }
  }
  /* convert an Esri Simple Marker Symbol */
  static _convertEsriSMS(symbol) {
    var fill = new ol.style.Fill({
      color: StyleGenerator._transformColor(symbol.color)
    });
    var stroke = symbol.outline ? StyleGenerator._convertOutline(symbol.outline) : undefined;
    var radius = StyleGenerator._convertPointToPixel(symbol.size) / 2;
    var rotation = utils.isDefinedAndNotNull(symbol.angle) ?
      StyleGenerator._transformAngle(symbol.angle) : undefined;
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
  _renderSimple(renderer) {
    return this._converters[renderer.symbol.type].call(this, renderer.symbol);
  }
  _renderClassBreaks(renderer) {
    var defaultSymbol = renderer.defaultSymbol;
    var defaultStyle = this._converters[defaultSymbol.type].call(this, renderer.defaultSymbol);
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
      classes.push({min: min, max: max, style: style});
    }
    return (function() {
      return function(feature) {
        var value = feature.get(field);
        for (i = 0, ii = classes.length; i < ii; ++i) {
          var condition;
          if (i === 0) {
            condition = (value >= classes[i].min && value <= classes[i].max);
          } else {
            condition = (value > classes[i].min && value <= classes[i].max);
          }
          if (condition) {
            return [classes[i].style];
          }
        }
        return [defaultStyle];
      };
    }());
  }
  _renderUniqueValue(renderer) {
    var field = renderer.field1;
    var infos = renderer.uniqueValueInfos;
    var me = this;
    return (function() {
      var hash = {};
      for (var i = 0, ii = infos.length; i < ii; ++i) {
        var info = infos[i], symbol = info.symbol;
        hash[info.value] = [me._converters[symbol.type].call(me, symbol)];
      }
      return function(feature) {
        return hash[feature.get(field)];
      };
    }());
  }
  generateStyle(drawingInfo) {
    return this._renderers[drawingInfo.renderer.type].call(this, drawingInfo.renderer);
  }
}
