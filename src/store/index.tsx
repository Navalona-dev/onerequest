// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import actionTextsReducer from "./slices/ActionTextsState";

export const store = configureStore({
  reducer: {
    actionTexts: actionTextsReducer, // <- le nom DOIT correspondre
  },
});

// Pour avoir le type du state dans tout le projet (bonus, mais utile)
export type RootState = ReturnType<typeof store.getState>;
