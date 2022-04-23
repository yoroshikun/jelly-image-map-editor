// @ts-nocheck
// This is a slightly modified copy of https://gitlab.com/mjbecze/GeoJSON-Validation/
// It has been modified to be less strict and fix bugs in the original.

/**
 * geoJSON validation according to the GeoJSON specification Version 1
 * @module geoJSONValidation
 * @class Main
 * @exports {GJV}
 */

const definitions: any = {};

/**
 * Test an object to see if it is a function
 * @method isFunction
 * @param object {Object}
 * @return {Boolean}
 */
function isFunction(object: any) {
  return typeof object === "function";
}

/**
 * A truthy test for objects
 * @method isObject
 * @param {Object}
 * @return {Boolean}
 */
function isObject(object: any) {
  return object === Object(object);
}

/**
 * Formats error messages, calls the callback
 * @method done
 * @private
 * @param trace {Boolean} Whether or not to return the trace
 * @param [message]
 * @return {Boolean} is the object valid or not?
 */
function _done(trace: any, message: any) {
  let valid = false;

  if (typeof message === "string") {
    message = [message];
  } else if (Object.prototype.toString.call(message) === "[object Array]") {
    if (message.length === 0) {
      valid = true;
    }
  } else {
    valid = true;
  }

  if (trace) {
    return message;
  } else {
    return valid;
  }
}

/**
 * calls a custom definition if one is available for the given type
 * @method _customDefinitions
 * @private
 * @param type {'String'} a GeoJSON object type
 * @param object {Object} the Object being tested
 * @return {Array} an array of errors
 */
function _customDefinitions(type: any, object: any) {
  let errors;

  if (isFunction(definitions[type])) {
    try {
      errors = definitions[type](object);
    } catch (e) {
      errors = ["Problem with custom definition for " + type + ": " + e];
    }
    // @ts-ignore this is a bug
    if (typeof result === "string") {
      errors = [errors];
    }
    if (Object.prototype.toString.call(errors) === "[object Array]") {
      return errors;
    }
  }
  return [];
}

/**
 * Define a custom validation function for one of GeoJSON objects
 * @method define
 * @param type {GeoJSON Type} the type
 * @param definition {Function} A validation function
 * @return {Boolean} Return true if the function was loaded corectly else false
 */
export const define = (type: any, definition: any) => {
  if (type in allTypes && isFunction(definition)) {
    // TODO: check to see if the type is valid
    definitions[type] = definition;
    return true;
  } else {
    return false;
  }
};

