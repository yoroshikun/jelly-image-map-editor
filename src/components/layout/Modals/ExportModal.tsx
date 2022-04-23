import { useCallback, useMemo } from "react";
import generateGeoJSON from "../../../helpers/generateGeoJSON";
import { list } from "../../../store/main";

const ExportModal = () => {
  const itemList = list((state) => state.list);

  const geoJSON = useMemo(() => generateGeoJSON(itemList), [itemList]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([JSON.stringify(geoJSON)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "geojson.json");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [itemList]);

  return (
    <>
      <input type="checkbox" id="export-modal" className="modal-toggle" />
      <label htmlFor="export-modal" className="modal cursor-pointer">
        <label className="modal-box w-11/12 max-w-3xl relative" htmlFor="">
          <label
            htmlFor="export-modal"
            className="btn btn-sm btn-circle absolute right-4 top-4"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-4">Export geoJSON</h3>
          <pre className="bg-neutral rounded-lg p-4 max-h-48 overflow-y-scroll select-all text-white">
            <code>{JSON.stringify(geoJSON, null, 2)}</code>
          </pre>
          <div className="modal-action">
            <button className="btn" onClick={handleDownload}>
              Download
            </button>
          </div>
        </label>
      </label>
    </>
  );
};

export default ExportModal;
