import { useCallback, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import initializeMap from "../../../helpers/initializeMap";

interface MapOptions {
  height: number;
  width: number;
  zoom: number;
  centerX: number;
  centerY: number;
  maxZoom: number;
  minZoom: number;
}

const ManageMapModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MapOptions>({
    defaultValues: {
      zoom: -1,
      maxZoom: 3,
      minZoom: -1,
    },
  });
  const onSubmit: SubmitHandler<MapOptions> = async (data) => {
    // Reinitialize map with new options
    await initializeMap({
      height: data.height,
      width: data.width,
      zoom: data.zoom,
      ...(data.centerX &&
        data.centerY && { center: [data.centerX, data.centerY] }),
      maxZoom: data.maxZoom,
      minZoom: data.minZoom,
    });

    // TODO: Save map options to local storage
  };

  return (
    <>
      <input type="checkbox" id="manage-map-modal" className="modal-toggle" />
      <label
        htmlFor="manage-map-modal"
        className="modal cursor-pointer z-[1000]"
      >
        <label className="modal-box w-11/12 max-w-3xl relative" htmlFor="">
          <label
            htmlFor="manage-map-modal"
            className="btn btn-sm btn-circle absolute right-4 top-4"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-4">Manage Map Options</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>General</h3>
            <div className="flex flex-col md:flex-row mb-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Initial Zoom</span>
                </label>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="number"
                  {...register("zoom", { required: true })}
                />
              </div>
              <div className="form-control flex-1 md:mx-4">
                <label className="label">
                  <span className="label-text">Max Zoom</span>
                </label>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="number"
                  {...register("maxZoom", { required: true })}
                />
              </div>
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Max Zoom</span>
                </label>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="number"
                  {...register("minZoom", { required: true })}
                />
              </div>
            </div>

            <h3 className="text-md font-bold">Experimental</h3>
            <p className="text-sm text-grey-300">
              Editing these options may result in unexpected results, only edit
              if you "know what you are doing"
            </p>
            <div className="flex flex-col md:flex-row mb-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Height</span>
                </label>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="number"
                  {...register("height")}
                />
              </div>
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Width</span>
                </label>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="number"
                  {...register("width")}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row mb-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Center X</span>
                </label>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="number"
                  {...register("centerX")}
                />
              </div>
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Center Y</span>
                </label>
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="number"
                  {...register("centerY")}
                />
              </div>
            </div>
            <div className="modal-action">
              <input type="submit" className="btn" value="Update" />
            </div>
          </form>
        </label>
      </label>
    </>
  );
};

export default ManageMapModal;
