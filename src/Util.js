/* global ol */
var utils = {
  isDefinedAndNotNull(value) {
    return (value !== undefined && value !== null);
  },
  getResolutionForScale(scale, units) {
    var dpi = 25.4 / 0.28;
    var mpu = ol.proj.METERS_PER_UNIT[units];
    var inchesPerMeter = 39.37;
    return parseFloat(scale) / (mpu * inchesPerMeter * dpi);
  }
};

export default utils;
