import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useEffect } from "react";

import Layout from "./components/layout/Layout";
import initializeMap from "./helpers/initializeMap";

export function App() {
  useEffect(() => {
    // Initialize the map 2 seconds later to avoid the map to be empty
    setTimeout(() => {
      initializeMap({
        url: "https://images.rmscloud.com/rmsoimages/14986/RMSWin/RMSOnlineImages/00000006.png",
      });
    }, 100);
  }, []);
  return <Layout />;
}
