// Main store for app
import create from "zustand";

import type { Item } from "./types";

// Define stores
const list = create<{
  list: Item[];
  selected: null | number;
  updateItem: (id: number, newItem: Item) => any;
}>((set) => ({
  list: [],
  selected: null,
  setList: (list: Item[]) => set({ list }),
  addItemToList: (item: Item) =>
    set((state) => ({
      list: [...state.list, item],
    })),
  removeItemFromList: (id: number) =>
    set((state) => ({
      list: state.list.filter((item) => item.id !== id),
    })),
  setSelected: (id: number) =>
    set(() => ({
      selected: id,
    })),
  updateItem: (id: number, newItem: Item) =>
    set((state) => ({
      list: state.list.map((item) => (item.id === id ? newItem : item)),
    })),
}));

const mapStore = create<{
  mapInitialized: boolean;
  setMapInitialized: (mapInitialized: boolean) => void;
}>((set) => ({
  mapInitialized: false,
  setMapInitialized: (mapInitialized: boolean) =>
    set((state) => ({ mapInitialized })),
}));

const selectListItem = (id: number) => {
  // Get previous selected item
  const prevSelectedId = list.getState().selected;
  const prevSelectedItem = list
    .getState()
    .list.find((item) => item.id === prevSelectedId);
  // Get new item to select
  const item = list.getState().list.find((item) => item.id === id);

  if (prevSelectedId === id) {
    return;
  }

  // Remove highlight on previous selected item
  if (prevSelectedItem && prevSelectedItem.path) {
    prevSelectedItem.path.classList.remove("fill-primary");
    prevSelectedItem.path.classList.remove("stroke-primary");
  }

  // Add highlight on new selected item
  if (item && item.path) {
    item.path.classList.add("fill-primary");
    item.path.classList.add("stroke-primary");
  }

  // Set new selected item
  list.setState({
    selected: id,
  });
};

export { list, selectListItem, mapStore };
