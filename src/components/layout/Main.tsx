import List from "../editor/List";

const Main = () => (
  <div className="flex flex-col md:flex-row h-auto md:h-full">
    <div className="w-full md:w-3/5 h-96 md:h-full bg-neutral-focus">
      <div id="map" className="w-full h-full"></div>
    </div>
    <div className="flex-1 h-full overflow-y-scroll">
      <List />
    </div>
  </div>
);

export default Main;
