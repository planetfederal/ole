describe('StyleGenerator', function() {

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
