// Series of helpers that connect native map js to store
import { Map, geoJSON, Layer, LatLng } from "leaflet";
import { GeoJsonObject } from "geojson";

import type { Item, GeomanExtraLayerProps } from "../store/types";
import { useListStore, selectListItem, useMapStore } from "../store/main";

// Helpers

// Recursive function to covert latlng objects to arrays
// Input: L.LatLng[][][] | L.LatLng[][] | L.LatLng[]
// Output: number[][][] | number[][] | number[]
const latlngObjectToArray = (
  latlngs: LatLng[][][] | LatLng[][] | LatLng[] | LatLng
): any => {
  if (Array.isArray(latlngs)) {
    return latlngs.map((latlng) => latlngObjectToArray(latlng));
  }

  return [latlngs.lng, latlngs.lat];
};

const makeItem = (shape: string, layer: Layer & GeomanExtraLayerProps) => {
  const newItem: Partial<Item> = {
    id: layer.feature?.properties?.id || layer._leaflet_id,
    properties: {},
    path: layer._path,
  };

  switch (shape) {
    case "Rectangle":
    case "Polygon":
    case "MultiPolygon":
      newItem.geometry = {
        type: shape,
        coordinates: latlngObjectToArray(layer._latlngs!),
      };
      break;
    case "Circle":
      newItem.geometry = {
        type: shape,
        coordinates: latlngObjectToArray(layer._latlng!),
      };
      newItem.properties = { radius: layer._mRadius };
      break;
    case "CircleMarker":
    case "Marker":
      newItem.geometry = {
        type: shape,
        coordinates: latlngObjectToArray(layer._latlng!),
      };
      break;
    case "Line":
      newItem.geometry = {
        type: shape,
        coordinates: latlngObjectToArray(layer._latlngs!),
      };
  }

  return newItem as Item;
};

// Actions
const addGeoJSON = (map: Map, geoJson: GeoJsonObject) => {
  const geoJSONLayer = geoJSON(geoJson).addTo(map);

  // Get all created shapes and add them to the list
  (geoJSONLayer.getLayers() as (Layer & GeomanExtraLayerProps)[]).forEach(
    (layer) => {
      const item = makeItem(layer.feature?.geometry.type || "Polygon", layer);

      // Merge in properties from the layer
      item.properties = { ...item.properties, ...layer.feature?.properties };

      useListStore.setState({ list: [...useListStore.getState().list, item] });
      addListeners(map, layer);
    }
  );

  useMapStore.setState({ tainted: true });
};

// Listeners
const addListeners = (map: Map, layer: Layer & GeomanExtraLayerProps) => {
  layer.on("click", () => {
    selectListItem(layer.feature?.properties?.id || layer._leaflet_id);
  });

  layer.on(
    "pm:update",
    ({ layer }: { layer: Layer & GeomanExtraLayerProps }) => {
      handlePMEdit(layer.pm._shape || "Polygon", layer);
      selectListItem(layer.feature?.properties?.id || layer._leaflet_id);
    }
  );

  layer.on(
    "pm:dragend",
    ({ layer }: { layer: Layer & GeomanExtraLayerProps }) => {
      handlePMEdit(layer.pm._shape || "Polygon", layer);
      selectListItem(layer.feature?.properties?.id || layer._leaflet_id);
    }
  );

  // Cut is special and creates a completely new layer item and id
  layer.on(
    "pm:cut",
    ({ layer: newLayer }: { layer: Layer & GeomanExtraLayerProps }) => {
      const prevId = layer.feature?.properties?.id || layer._leaflet_id;
      handlePMEdit(layer.pm._shape || "Polygon", newLayer, prevId);
      selectListItem(newLayer.feature?.properties?.id || newLayer._leaflet_id);
      addListeners(map, newLayer);
    }
  );

  layer.on(
    "pm:remove",
    ({ layer }: { layer: Layer & GeomanExtraLayerProps }) => {
      useListStore.setState({
        list: useListStore
          .getState()
          .list.filter(
            (item) =>
              item.id !== (layer.feature?.properties?.id || layer._leaflet_id)
          ),
        tainted: true,
      });
    }
  );

  layer.on(
    "pm:rotateend",
    ({ layer }: { layer: Layer & GeomanExtraLayerProps }) => {
      handlePMEdit(layer.pm._shape || "Polygon", layer);
      selectListItem(layer.feature?.properties?.id || layer._leaflet_id);
    }
  );
};

// Handlers
const handlePMCreate = (
  shape: string,
  layer: Layer & GeomanExtraLayerProps
) => {
  const newItem = makeItem(shape, layer);

  useListStore.setState({
    list: [...useListStore.getState().list, newItem],
    tainted: true,
  });
};

const handlePMEdit = (
  shape: string,
  layer: Layer & GeomanExtraLayerProps,
  prevId?: number
) => {
  const newItem = makeItem(shape, layer);

  // PrevId override (this can be condensed)
  if (prevId) {
    useListStore.setState({
      list: useListStore.getState().list.map((item) =>
        item.id === prevId
          ? {
              ...newItem,
              properties: { ...item.properties, ...newItem.properties },
            }
          : item
      ),
      tainted: true,
    });
  } else {
    // Replace item in list
    useListStore.setState({
      list: useListStore.getState().list.map((item) =>
        item.id === newItem.id
          ? {
              ...newItem,
              properties: { ...item.properties, ...newItem.properties },
            }
          : item
      ),
      tainted: true,
    });
  }
};

export { handlePMCreate, addGeoJSON, addListeners };