/**
 * Determines if an object is a position or not
 * @method isPosition
 * @param position {Array}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isPosition = (position: any, trace = false) => {
  let errors = [];

  // It must be an array
  if (Array.isArray(position)) {
    // and the array must have more than one element
    if (position.length <= 1) {
      errors.push("Position must be at least two elements");
    }

    position.forEach((pos, index) => {
      if (typeof pos !== "number") {
        errors.push(
          "Position must only contain numbers. Item " +
            pos +
            " at index " +
            index +
            " is invalid."
        );
      }
    });
  } else {
    errors.push("Position must be an array");
  }

  // run custom checks
  errors = errors.concat(_customDefinitions("Position", position));
  return _done(trace, errors);
};

/**
 * Determines if an object is a GeoJSON Object or not
 * @method isGeoJSONObject|valid
 * @param geoJSONObject {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isGeoJSONObject = (geoJSONObject, trace = false) => {
  if (!isObject(geoJSONObject)) {
    return _done(trace, ["must be a JSON Object"]);
  } else {
    let errors = [];
    if ("type" in geoJSONObject) {
      if (nonGeoTypes[geoJSONObject.type]) {
        return nonGeoTypes[geoJSONObject.type](geoJSONObject, trace);
      } else if (geoTypes[geoJSONObject.type]) {
        return geoTypes[geoJSONObject.type](geoJSONObject, trace);
      } else {
        errors.push(
          'type must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature", or "FeatureCollection"'
        );
      }
    } else {
      errors.push('must have a member with the name "type"');
    }

    // run custom checks
    errors = errors.concat(_customDefinitions("GeoJSONObject", geoJSONObject));
    return _done(trace, errors);
  }
};

/**
 * Determines if an object is a Geometry Object or not
 * @method isGeometryObject
 * @param geometryObject {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isGeometryObject = (geometryObject, trace = false) => {
  if (!isObject(geometryObject)) {
    return _done(trace, ["must be a JSON Object"]);
  }

  let errors = [];
  if ("type" in geometryObject) {
    if (geoTypes[geometryObject.type]) {
      return geoTypes[geometryObject.type](geometryObject, trace);
    } else {
      errors.push(
        'type must be one of: "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon" or "GeometryCollection"'
      );
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  // run custom checks
  errors = errors.concat(_customDefinitions("GeometryObject", geometryObject));
  return _done(trace, errors);
};

/**
 * Determines if an object is a Point or not
 * @method isPoint
 * @param point {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isPoint = (point, trace = false) => {
  if (!isObject(point)) {
    return _done(trace, ["must be a JSON Object"]);
  }

  let errors = [];
  if ("bbox" in point) {
    const t = isBbox(point.bbox, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  }

  if ("type" in point) {
    if (point.type !== "Point") {
      errors.push('type must be "Point"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  if ("coordinates" in point) {
    const t = isPosition(point.coordinates, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  } else {
    errors.push('must have a member with the name "coordinates"');
  }

  // run custom checks
  errors = errors.concat(_customDefinitions("Point", point));
  return _done(trace, errors);
};

/**
 * Determines if an array can be interperted as coordinates for a MultiPoint
 * @method isMultiPointCoor
 * @param coordinates {Array}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isMultiPointCoor = (coordinates, trace = false) => {
  let errors = [];

  if (Array.isArray(coordinates)) {
    coordinates.forEach((val, index) => {
      const t = isPosition(val, true);
      if (t.length) {
        // modify the err msg from "isPosition" to note the element number
        t[0] = "at " + index + ": ".concat(t[0]);
        // build a list of invalide positions
        errors = errors.concat(t);
      }
    });
  } else {
    errors.push("coordinates must be an array");
  }
  return _done(trace, errors);
};
/**
 * Determines if an object is a MultiPoint or not
 * @method isMultiPoint
 * @param position {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isMultiPoint = (multiPoint, trace = false) => {
  if (!isObject(multiPoint)) {
    return _done(trace, ["must be a JSON Object"]);
  }

  let errors = [];
  if ("bbox" in multiPoint) {
    const t = isBbox(multiPoint.bbox, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  }

  if ("type" in multiPoint) {
    if (multiPoint.type !== "MultiPoint") {
      errors.push('type must be "MultiPoint"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  if ("coordinates" in multiPoint) {
    const t = isMultiPointCoor(multiPoint.coordinates, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  } else {
    errors.push('must have a member with the name "coordinates"');
  }

  // run custom checks
  errors = errors.concat(_customDefinitions("MultiPoint", multiPoint));
  return _done(trace, errors);
};

/**
 * Determines if an array can be interperted as coordinates for a lineString
 * @method isLineStringCoor
 * @param coordinates {Array}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isLineStringCoor = (coordinates, trace = false) => {
  let errors = [];
  if (Array.isArray(coordinates)) {
    if (coordinates.length > 1) {
      coordinates.forEach((val, index) => {
        const t = isPosition(val, true);
        if (t.length) {
          // modify the err msg from 'isPosition' to note the element number
          t[0] = "at " + index + ": ".concat(t[0]);
          // build a list of invalide positions
          errors = errors.concat(t);
        }
      });
    } else {
      errors.push("coordinates must have at least two elements");
    }
  } else {
    errors.push("coordinates must be an array");
  }

  return _done(trace, errors);
};

/**
 * Determines if an object is a lineString or not
 * @method isLineString
 * @param lineString {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isLineString = (lineString, trace = false) => {
  if (!isObject(lineString)) {
    return _done(trace, ["must be a JSON Object"]);
  }

  let errors = [];
  if ("bbox" in lineString) {
    const t = isBbox(lineString.bbox, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  }

  if ("type" in lineString) {
    if (lineString.type !== "LineString") {
      errors.push('type must be "LineString"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  if ("coordinates" in lineString) {
    const t = isLineStringCoor(lineString.coordinates, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  } else {
    errors.push('must have a member with the name "coordinates"');
  }

  // run custom checks
  errors = errors.concat(_customDefinitions("LineString", lineString));
  return _done(trace, errors);
};

/**
 * Determines if an array can be interperted as coordinates for a MultiLineString
 * @method isMultiLineStringCoor
 * @param coordinates {Array}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isMultiLineStringCoor = (coordinates, trace = false) => {
  let errors = [];
  if (Array.isArray(coordinates)) {
    coordinates.forEach((val, index) => {
      const t = isLineStringCoor(val, true);
      if (t.length) {
        // modify the err msg from 'isPosition' to note the element number
        t[0] = "at " + index + ": ".concat(t[0]);
        // build a list of invalide positions
        errors = errors.concat(t);
      }
    });
  } else {
    errors.push("coordinates must be an array");
  }
  return _done(trace, errors);
};

/**
 * Determines if an object is a MultiLine String or not
 * @method isMultiLineString
 * @param multilineString {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isMultiLineString = (multilineString, trace = false) => {
  if (!isObject(multilineString)) {
    return _done(trace, ["must be a JSON Object"]);
  }

  let errors = [];
  if ("bbox" in multilineString) {
    const t = isBbox(multilineString.bbox, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  }

  if ("type" in multilineString) {
    if (multilineString.type !== "MultiLineString") {
      errors.push('type must be "MultiLineString"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  if ("coordinates" in multilineString) {
    const t = isMultiLineStringCoor(multilineString.coordinates, true);

    if (t.length) {
      errors = errors.concat(t);
    }
  } else {
    errors.push('must have a member with the name "coordinates"');
  }

  // run custom checks
  errors = errors.concat(_customDefinitions("MultiPoint", multilineString));
  return _done(trace, errors);
};

/**
 * Determines if an array is a linear Ring String or not
 * @method isMultiLineString
 * @private
 * @param coordinates {Array}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
function _linearRingCoor(coordinates, trace) {
  let errors = [];
  if (Array.isArray(coordinates)) {
    // 4 or more positions
    coordinates.forEach((val, index) => {
      const t = isPosition(val, true);
      if (t.length) {
        // modify the err msg from 'isPosition' to note the element number
        t[0] = "at " + index + ": ".concat(t[0]);
        // build a list of invalide positions
        errors = errors.concat(t);
      }
    });

    // check the first and last positions to see if they are equivalent
    // This is not required
    //  if (coordinates[0].toString() !== coordinates[coordinates.length - 1].toString()) {
    //    errors.push('The first and last positions must be equivalent')
    //  }

    // Also this is problematic
    //  if (coordinates.length < 4) {
    //    errors.push('coordinates must have at least four positions')
    //  }
  } else {
    errors.push("coordinates must be an array");
  }

  return _done(trace, errors);
}

/**
 * Determines if an array is valid Polygon Coordinates or not
 * @method _polygonCoor
 * @private
 * @param coordinates {Array}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isPolygonCoor = (coordinates, trace = false) => {
  let errors = [];
  if (Array.isArray(coordinates)) {
    coordinates.forEach((val, index) => {
      const t = _linearRingCoor(val, true);

      if (t.length) {
        // modify the err msg from 'isPosition' to note the element number
        t[0] = "at " + index + ": ".concat(t[0]);
        // build a list of invalid positions
        errors = errors.concat(t);
      }
    });
  } else {
    errors.push("coordinates must be an array");
  }

  return _done(trace, errors);
};

/**
 * Determines if an object is a valid Polygon
 * @method isPolygon
 * @param polygon {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isPolygon = (polygon, trace = false) => {
  if (!isObject(polygon)) {
    return _done(trace, ["must be a JSON Object"]);
  }

  let errors = [];

  if ("bbox" in polygon) {
    const t = isBbox(polygon.bbox, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  }

  if ("type" in polygon) {
    if (polygon.type !== "Polygon") {
      errors.push('type must be "Polygon"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  if ("coordinates" in polygon) {
    const t = isPolygonCoor(polygon.coordinates, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  } else {
    errors.push('must have a member with the name "coordinates"');
  }

  // run custom checks
  errors = errors.concat(_customDefinitions("Polygon", polygon));

  return _done(trace, errors);
};

/**
 * Determines if an array can be interperted as coordinates for a MultiPolygon
 * @method isMultiPolygonCoor
 * @param coordinates {Array}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isMultiPolygonCoor = (coordinates, trace = false) => {
  let errors = [];
  if (Array.isArray(coordinates)) {
    coordinates.forEach((val, index) => {
      const t = isPolygonCoor(val, true);
      if (t.length) {
        // modify the err msg from 'isPosition' to note the element number
        t[0] = "at " + index + ": ".concat(t[0]);
        // build a list of invalide positions
        errors = errors.concat(t);
      }
    });
  } else {
    errors.push("coordinates must be an array");
  }

  return _done(trace, errors);
};

/**
 * Determines if an object is a valid MultiPolygon
 * @method isMultiPolygon
 * @param multiPolygon {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isMultiPolygon = (multiPolygon, trace = false) => {
  if (!isObject(multiPolygon)) {
    return _done(trace, ["must be a JSON Object"]);
  }

  let errors = [];
  if ("bbox" in multiPolygon) {
    const t = isBbox(multiPolygon.bbox, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  }

  if ("type" in multiPolygon) {
    if (multiPolygon.type !== "MultiPolygon") {
      errors.push('type must be "MultiPolygon"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  if ("coordinates" in multiPolygon) {
    const t = isMultiPolygonCoor(multiPolygon.coordinates, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  } else {
    errors.push('must have a member with the name "coordinates"');
  }

  // run custom checks
  errors = errors.concat(_customDefinitions("MultiPolygon", multiPolygon));

  return _done(trace, errors);
};

/**
 * Determines if an object is a valid Geometry Collection
 * @method isGeometryCollection
 * @param geometryCollection {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isGeometryCollection = (geometryCollection, trace = false) => {
  if (!isObject(geometryCollection)) {
    return _done(trace, ["must be a JSON Object"]);
  }

  let errors = [];
  if ("bbox" in geometryCollection) {
    const t = isBbox(geometryCollection.bbox, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  }

  if ("type" in geometryCollection) {
    if (geometryCollection.type !== "GeometryCollection") {
      errors.push('type must be "GeometryCollection"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  if ("geometries" in geometryCollection) {
    if (Array.isArray(geometryCollection.geometries)) {
      geometryCollection.geometries.forEach((val, index) => {
        const t = isGeometryObject(val, true);
        if (t.length) {
          // modify the err msg from 'isPosition' to note the element number
          t[0] = "at " + index + ": ".concat(t[0]);
          // build a list of invalide positions
          errors = errors.concat(t);
        }
      });
    } else {
      errors.push('"geometries" must be an array');
    }
  } else {
    errors.push('must have a member with the name "geometries"');
  }

  // run custom checks
  errors = errors.concat(
    _customDefinitions("GeometryCollection", geometryCollection)
  );

  return _done(trace, errors);
};

/**
 * Determines if an object is a valid Feature
 * @method isFeature
 * @param feature {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isFeature = (feature, trace = false) => {
  if (!isObject(feature)) {
    return _done(trace, ["must be a JSON Object"]);
  }

  let errors = [];
  if ("bbox" in feature) {
    const t = isBbox(feature.bbox, true);
    if (t.length) {
      errors = errors.concat(t);
    }
  }

  if ("type" in feature) {
    if (feature.type !== "Feature") {
      errors.push('type must be "Feature"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  if (!("properties" in feature)) {
    errors.push('must have a member with the name "properties"');
  }

  if ("geometry" in feature) {
    if (feature.geometry !== null) {
      const t = isGeometryObject(feature.geometry, true);
      if (t.length) {
        errors = errors.concat(t);
      }
    }
  } else {
    errors.push('must have a member with the name "geometry"');
  }

  // run custom checks
  errors = errors.concat(_customDefinitions("Feature", feature));
  return _done(trace, errors);
};

/**
 * Determines if an object is a valid Feature Collection
 * @method isFeatureCollection
 * @param featureCollection {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isFeatureCollection = (featureCollection, trace = false) => {
  if (!isObject(featureCollection)) {
    return _done(trace, ["must be a JSON Object"]);
  }

  let errors = [];
  if ("bbox" in featureCollection) {
    const t = isBbox(featureCollection.bbox, true);
    if (t.length) {
      errors = t;
    }
  }

  if ("type" in featureCollection) {
    if (featureCollection.type !== "FeatureCollection") {
      errors.push('type must be "FeatureCollection"');
    }
  } else {
    errors.push('must have a member with the name "type"');
  }

  if ("features" in featureCollection) {
    if (Array.isArray(featureCollection.features)) {
      featureCollection.features.forEach((val, index) => {
        const t = isFeature(val, true);
        if (t.length) {
          // modify the err msg from 'isPosition' to note the element number
          t[0] = "at " + index + ": ".concat(t[0]);
          // build a list of invalide positions
          errors = errors.concat(t);
        }
      });
    } else {
      errors.push('"Features" must be an array');
    }
  } else {
    errors.push('must have a member with the name "Features"');
  }

  // run custom checks
  errors = errors.concat(
    _customDefinitions("FeatureCollection", featureCollection)
  );
  return _done(trace, errors);
};

/**
 * Determines if an object is a valid Bounding Box
 * @method isBbox
 * @param bbox {Object}
 * @param [trace] {Boolean}
 * @return {Boolean}
 */
