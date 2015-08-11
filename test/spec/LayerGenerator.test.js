describe('LayerGenerator', function() {

  describe('generates correct information (ESRI_Imagery_World_2D)', function(){
    var generator;
    beforeEach(function(done) {
      afterLoadJson('spec/data/ESRI_Imagery_World_2D.json', function(json) {
        var url = 'http://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer';
        generator = new ole.LayerGenerator({config: JSON.parse(json), url: url});
        done();
      });
    });
    it('generates correct projection', function() {
      var projection = generator.getProjection();
      expect(projection.getCode()).to.be('EPSG:4326');
    });
    it('generator correct source', function() {
      var layer = generator.createLayer();
      var source = layer.getSource();
      expect(source).to.be.a(ol.source.XYZ);
      expect(source.getAttributions()[0].getHTML()).to.be('Copyright:Â© 2013 ESRI, i-cubed, GeoEye');
      expect(source.getTileGrid().getTileSize()).to.eql([512, 512]);
      expect(source.getTileGrid().getOrigin()).to.eql([-180, 90]);
    });
  });

  describe('generates correct information (ESRI_StateCityHighway_USA)', function(){
    var generator, url;
    beforeEach(function(done) {
      afterLoadJson('spec/data/ESRI_StateCityHighway_USA.json', function(json) {
        url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer';
        generator = new ole.LayerGenerator({config: JSON.parse(json), url: url});
        done();
      });
    });
    it('generates correct projection', function() {
      var projection = generator.getProjection();
      expect(projection.getCode()).to.be('EPSG:4326');
    });
    it('generator correct source', function() {
      var layer = generator.createLayer();
      var source = layer.getSource();
      expect(source).to.be.a(ol.source.TileArcGISRest);
      expect(source.getUrls()[0]).to.be(url);
      expect(source.getAttributions()[0].getHTML()).to.be('(c) ESRI and its data partners');
    });
  });

  describe('generates correct information (TMK1850)', function(){

        var generator;
        var expected_resolutions = [
          3251.206502413005,
          1625.6032512065026,
          812.8016256032513,
          406.40081280162565,
          203.20040640081282,
          101.60020320040641,
          50.800101600203206,
          25.400050800101603,
          12.700025400050801,
          6.350012700025401,
          3.1750063500127004
        ];
        beforeEach(function(done) {
          afterLoadJson('spec/data/TMK1850.json', function(json) {
            var url = 'http://tiles.arcgis.com/tiles/nSZVuSZjHpEZZbRo/arcgis/rest/services/TMK1850/MapServer';
            generator = new ole.LayerGenerator({config: JSON.parse(json), url: url});
            done();
          });
        });
        it('generates correct resolutions', function() {
            var resolutions = generator.getResolutions();
            expect(resolutions).to.eql(expected_resolutions);
        });
        it('generates correct projection', function() {
          var projection = generator.getProjection();
          expect(projection.getCode()).to.be('EPSG:28992');
        });
        it('generates correct fullExtent', function() {
          var fullExtent = generator.getFullExtent();
          expect(fullExtent).to.eql([
            -207.47158774361014,
            299606.2142068073,
            281364.2794480026,
            625025.5386816375
          ]);
        });
        it('generates correct layer and source', function() {
          var layer = generator.createLayer();
          expect(layer).to.be.a(ol.layer.Tile);
          var source = layer.getSource();
          expect(source.getAttributions()[0].getHTML()).to.be('Kadaster');
          expect(source).to.be.a(ol.source.XYZ);
          var projection = source.getProjection();
          expect(projection.getCode()).to.be('EPSG:28992');
          var tileGrid = source.getTileGrid();
          expect(tileGrid.getTileSize()).to.eql(256);
          expect(tileGrid.getOrigin()).to.eql([-285401.92, 903401.92]);
          expect(tileGrid.getResolutions()).to.eql(expected_resolutions);
        });
    });
});
