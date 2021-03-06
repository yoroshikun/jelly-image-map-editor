import { useListStore } from "../../store/main";
import ListItem from "./ListItem";

const List = () => {
  const itemList = useListStore((state) => state.list);
  const selected = useListStore((state) => state.selected);
  const updateItem = useListStore((state) => state.updateItem);

  if (itemList && itemList.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="mt-2 text-center">
          <p>
            Looks like you have no items,
            <br />
            try creating one with the map!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-3 gap-4 p-4">
      {itemList.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          selected={item.id === selected}
          updateItem={updateItem}
        />
      ))}
    </div>
  );
};

export default List;
