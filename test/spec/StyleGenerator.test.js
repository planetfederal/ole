describe('StyleGenerator', function() {

  describe('#convertPointToPixel', function() {
    it('converts points correctly to pixels', function() {
      expect(ol3Esri.StyleGenerator._convertPointToPixel(17)).to.be(17/0.75);
    });
  });

  describe('#transformColor', function() { 
    it('converts color values correctly', function() { 
      expect(ol3Esri.StyleGenerator._transformColor([255, 0, 0, 255])).to.eql([255, 0, 0, 1]);
    });
  });

  describe('#convertEsriPMS', function() {
    it('converts picture marker symbol correctly', function() {
      var symbol = {
        "type" : "esriPMS", 
        "url" : "471E7E31", 
        "imageData" : "iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMNJREFUSIntlcENwyAMRZ+lSMyQFcI8rJA50jWyQuahKzCDT+6h0EuL1BA1iip8Qg/Ex99fYuCkGv5bKK0EcB40YgSE7bnTxsa58LeOnMd0QhwGXkxB3L0w0IDxPaMqpBFxjLMuaSVmRjurWIcRDHxaiWZuEbRcEhpZpSNhE9O81GiMN5E0ZRt2M0iVjshek8UkTQfZy8JqGHYP/rJhODD4T6wehtbB9zD0MPQwlOphaAxD/uPLK7Z8MB5gFet+WKcJPQDx29XkRhqr/AAAAABJRU5ErkJggg==", 
        "contentType" : "image/png", 
        "width" : 25, 
        "height" : 25, 
        "angle" : 0, 
        "xoffset" : 0, 
        "yoffset" : 0
      };
      var style = ol3Esri.StyleGenerator._convertEsriPMS(symbol);
      var iconStyle = style.getImage();
      expect(iconStyle.getSrc()).to.be('data:' + symbol.contentType + ';base64, ' + symbol.imageData);
      expect(iconStyle.getScale()).to.be(1.3076923076923077);
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
       "angle": 0,
       "xoffset": 0,
       "yoffset": 0,
       "kerning": true,
       "font": {
         "family": "Arial",
         "size": 12,
         "style": "normal",
         "weight": "bold",
         "decoration": "none"
       }
      };
      var style = ol3Esri.StyleGenerator._convertEsriTS(symbol);
      var text = style.getText();
      expect(text.getFont()).to.be('normal bold 12 px Arial');
      expect(text.getFill().getColor()).to.eql([78, 78, 78, 1]);
      expect(text.getTextBaseline()).to.be('bottom');
      expect(text.getTextAlign()).to.be('left');
      expect(text.getOffsetX()).to.be(0);
      expect(text.getOffsetY()).to.be(0);
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
      var style = ol3Esri.StyleGenerator._convertEsriSLS(symbol);
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
      var style = ol3Esri.StyleGenerator._convertEsriSFS(symbol);
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
        "angle": 0,
        "xoffset": 0,
        "yoffset": 0,
        "outline": {
          "color": [152,230,0,255],
          "width": 1
        }
      };
      var style = ol3Esri.StyleGenerator._convertEsriSMS(symbol);
      var image = style.getImage();
      var fill = image.getFill();
      var stroke = image.getStroke();
      expect(image).to.be.a(ol.style.RegularShape);
      expect(fill.getColor()).to.eql([76,115,0,1]);
      expect(stroke.getColor()).to.eql([152,230,0,1]);
      expect(stroke.getWidth()).to.eql(1/0.75);
      expect(image.getPoints()).to.be(4);
      expect(image.getRadius()).to.be((8/0.75)/2);
      expect(image.getAngle()).to.be(Math.PI / 4);
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
      var style = new ol3Esri.StyleGenerator()._renderSimple(renderer);
      expect(style).to.be.a(ol.style.Style);
      var image = style.getImage();
      expect(image).to.be.a(ol.style.Circle);
      expect(image.getFill().getColor()).to.eql([255,0,0,1]);
      expect(image.getRadius()).to.be((5/2)/0.75);
      expect(image.getStroke().getColor()).to.eql([0,0,0,1]);
      expect(image.getStroke().getWidth()).to.be(1/0.75);
    });
  });

  // http://services.arcgis.com/rOo16HdIMeOBI4Mb/ArcGIS/rest/services/Aggregation%20of%20Trimet%20Transit%20Stops%20to%20Portland%20Neighborhoods/FeatureServer
  describe('generates correct style (Portland)', function(){
    var style;
    beforeEach(function(done) {
      afterLoadJson('spec/data/Portland.json', function(json) {
        var generator = new ol3Esri.StyleGenerator();
        style = generator.generateStyle(JSON.parse(json).drawingInfo);
        done();
      });
    });
    it('generates correct classes', function() {
      // classBreaks renderer
      // field Point_Count
      // min data 0 max data 128
      // min size 12 max size 60 (unit points)
      // 16 32 48 64 80 sizes in pixels
      var feature = new ol.Feature({Point_Count: 10});
      var s = style(feature)[0];
      expect(s).to.be.a(ol.style.Style);
      var image = s.getImage();
      var radius = image.getRadius();
      expect(radius).to.be(16);
      var fill = image.getFill().getColor();
      expect(fill).to.eql([227, 139, 79, 0.5137254901960784]);
      var stroke = image.getStroke().getColor();
      expect(stroke).to.eql([255, 255, 255, 1]);
      feature.set('Point_Count', 40);
      s = style(feature)[0];
      expect(s.getImage().getRadius()).to.be(32);
      feature.set('Point_Count', 60);
      s = style(feature)[0];
      expect(s.getImage().getRadius()).to.be(48);
      feature.set('Point_Count', 90);
      s = style(feature)[0];
      expect(s.getImage().getRadius()).to.be(64);
      feature.set('Point_Count', 110);
      s = style(feature)[0];
      expect(s.getImage().getRadius()).to.be(80);
    });
  });

  // http://services.arcgis.com/rOo16HdIMeOBI4Mb/ArcGIS/rest/services/affordable_housing/FeatureServer
  describe('generates correct style (affordable_housing)', function(){
    var style, drawingInfo;
    beforeEach(function(done) {
      afterLoadJson('spec/data/affordable_housing.json', function(json) {
        var generator = new ol3Esri.StyleGenerator();
        drawingInfo = JSON.parse(json).drawingInfo;
        style = generator.generateStyle(drawingInfo);
        done();
      });
    });
    it('generates correct classes', function() {
      // simple renderer
      // esriPMS symbol
      // size 15 points, 20 pixels
      // image width is 64x64
      // scale = 20/64
      expect(style).to.be.a(ol.style.Style);
      var image = style.getImage();
      expect(image).to.be.a(ol.style.Icon);
      expect(image.getSrc().split(',')[1].trim().replace('%20', '')).to.be(drawingInfo.renderer.symbol.imageData);
    });
  });

});
