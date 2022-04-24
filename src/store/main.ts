// Main store for app
import create from "zustand";
import generateGeoJSON from "../helpers/generateGeoJSON";

import type { Item, MapOptions } from "./types";

interface ListStore {
  list: Item[];
  selected: null | number;
  tainted: boolean;
  addItem: (item: Item) => void;
  removeItem: (id: number) => void;
  selectItem: (id: number) => void;
  updateItem: (id: number, newItem: Item) => void;
  saveListStore: () => void;
}

interface MapStore {
  initialized: boolean;
  tainted: boolean;
  options: MapOptions;
  setInitialized: (initialized: boolean) => void;
  saveMapStore: () => void;
}

// Define stores
const useListStore = create<ListStore>((set) => ({
  list: [],
  selected: null,
  tainted: false,
  setList: (list: Item[]) => set({ list }),
  addItem: (item: Item) =>
    set((state) => ({
      list: [...state.list, item],
      tainted: true,
    })),
  removeItem: (id: number) =>
    set((state) => ({
      list: state.list.filter((item) => item.id !== id),
      tainted: true,
    })),
  selectItem: (id: number) =>
    set(() => ({
      selected: id,
    })),
  updateItem: (id: number, newItem: Item) =>
    set((state) => ({
      list: state.list.map((item) => (item.id === id ? newItem : item)),
      tainted: true,
    })),
  saveListStore: () =>
    set((state) => {
      // Attempt to save map state to localStorage
      try {
        localStorage.setItem(
          "list-store",
          JSON.stringify(generateGeoJSON(state.list))
        );
      } catch (err) {
        console.error(err);
      }
      return { tainted: false };
    }),
}));

const useMapStore = create<MapStore>((set) => ({
  initialized: false,
  tainted: false,
  options: {},
  setInitialized: (initialized: boolean) => set((state) => ({ initialized })),
  saveMapStore: () =>
    set((state) => {
      // Attempt to save map state to localStorage
      try {
        localStorage.setItem("map-options", JSON.stringify(state.options));
      } catch (err) {
        console.error(err);
      }
      return { tainted: false };
    }),
}));

const selectListItem = (id: number) => {
  // Get previous selected item
  const prevSelectedId = useListStore.getState().selected;
  const prevSelectedItem = useListStore
    .getState()
    .list.find((item) => item.id === prevSelectedId);
  // Get new item to select
  const item = useListStore.getState().list.find((item) => item.id === id);

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
  useListStore.setState({
    selected: id,
  });
};

export { useListStore, selectListItem, useMapStore };
