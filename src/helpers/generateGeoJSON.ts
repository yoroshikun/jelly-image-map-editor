import type { Item } from "../store/types";

// Lossy conversion of geometry types for GeoJSON
const typeToGeoJSONType = (type: string) => {
  switch (type) {
    case "Rectangle":
      return "Polygon";
    case "Circle":
      return "Point";
    case "Marker":
      return "Point";
    case "CircleMarker":
      return "Point";
    case "Line":
      return "LineString";
    default:
      return type;
  }
};

const generateGeoJSON = (features: Item[]) => ({
  type: "FeatureCollection",
  features: features.map((item) => {
    return {
      type: "Feature",
      properties: {
        ...item.properties,
        ...(item.geometry.type === "CircleMarker" ? { radius: 20 } : {}), // This is lossy, but better than loosing it
      },
      geometry: {
        type: typeToGeoJSONType(item.geometry.type),
        coordinates: item.geometry.coordinates,
      },
    };
  }),
});

export default generateGeoJSON;
