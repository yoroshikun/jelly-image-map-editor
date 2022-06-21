import { GeoJsonObject } from "geojson";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMapStore } from "../../../store/main";
import initializeMap from "../../../helpers/initializeMap";
import { addGeoJSON } from "../../../helpers/mapConnector";
// @ts-ignore
import geoJSONValidation from "../../../helpers/validateGeoJSON";

const ImportModal = () => {
  const [preppedGeoJSON, setPreppedGeoJSON] = useState<GeoJsonObject | null>(
    null
  );
  const [error, setError] = useState("");
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setError("This file type is not supported, please use a .json");
      return;
    }
    // Read contents of file and save to state
    const reader = new FileReader();

    // Read and decode json
    reader.onabort = () => setError("File reading was aborted");
    reader.onerror = () => setError("File reading has failed");
    reader.onload = (event) => {
      try {
        const json = reader.result && JSON.parse(reader.result as string);
        const trace = geoJSONValidation(json, true);

        if (trace.length !== 0) {
          throw new Error(trace.join("\n"));
        }

        setPreppedGeoJSON(json);
        setError("");
      } catch (e: any) {
        setError("An error ocurred when parsing the geoJSON: " + e.message);
      }
    };

    reader.readAsText(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      maxFiles: 1,
      onDrop,
      accept: "application/json",
    });

  const handleImport = useCallback(async () => {
    try {
      if (preppedGeoJSON) {
        const options = useMapStore.getState().options;
        const map = await initializeMap(options);
        addGeoJSON(map, preppedGeoJSON);
      }
    } catch (error: any) {
      setError(error.message);
    }
  }, [preppedGeoJSON]);

  return (
    <>
      <input type="checkbox" id="import-modal" className="modal-toggle" />
      <label htmlFor="import-modal" className="modal cursor-pointer z-[1000]">
        <label className="modal-box w-11/12 max-w-3xl relative" htmlFor="">
          <label
            htmlFor="import-modal"
            className="btn btn-sm btn-circle absolute right-4 top-4"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-4">Import geoJSON</h3>
          {preppedGeoJSON ? (
            <pre className="bg-neutral rounded-lg p-4 max-h-48 overflow-y-scroll select-all text-white">
              <code>{JSON.stringify(preppedGeoJSON, null, 2)}</code>
            </pre>
          ) : (
            <div
              className={`flex items-center justify-center h-48 dark:bg-neutral rounded-xl border-4 border-dashed hover:border-accent transition-all duration-200 
              ${isDragActive ? "border-primary" : "border-neutral-500"}
              ${isDragReject ? "border-error" : ""}`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-lg font-bold text-center">
                  Drop the Image here ...
                </p>
              ) : (
                <p className="text-lg font-bold text-center">
                  Drag 'n' drop your Image, <br /> or click to select an image
                </p>
              )}
            </div>
          )}
          {error && (
            <div className="alert alert-error shadow-lg mt-4">
              <div className="max-h-48 overflow-y-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          <div className="modal-action">
            {preppedGeoJSON && (
              <button
                className="btn btn-error"
                onClick={() => setPreppedGeoJSON(null)}
              >
                Clear
              </button>
            )}
            <button
              className="btn"
              disabled={!preppedGeoJSON}
              onClick={handleImport}
            >
              Import
            </button>
          </div>
        </label>
      </label>
    </>
  );
};

export default ImportModal;
