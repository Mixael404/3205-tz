import { configureStore, type AnyAction, type ThunkDispatch } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

export const makeStore = (preloadedState: object | null = null) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    ...(preloadedState ? { preloadedState } : {}),
  });
};

export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];

export type RootState = ReturnType<typeof rootReducer>;

export type TypedDispatch = ThunkDispatch<RootState, never, AnyAction>;
