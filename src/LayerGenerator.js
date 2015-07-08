/* global ol */
export default class LayerGenerator {
  constructor(props) {
    this._config = props.config;
    this._url = props.url;
    this._resolutions = this._getResolutions();
    this._projection = this._getProjection();
    this._attribution = this._getAttribution();
    this._fullExtent = this._getFullExtent();
  }
  getFullExtent() {
    return this._fullExtent;
  }
  _getFullExtent() {
    return [
      this._config.fullExtent.xmin,
      this._config.fullExtent.ymin,
      this._config.fullExtent.xmax,
      this._config.fullExtent.ymax
    ];
  }
  getResolutions() {
    return this._resolutions;
  }
  _getResolutions() {
    var tileInfo = this._config.tileInfo;
    if (tileInfo) {
      var resolutions = [];
      for (var i = 0, ii = tileInfo.lods.length; i < ii; ++i) {
        resolutions.push(tileInfo.lods[i].resolution);
      }
      return resolutions;
    }
  }
  _getProjection() {
    var epsg = 'EPSG:' + this._config.spatialReference.wkid;
    var units = this._config.units === 'esriMeters' ? 'm' : 'degrees';
    var projection = ol.proj.get(epsg) ? ol.proj.get(epsg) :
      new ol.proj.Projection({code: epsg, units: units});
    return projection;
  }
  getProjection() {
    return this._projection;
  }
  _getAttribution() {
    return new ol.Attribution({
      html: this._config.copyrightText
    });
  }
  createArcGISRestSource() {
    return new ol.source.TileArcGISRest({
      url: this._url,
      attributions: [this._attribution]
    });
  }
  createXYZSource() {
    var tileInfo = this._config.tileInfo;
    var tileSize = [
      tileInfo.width || tileInfo.cols,
      tileInfo.height || tileInfo.rows
    ];
    var tileOrigin = [
      tileInfo.origin.x,
      tileInfo.origin.y
    ];
    var urls;
    var suffix = '/tile/{z}/{y}/{x}';
    if (this._config.tileServers) {
      urls = this._config.tileServers;
      for (var i = 0, ii = urls.length; i < ii; ++i) {
        urls[i] += suffix;
      }
    } else {
      urls = [this._url += suffix];
    }
    var width = tileSize[0] * this._resolutions[0];
    var height = tileSize[1] * this._resolutions[0];
    var tileUrlFunction, extent, tileGrid;
    if (this._projection.getCode() === 'EPSG:4326') {
      tileUrlFunction = function(tileCoord) {
        var url = urls.length === 1 ? urls[0] :
            urls[Math.floor(Math.random() * (urls.length - 0 + 1)) + 0];
        return url.replace('{z}', (tileCoord[0] - 1).toString())
            .replace('{x}', tileCoord[1].toString())
            .replace('{y}', (-tileCoord[2] - 1).toString());
      };
    } else {
      extent = [
        tileOrigin[0],
        tileOrigin[1] - height,
        tileOrigin[0] + width,
        tileOrigin[1]
      ];
      tileGrid = new ol.tilegrid.TileGrid({
        origin: tileOrigin,
        extent: extent,
        resolutions: this._resolutions
      });
    }
    return new ol.source.XYZ({
      attributions: [this._attribution],
      projection: this._projection,
      tileSize: tileSize,
      tileGrid: tileGrid,
      tileUrlFunction: tileUrlFunction,
      urls: urls
    });
  }
  createLayer() {
    var layer = new ol.layer.Tile();
    if (this._config.tileInfo) {
      layer.setSource(this.createXYZSource());
    } else {
      layer.setSource(this.createArcGISRestSource());
    }
    return layer;
  }
}
