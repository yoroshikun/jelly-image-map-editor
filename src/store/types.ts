import { Feature } from "geojson";

export interface Item {
  id: number;
  properties: {
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
  path: HTMLElement;
}

export interface GeomanExtraLayerProps {
  _leaflet_id: number;
  _drawnByGeoman: true;
  _latlng?: L.LatLng;
  _latlngs?: L.LatLng[][] | L.LatLng[];
  _mRadius?: number;
  _path?: HTMLElement;
  feature?: Feature;
  pm: {
    _shape?: string;
  };
  // TODO: Add all other properties
}

export interface MapOptions {
  url?: string;
  minZoom?: number;
  maxZoom?: number;
  zoom?: number;
  center?: [number, number];
  height?: number;
  width?: number;
}
