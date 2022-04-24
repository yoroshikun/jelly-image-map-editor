import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import initializeMap from "../../../helpers/initializeMap";
import { useMapStore, useListStore } from "../../../store/main";
import { MapOptions } from "../../../store/types";

// TODO: Apply validation to the image url https://stackoverflow.com/questions/32222786/file-upload-check-if-valid-image

const ManageImageModal = () => {
  const [preppedImageURL, setPreppedImageURL] = useState<string | null>(() => {
    const mapOptions = localStorage.getItem("map-options");
    if (mapOptions) {
      const mapOptionsJSON = JSON.parse(mapOptions) as MapOptions;
      return mapOptionsJSON.url || null;
    }
    return null;
  });
  const [error, setError] = useState("");
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setError("This file type is not supported, please use a image/*");
      return;
    }

    // Make a URL from the file
    const url = URL.createObjectURL(acceptedFiles[0]);

    setPreppedImageURL(url);
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      maxFiles: 1,
      onDrop,
      accept: "image/*",
    });

  const handleUpdateImage = useCallback(async () => {
    try {
      if (preppedImageURL) {
        // Before re-initializing the map, remove the old list data as per warning
        useListStore.setState({ list: [], selected: null, tainted: true });
        localStorage.removeItem("list-store");

        await initializeMap({ url: preppedImageURL });

        // We only want to set the url setting if not a blob,
        // blobs are removed when page reloads as by the revoke object url
        if (!preppedImageURL.startsWith("blob:")) {
          useMapStore.setState({
            options: {
              ...useMapStore.getState().options,
              url: preppedImageURL,
            },
            tainted: true,
          });
        }
      }
    } catch (error: any) {
      setError(error.message);
    }
  }, [preppedImageURL]);

  // Revoke url to prevent memory leak
  useEffect(() => {
    if (preppedImageURL && preppedImageURL.startsWith("blob:")) {
      URL.revokeObjectURL(preppedImageURL);
    }
  }, [preppedImageURL]);

  return (
    <>
      <input type="checkbox" id="manage-image-modal" className="modal-toggle" />
      <label
        htmlFor="manage-image-modal"
        className="modal cursor-pointer z-[1000]"
      >
        <label className="modal-box w-11/12 max-w-3xl relative" htmlFor="">
          <label
            htmlFor="manage-image-modal"
            className="btn btn-sm btn-circle absolute right-4 top-4"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Manage Image</h3>
          <p className="text-sm text-grey-300 my-4">
            Warning: By updating your image your geoJSON will be removed, please
            export your geoJSON to avoid data loss.
          </p>
          <input
            type="text"
            placeholder="URL"
            className="input input-bordered w-full mb-4"
            disabled={preppedImageURL?.startsWith("blob:")}
            value={preppedImageURL || ""}
            onChange={(e) => setPreppedImageURL(e.target.value)}
          ></input>
          {preppedImageURL &&
          // This can and will be replaced with an image check in comment above
          (preppedImageURL.startsWith("blob:") ||
            preppedImageURL.endsWith(".png") ||
            preppedImageURL.endsWith(".jpg") ||
            preppedImageURL.endsWith(".jpeg") ||
            preppedImageURL.endsWith(".avif") ||
            preppedImageURL.endsWith(".webp") ||
            preppedImageURL.endsWith(".svg")) ? (
            <div className="w-2/3 mx-auto">
              <img src={preppedImageURL} className="w-full " />
            </div>
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
            {preppedImageURL && (
              <button
                className="btn btn-error"
                onClick={() => setPreppedImageURL(null)}
              >
                Clear
              </button>
            )}
            <button
              className="btn"
              disabled={!preppedImageURL}
              onClick={handleUpdateImage}
            >
              Update
            </button>
          </div>
        </label>
      </label>
    </>
  );
};

export default ManageImageModal;
