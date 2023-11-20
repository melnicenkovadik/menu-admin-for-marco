import { selector } from "recoil";
import { categoriesState } from "../atoms/categories";

export const getCategoriesState = selector({
  key: "getCategoriesState", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const categories = get(categoriesState);
    return categories;
  },
});
