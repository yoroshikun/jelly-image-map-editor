// A helper to deal with initializing the image map

import { Map, map, CRS, LatLngBounds, imageOverlay, Layer } from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import parkMapUrl from "./park-map.jpg";
import { addGeoJSON, addListeners, handlePMCreate } from "./mapConnector";
import type { GeomanExtraLayerProps, MapOptions } from "../store/types";
import { useMapStore } from "../store/main";

let mapRef: Map | null = null;

const getImageDimensions = (url: string) =>
  new Promise<{ h: number; w: number }>((resolve, reject) => {
    let w = 0,
      h = 0;
    const tempImgElement = document.createElement("img");
    tempImgElement.src = url;
    tempImgElement.onload = () => {
      w = tempImgElement.naturalWidth;
      h = tempImgElement.naturalHeight;
      resolve({ w, h });
    };
    tempImgElement.onerror = () => {
      reject(new Error("Could not load image"));
    };
  });

const initializeMap = async ({
  url,
  minZoom,
  maxZoom,
  zoom,
  center,
  height,
  width,
}: MapOptions) => {
  // Read localstorage for map settings
  const mapSettings = JSON.parse(
    localStorage.getItem("map-options") || "{}"
  ) as MapOptions;
  // Merge defaults
  if (!url) url = mapSettings.url || parkMapUrl;
  if (!minZoom) minZoom = mapSettings.minZoom || -1;
  if (!maxZoom) maxZoom = mapSettings.maxZoom || 3;
  if (!zoom) zoom = mapSettings.zoom || -1;

  const mapElement = document.getElementById("map")! as HTMLDivElement;
  // Remove previous map if there was one
  if (mapRef !== null && mapElement) {
    mapRef.off();
    mapRef.remove();
    mapRef.invalidateSize();
    mapRef = null;

    // remove the map and recreate
    mapElement.innerHTML = "";

    // Remove items from list
  }
  // Get the img height and width to calculate the map size and position
  let { w, h } = await getImageDimensions(url);

  // Override the height and width if they are provided
  if (mapSettings.height) h = mapSettings.height;
  if (mapSettings.width) w = mapSettings.width;
  if (height) h = height;
  if (width) w = width;

  // Create the map
  mapRef = map(mapElement, {
    crs: CRS.Simple,
    minZoom,
    maxZoom,
    zoom,
    center: center || mapSettings.center || [h, w],
  });

  // Add the image to the map
  const southWest = mapRef.unproject([0, h], 0);
  const northEast = mapRef.unproject([w, 0], 0);
  const bounds = new LatLngBounds(southWest, northEast);

  imageOverlay(url, bounds).addTo(mapRef);

  mapRef.setMaxBounds(bounds);

  mapRef.pm.addControls();

  // Create a listener for creations
  mapRef.on("pm:create", ({ shape, layer }) => {
    handlePMCreate(shape, layer as Layer & GeomanExtraLayerProps);
    addListeners(mapRef!, layer as Layer & GeomanExtraLayerProps);
  });

  // Check and load locally saved geoJSON
  const geoJSON = localStorage.getItem("list-store");
  if (geoJSON) {
    addGeoJSON(mapRef, JSON.parse(geoJSON));
  }

  // Let state know that the map has been initialized
  useMapStore.setState({ initialized: true, tainted: false });

  return mapRef;
};

export default initializeMap;
