import type { AppDispatch, RootState } from "../../store/store";

export type StoreLike = {
  getState: () => RootState;
  dispatch: AppDispatch;
};
