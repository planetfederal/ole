/* global ol */
import StyleGenerator from './StyleGenerator';

export default class VectorLayerModifier {
  static modifyLayer(layerInfo, layer, mapProjection) {
    var styleGenerator = new StyleGenerator();
    var transparency = layerInfo.drawingInfo.transparency;
    if (transparency !== null || transparency !== undefined) {
      layer.setOpacity((100-transparency)/100);
    }
    layer.setStyle(styleGenerator.generateStyle(layerInfo.drawingInfo));
    var dpi = 25.4 / 0.28;
    var mpu = ol.proj.METERS_PER_UNIT[mapProjection.getUnits()];
    var inchesPerMeter = 39.37;
    if (layerInfo.minScale) { 
      var maxResolution = parseFloat(layerInfo.minScale) / (mpu * inchesPerMeter * dpi);
      layer.setMaxResolution(maxResolution);
    }
    if (layerInfo.maxScale) {
      var minResolution = parseFloat(layerInfo.maxScale) / (mpu * inchesPerMeter * dpi);
      layer.setMinResolution(minResolution);
    }
  }
}
