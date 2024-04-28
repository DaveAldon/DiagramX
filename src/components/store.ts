import { create } from "zustand";
import { type XYPosition } from "@xyflow/react";

// This global state is needed because we need transfer the
// control points that have been added while drawing the connection
// to the new edge that is created onConnect
interface AppState {
  connectionLinePath: XYPosition[];
  setConnectionLinePath: (connectionLinePath: XYPosition[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  connectionLinePath: [],
  setConnectionLinePath: (connectionLinePath: XYPosition[]) => {
    set({ connectionLinePath });
  },
}));
