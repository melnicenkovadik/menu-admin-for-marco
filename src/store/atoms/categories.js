import { atom } from "recoil";

export const categoriesState = atom({
  key: "categoriesState", // unique ID (with respect to other atoms/selectors)
  default: [],
});
