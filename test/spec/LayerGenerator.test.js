describe('LayerGenerator', function() {

  describe('generates correct information', function(){

        var generator;
        beforeEach(function(done) {
          afterLoadJson('spec/data/TMK1850.json', function(json) {
            var url = 'http://tiles.arcgis.com/tiles/nSZVuSZjHpEZZbRo/arcgis/rest/services/TMK1850/MapServer';
            generator = new LayerGenerator({config: JSON.parse(json), url: url});
            done();
          });
        });
        it('generates correct resolutions', function() {
            var resolutions = generator.getResolutions();
            expect(resolutions).to.eql([
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
            ]);
        });
    });
});
