import StyleGenerator from './StyleGenerator';
import utils from './Util';

export default class VectorLayerModifier {
  static modifyLayer(layerInfo, layer, mapProjection) {
    var styleGenerator = new StyleGenerator();
    var transparency = layerInfo.drawingInfo.transparency;
    if (utils.isDefinedAndNotNull(transparency)) {
      layer.setOpacity((100 - transparency) / 100);
    }
    var mapUnits = mapProjection.getUnits();
    layer.setStyle(styleGenerator.generateStyle(layerInfo, mapUnits));
    if (layerInfo.minScale) {
      layer.setMaxResolution(
        utils.getResolutionForScale(
          layerInfo.minScale,
          mapUnits
        )
      );
    }
    if (layerInfo.maxScale) {
      layer.setMinResolution(
        utils.getResolutionForScale(
          layerInfo.maxScale,
          mapUnits
        )
      );
    }
  }
}
