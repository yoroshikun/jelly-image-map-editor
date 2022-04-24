import ThemeChanger from "./../partials/ThemeChanger";
import { useMapStore, useListStore } from "../../store/main";

const Header = () => {
  const mapTainted = useMapStore((state) => state.tainted);
  const listTainted = useListStore((state) => state.tainted);
  const saveMapStore = useMapStore((state) => state.saveMapStore);
  const saveListStore = useListStore((state) => state.saveListStore);

  return (
    <header className="header items-center p-4 bg-neutral text-neutral-content">
      <div className="flex justify-between w-full items-center">
        <div className="flex-1 font-bold text-xl">IMEditor</div>
        {mapTainted ? (
          <div
            className="tooltip tooltip-warning tooltip-bottom z-[1000]"
            data-tip="You have unsaved map options, click to save locally now"
            onClick={() => saveMapStore()}
          >
            <button className="btn btn-circle btn-sm btn-warning mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
          </div>
        ) : (
          <div
            className="tooltip tooltip-success tooltip-bottom mr-4 z-[1000]"
            data-tip="All map options have been saved locally, click to purge local storage"
            onClick={() => localStorage.removeItem("map-options")}
          >
            <button className="btn btn-circle btn-sm btn-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        )}
        {listTainted ? (
          <div
            className="tooltip tooltip-warning tooltip-bottom mr-4 z-[1000]"
            data-tip="You have unsaved list modifications, click to save locally now"
            onClick={() => saveListStore()}
          >
            <button className="btn btn-circle btn-sm btn-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
          </div>
        ) : (
          <div
            className="tooltip tooltip-success tooltip-bottom mr-4 z-[1000]"
            data-tip="All list changes have been saved locally, click to purge local storage"
            onClick={() => localStorage.removeItem("list-store")}
          >
            <button className="btn btn-circle btn-sm btn-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        )}
        <button className="btn btn-square btn-ghost">
          <ThemeChanger />
        </button>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-square btn-ghost">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7 7C5.34315 7 4 8.34315 4 10C4 11.6569 5.34315 13 7 13C8.65685 13 10 11.6569 10 10C10 8.34315 8.65685 7 7 7ZM6 10C6 9.44772 6.44772 9 7 9C7.55228 9 8 9.44772 8 10C8 10.5523 7.55228 11 7 11C6.44772 11 6 10.5523 6 10Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3 3C1.34315 3 0 4.34315 0 6V18C0 19.6569 1.34315 21 3 21H21C22.6569 21 24 19.6569 24 18V6C24 4.34315 22.6569 3 21 3H3ZM21 5H3C2.44772 5 2 5.44772 2 6V18C2 18.5523 2.44772 19 3 19H7.31374L14.1924 12.1214C15.364 10.9498 17.2635 10.9498 18.435 12.1214L22 15.6863V6C22 5.44772 21.5523 5 21 5ZM21 19H10.1422L15.6066 13.5356C15.9971 13.145 16.6303 13.145 17.0208 13.5356L21.907 18.4217C21.7479 18.7633 21.4016 19 21 19Z"
                  fill="currentColor"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              style={{ zIndex: 1000 }}
            >
              <li>
                <label
                  htmlFor="manage-image-modal"
                  className="text-neutral dark:text-white"
                >
                  Manage Image
                </label>
              </li>
              <li>
                <label
                  htmlFor="manage-map-modal"
                  className="text-neutral dark:text-white"
                >
                  Manage Map
                </label>
              </li>
            </ul>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  d="M16.9498 5.96781L15.5356 7.38203L13 4.84646V17.0421H11V4.84653L8.46451 7.38203L7.05029 5.96781L12 1.01807L16.9498 5.96781Z"
                  fill="currentColor"
                />
                <path
                  d="M5 20.9819V10.9819H9V8.98193H3V22.9819H21V8.98193H15V10.9819H19V20.9819H5Z"
                  fill="currentColor"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              style={{ zIndex: 1000 }}
            >
              <li>
                <label
                  htmlFor="export-modal"
                  className="text-neutral dark:text-white"
                >
                  Export GeoJSON
                </label>
              </li>
              <li>
                <label
                  htmlFor="import-modal"
                  className="text-neutral dark:text-white"
                >
                  Import GeoJSON
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