export const isBbox = (bbox, trace = false) => {
  let errors = [];
  if (Array.isArray(bbox)) {
    if (bbox.length % 2 !== 0) {
      errors.push("bbox, must be a 2*n array");
    }
  } else {
    errors.push("bbox must be an array");
  }

  // run custom checks
  errors = errors.concat(_customDefinitions("Bbox", bbox));
  return _done(trace, errors);
};

const nonGeoTypes = {
  Feature: isFeature,
  FeatureCollection: isFeatureCollection,
};

const geoTypes = {
  Point: isPoint,
  MultiPoint: isMultiPoint,
  LineString: isLineString,
  MultiLineString: isMultiLineString,
  Polygon: isPolygon,
  MultiPolygon: isMultiPolygon,
  GeometryCollection: isGeometryCollection,
};

export const allTypes = {
  Feature: isFeature,
  FeatureCollection: isFeatureCollection,
  Point: isPoint,
  MultiPoint: isMultiPoint,
  LineString: isLineString,
  MultiLineString: isMultiLineString,
  Polygon: isPolygon,
  MultiPolygon: isMultiPolygon,
  GeometryCollection: isGeometryCollection,
  Bbox: isBbox,
  Position: isPosition,
  GeoJSON: isGeoJSONObject,
  GeometryObject: isGeometryObject,
};

export default isGeoJSONObject;
