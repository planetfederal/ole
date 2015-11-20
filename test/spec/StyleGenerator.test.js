function itNoPhantom() {
  if (window.checkForMocha) {
    return xit.apply(this, arguments);
  } else {
    return it.apply(this, arguments);
  }
}

describe('StyleGenerator', function() {

  describe('#convertPointToPixel', function() {
    it('converts points correctly to pixels', function() {
      expect(ole.StyleGenerator._convertPointToPixel(17)).to.be(17/0.75);
    });
  });

  describe('#transformColor', function() { 
    it('converts color values correctly', function() { 
      expect(ole.StyleGenerator._transformColor([255, 0, 0, 255])).to.eql([255, 0, 0, 1]);
    });
  });

  describe('#convertLabelingInfo', function() {
    it('converts labeling info correctly', function() {
      var labelingInfo = [{
        "labelPlacement": "esriServerPolygonPlacementAlwaysHorizontal",
        "labelExpression": "[TAG]",
        "useCodedValues": false,
        "symbol": {
          "type": "esriTS",
          "color": [78,78,78,255],
          "backgroundColor": null,
          "borderLineColor": null,
          "verticalAlignment": "bottom",
          "horizontalAlignment": "left",
          "rightToLeft": false,
          "angle": 0,
          "xoffset": 0,
          "yoffset": 0,
          "font": {
            "family": "Arial",
            "size": 12,
            "style": "normal",
            "weight": "bold",
            "decoration": "none"
          }
        },
        "minScale": 1999,
        "maxScale": 0,
        "where": ""
      }, {
        "labelPlacement": "esriServerPolygonPlacementAlwaysHorizontal",
        "labelExpression": "[XAG]",
        "useCodedValues": true,
        "symbol": {
          "type": "esriTS",
          "color": [88,88,88,255],
          "backgroundColor": null,
          "borderLineColor": null,
          "verticalAlignment": "bottom",
          "horizontalAlignment": "left",
          "rightToLeft": false,
          "angle": 0,
          "xoffset": 0,
          "yoffset": 0,
          "font": {
            "family": "Arial",
            "size": 12,
            "style": "normal",
            "weight": "bold",
            "decoration": "none"
          }
        },
        "minScale": 0,
        "maxScale": 7100,
        "where": ""
      }];
      var styles = new ole.StyleGenerator()._convertLabelingInfo(labelingInfo, 'm');
      var feature = new ol.Feature({'TAG': 'foo'});
      var style = styles[0].call(null, feature, 0.4)[0];
      expect(style.getText().getText()).to.be('foo');
      expect(style.getText().getFill().getColor()).to.eql([78,78,78,1]);
      feature = new ol.Feature({'XAG': 'bar'});
      style = styles[1].call(null, feature, 5)[0];
      expect(style.getText().getText()).to.be('bar');
      expect(style.getText().getFill().getColor()).to.eql([88,88,88,1]);
      style = styles[1].call(null, feature, 1);
      expect(style).to.be(undefined); // out of scale
    });
  });

  describe('#convertEsriPMS', function() {
    itNoPhantom('converts picture marker symbol correctly', function() {
      var symbol = {
        "type" : "esriPMS", 
        "url" : "471E7E31", 
        "imageData" : "iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMNJREFUSIntlcENwyAMRZ+lSMyQFcI8rJA50jWyQuahKzCDT+6h0EuL1BA1iip8Qg/Ex99fYuCkGv5bKK0EcB40YgSE7bnTxsa58LeOnMd0QhwGXkxB3L0w0IDxPaMqpBFxjLMuaSVmRjurWIcRDHxaiWZuEbRcEhpZpSNhE9O81GiMN5E0ZRt2M0iVjshek8UkTQfZy8JqGHYP/rJhODD4T6wehtbB9zD0MPQwlOphaAxD/uPLK7Z8MB5gFet+WKcJPQDx29XkRhqr/AAAAABJRU5ErkJggg==", 
        "contentType" : "image/png", 
        "width" : 25, 
        "height" : 25, 
        "angle" : 180, 
        "xoffset" : 0, 
        "yoffset" : 0
      };
      var style = ole.StyleGenerator._convertEsriPMS(symbol);
      var iconStyle = style.getImage();
      expect(iconStyle.getRotation()).to.be(4.71238898038469);
      var srcOkay = (iconStyle.getSrc() === 'data:' + symbol.contentType + ';base64, ' + symbol.imageData) || (iconStyle.getSrc() === 'data:' + symbol.contentType + ';base64,' + symbol.imageData);
      expect(srcOkay).to.be(true);
    });
  });

  describe('#convertEsriTS', function() {
    it('converts a text symbol correctly', function() {
      var symbol = {
       "type": "esriTS",
       "color": [78,78,78,255],
       "backgroundColor": [0,0,0,0],
       "borderLineSize": 2,
       "borderLineColor": [255,0,255,255],
       "haloSize": 2,
       "haloColor": [0,255,0,255],
       "verticalAlignment": "bottom",
       "horizontalAlignment": "left",
       "rightToLeft": false,
       "angle": 180,
       "xoffset": 0,
       "yoffset": 0,
       "kerning": true,
       "text": "Foo",
       "font": {
         "family": "Arial",
         "size": 12,
         "style": "normal",
         "weight": "bold",
         "decoration": "none"
       }
      };
      var style = ole.StyleGenerator._convertEsriTS(symbol);
      var text = style.getText();
      expect(text.getFont()).to.be('normal bold 12 px Arial');
      expect(text.getFill().getColor()).to.eql([78, 78, 78, 1]);
      expect(text.getTextBaseline()).to.be('bottom');
      expect(text.getTextAlign()).to.be('left');
      expect(text.getOffsetX()).to.be(0);
      expect(text.getOffsetY()).to.be(0);
      expect(text.getRotation()).to.be(4.71238898038469);
      expect(text.getText()).to.be('Foo');
    });
  });

  describe('#convertEsriSLS', function() {
    it('converts simple line symbol correctly', function() {
      var symbol = {
        "type": "esriSLS",
        "style": "esriSLSDot",
        "color": [115,76,0,255],
        "width": 1
      };
      var style = ole.StyleGenerator._convertEsriSLS(symbol);
      var stroke = style.getStroke();
      expect(stroke.getColor()).to.eql([115,76,0,1]);
      expect(stroke.getWidth()).to.be(1/0.75);
      expect(stroke.getLineDash()).to.eql([1, 2]);
    });
  });

  describe('#convertEsriSFS', function() {
    it('converts simple fill symbol correctly', function() {
      var symbol = {
        "type": "esriSFS",
        "style": "esriSFSSolid",
        "color": [115,76,0,255],
        "outline": {
          "type": "esriSLS",
          "style": "esriSLSDashDot",
          "color": [110,110,110,255],
          "width": 1
	}
      };
      var style = ole.StyleGenerator._convertEsriSFS(symbol);
      var fill = style.getFill();
      var stroke = style.getStroke();
      expect(fill.getColor()).to.eql([115,76,0,1]);
      expect(stroke.getColor()).to.eql([110,110,110,1]);
      expect(stroke.getWidth()).to.be(1/0.75);
      expect(stroke.getLineDash()).to.eql([5, 5, 1, 2]);
    });
  });

  describe('#convertEsriSMS', function() {
    it('converts simple marker symbol', function() {
      var symbol = {
        "type": "esriSMS",
        "style": "esriSMSSquare",
        "color": [76,115,0,255],
        "size": 8,
        "angle": 180,
        "xoffset": 0,
        "yoffset": 0,
        "outline": {
          "color": [152,230,0,255],
          "width": 1
        }
      };
      var style = ole.StyleGenerator._convertEsriSMS(symbol);
      var image = style.getImage();
      var fill = image.getFill();
      var stroke = image.getStroke();
      expect(image).to.be.a(ol.style.RegularShape);
      expect(image.getRotation()).to.be(4.71238898038469);
      expect(fill.getColor()).to.eql([76,115,0,1]);
      expect(stroke.getColor()).to.eql([152,230,0,1]);
      expect(stroke.getWidth()).to.eql(1/0.75);
      expect(image.getPoints()).to.be(4);
      expect(image.getRadius()).to.be((8/0.75)/2);
      expect(image.getAngle()).to.be(Math.PI / 4);
    });
  });

  describe('#renderClassBreaks', function() {
    it('renders a class breaks renderer', function() {
      var renderer = { 	
        "type" : "classBreaks", 
        "field" : "Shape.area", 
        "classificationMethod" : "esriClassifyManual", 
        "defaultSymbol": {
          "type": "esriSFS",
          "style": "esriSFSDiagonalCross",
          "color": [255,0,0,255],
          "outline": {
            "type": "esriSLS",
            "style": "esriSLSSolid",
            "color": [110,110,110,255],
            "width": 0.5
          }
        },
        "minValue" : 10.0, 
        "classBreakInfos" : [{
          "classMaxValue" : 1000, 
          "label" : "10.0 - 1000.000000", 
          "description" : "10 to 1000", 
          "symbol" : {
            "type" : "esriSFS", 
            "style" : "esriSFSSolid", 
            "color" : [236,252,204,255], 
            "outline" : {
              "type" : "esriSLS", 
              "style" : "esriSLSSolid", 
              "color" : [110,110,110,255], 
              "width" : 0.4
            }
          }
        }, {
          "classMaxValue" : 5000, 
          "label" : "1000.000001 - 5000.000000", 
          "description" : "1000 to 5000", 
          "symbol" : {
            "type" : "esriSFS", 
            "style" : "esriSFSSolid", 
            "color" : [218,240,158,255], 
            "outline" :  {
              "type" : "esriSLS", 
              "style" : "esriSLSSolid", 
              "color" : [110,110,110,255], 
              "width" : 0.4
            }
          }
        }, {
          "classMinValue" : 8000,
          "classMaxValue" : 10000, 
          "label" : "8000.000001 - 10000.000000", 
          "description" : "1000 to 5000", 
          "symbol" : {
            "type" : "esriSFS", 
            "style" : "esriSFSSolid", 
            "color" : [255,255,0,255], 
            "outline" : { 
              "type" : "esriSLS", 
              "style" : "esriSLSSolid", 
              "color" : [110,110,110,255], 
              "width" : 0.4
            }
          }
        }],
        "rotationType": "geographic",
        "rotationExpression": "[Rotation] * 2"
      };
      var styleFn = new ole.StyleGenerator()._renderClassBreaks(renderer);
      var feature = new ol.Feature({'Shape.area': 10.0});
      var style = styleFn.call(null, feature)[0];
      expect(style.getFill().getColor()).to.eql([236,252,204,1]);
      feature.set('Shape.area', 1000.000001);
      style = styleFn.call(null, feature)[0];
      expect(style.getFill().getColor()).to.eql([218,240,158,1]);
      feature.set('Shape.area', 8000.000001);
      style = styleFn.call(null, feature)[0];
      expect(style.getFill().getColor()).to.eql([255,255,0,1]);
      feature.set('Shape.area', 5001.000000);
      style = styleFn.call(null, feature)[0];
      expect(style.getFill().getColor()).to.eql([255,0,0,1]);
    });
  });

  describe('#renderUnique', function() {
    it('renders a unique renderer', function() {
      var renderer = {
        "type" : "uniqueValue", 
        "field1" : "SubtypeCD", 
        "field2" : null, 
        "field3" : null, 
        "fieldDelimiter" : ", ", 
        "defaultSymbol" : {
          "type" : "esriSLS", 
          "style" : "esriSLSSolid", 
          "color" : [130,130,130,255], 
          "width" : 1
        }, 
        "defaultLabel" : "\u003cOther values\u003e", 
        "uniqueValueInfos" : [{
          "value" : "1", 
          "label" : "Duct Bank", 
          "description" : "Duct Bank description", 
          "symbol" : {
            "type" : "esriSLS", 
            "style" : "esriSLSDash", 
            "color" : [76,0,163,255], 
            "width" : 1
          }
        }, { 
          "value" : "2", 
          "label" : "Trench", 
          "description" : "Trench description", 
          "symbol" : {
            "type" : "esriSLS", 
            "style" : "esriSLSDot", 
            "color" : [115,76,0,255], 
            "width" : 1
          }
        }],
        "rotationType": "geographic",
        "rotationExpression": "[Rotation] * 2"
      };
      var styleFn = new ole.StyleGenerator()._renderUniqueValue(renderer);
      var feature = new ol.Feature({'SubtypeCD': '1'});
      var style = styleFn.call(null, feature)[0];
      expect(style.getStroke().getColor()).to.eql([76,0,163,1]);
      feature.set('SubtypeCD', '2');
      style = styleFn.call(null, feature)[0];
      expect(style.getStroke().getColor()).to.eql([115,76,0,1]);
      feature.set('SubtypeCD', '3');
      style = styleFn.call(null, feature)[0];
      expect(style.getStroke().getColor()).to.eql([130,130,130,1]);
    });
  });

  describe('#renderSimple', function() {
    it('renders a simple renderer', function() {
      var renderer = {  
        "type": "simple",
        "symbol": {
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "color": [255,0,0,255],
          "size": 5,
          "angle": 0,
          "xoffset": 0,
          "yoffset": 0,
          "outline": {
            "color": [0,0,0,255],
            "width": 1
          }
        },
        "label": "",
        "description": "",
        "rotationType": "geographic",
        "rotationExpression": "[Rotation] * 2"
      };
      var styleFn = new ole.StyleGenerator()._renderSimple(renderer);
      var style = styleFn.call()[0];
      expect(style).to.be.a(ol.style.Style);
      var image = style.getImage();
      expect(image).to.be.a(ol.style.Circle);
      expect(image.getFill().getColor()).to.eql([255,0,0,1]);
      expect(image.getRadius()).to.be((5/2)/0.75);
      expect(image.getStroke().getColor()).to.eql([0,0,0,1]);
      expect(image.getStroke().getWidth()).to.be(1/0.75);
    });
  });

  // http://services.arcgis.com/rOo16HdIMeOBI4Mb/ArcGIS/rest/services/affordable_housing/FeatureServer
  describe('generates correct style (affordable_housing)', function(){
    var styles, layerInfo;
    beforeEach(function(done) {
      afterLoadJson('spec/data/affordable_housing.json', function(json) {
        var generator = new ole.StyleGenerator();
        layerInfo = JSON.parse(json);
        styles = generator.generateStyle(layerInfo, 'm');
        done();
      });
    });
    it('generates correct classes', function() {
      // simple renderer
      // esriPMS symbol
      // size 15 points, 20 pixels
      // image width is 64x64
      // scale = 20/64
      var style = styles.call()[0];
      expect(style).to.be.a(ol.style.Style);
      var image = style.getImage();
      expect(image).to.be.a(ol.style.Icon);
      expect(image.getSrc().split(',')[1].trim().replace('%20', '')).to.be(layerInfo.drawingInfo.renderer.symbol.imageData);
    });
  });

});
