import type { Item } from "../store/types";

const generateGeoJSON = (features: Item[]) => ({
  type: "FeatureCollection",
  features: features.map((item) => {
    return {
      type: "Feature",
      properties: item.properties,
      geometry: {
        type: item.geometry.type,
        coordinates: item.geometry.coordinates,
      },
    };
  }),
});

export default generateGeoJSON;
