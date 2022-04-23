import { useCallback } from "react";

import { list } from "../../store/main";
import ThemeChanger from "./../partials/ThemeChanger";
import generateGeoJSON from "../../helpers/generateGeoJSON";

const Header = () => {
  const itemList = list((state) => state.list);

  const alertGeoJson = useCallback(() => {
    alert(JSON.stringify(generateGeoJSON(itemList)));
  }, [itemList]);

  return (
    <header className="header items-center p-4 bg-neutral text-neutral-content">
      <div className="flex justify-between w-full items-center">
        <div className="flex-1 font-bold text-xl">IMEditor</div>
        <button className="btn btn-square btn-ghost">
          <ThemeChanger />
        </button>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
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
