describe('VectorLayerModifier', function() {

  describe('#modifyLayer', function() {
    var layer;
    beforeEach(function() {
      layer = new ol.layer.Vector();
    });
    it('applies transparency', function() {
      var layerInfo = {
        drawingInfo: {
          renderer: {
            type: 'simple',
            symbol: {
              type: 'esriSFS',
              color: [255,0,0,255]
            }
          },
          transparency: 40
        }
      };
      expect(layer.getOpacity()).to.be(1);
      ol3Esri.VectorLayerModifier.modifyLayer(layerInfo, layer, ol.proj.get('EPSG:3857'));
      expect(layer.getOpacity()).to.be(0.6);
    });
  });

});
