import { useEffect, useState } from "react";
import List from "../editor/List";
import initializeMap from "../../helpers/initializeMap";
import { useMapStore } from "../../store/main";
import { MapOptions } from "../../store/types";

const Main = () => {
  const [loading, setLoading] = useState(true);
  const initialized = useMapStore((state) => state.initialized);

  // Try to initialize the map if at least url exists in map-options local storage
  useEffect(() => {
    const checkInitFromLocal = async () => {
      const mapOptions = localStorage.getItem("map-options");
      if (mapOptions) {
        const mapOptionsJSON = JSON.parse(mapOptions) as MapOptions;
        if (mapOptionsJSON.url) {
          await initializeMap(mapOptionsJSON);
        }
      }
      setLoading(false);
    };

    checkInitFromLocal();
  }, [setLoading]);

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100%-150px)]">
      <div className="w-full md:w-3/5 h-[500px] md:h-full bg-neutral-focus">
        <div
          id="map"
          className="w-full h-full flex items-center justify-center"
        >
          {!initialized && !loading && (
            <h3
              onClick={() => initializeMap({})}
              className="px-4 text-3xl text-center cursor-pointer text-gray-400 hover:text-white transition-all duration-200"
            >
              Your map will appear here, <br />
              Click here to initialize a default one to play with
            </h3>
          )}
          {loading && (
            <h3 className="px-4 text-3xl text-center text-gray-400">
              Loading your previous session, just a moment...
            </h3>
          )}
        </div>
      </div>
      <div className="flex-1 h-full min-h-[300px] overflow-y-scroll">
        <List />
      </div>
    </div>
  );
};

export default Main;
