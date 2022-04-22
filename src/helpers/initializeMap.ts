// A helper to deal with initializing the image map

import { Map, map, CRS, LatLngBounds, imageOverlay, Layer } from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import { addListeners, handlePMCreate } from "./mapConnector";
import type { GeomanExtraLayerProps } from "../store/types";

// We always expect this to exist in some form or another
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
}: {
  url: string;
  minZoom?: number;
  maxZoom?: number;
  zoom?: number;
}) => {
  // Merge defaults
  if (!minZoom) minZoom = -1;
  if (!maxZoom) maxZoom = 3;
  if (!zoom) zoom = -1;

  const mapElement = document.getElementById("map")! as HTMLDivElement;
  // Remove previous map if there was one
  if (mapRef !== null && mapElement) {
    // remove the map and recreate
    mapElement.innerHTML = "";
  }
  // Get the img height and width to calculate the map size and position
  const { w, h } = await getImageDimensions(url);

  // Create the map
  mapRef = map(mapElement, {
    crs: CRS.Simple,
    minZoom,
    maxZoom,
    zoom,
    center: [h, w],
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

  return mapRef;
};

export default initializeMap;
