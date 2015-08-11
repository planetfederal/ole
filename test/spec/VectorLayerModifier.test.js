describe('VectorLayerModifier', function() {

  describe('#modifyLayer', function() {
    var layer, layerInfo;
    beforeEach(function() {
      layer = new ol.layer.Vector();
      layerInfo = {
        minScale: 288896, 
        maxScale: 0, 
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
      ole.VectorLayerModifier.modifyLayer(layerInfo, layer, ol.proj.get('EPSG:3857'));
    });
    it('applies transparency', function() {
      expect(layer.getOpacity()).to.be(0.6);
    });
    it('applies minScale / maxScale', function() {
      expect(layer.getMinResolution()).to.be(0);
      expect(layer.getMaxResolution()).to.be(80.89104178208359);
    });
    it('sets the style on the layer', function() {
      expect(layer.getStyle().call()[0].getFill().getColor()).to.eql([255,0,0,1]);
    });
  });

});
