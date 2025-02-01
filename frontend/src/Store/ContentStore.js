import { create } from "zustand";

const useContentStore = create((set) => ({
  contentType: "movie",
  setContentType: (type) => set({ contentType: type }),
}));

export default useContentStore;
