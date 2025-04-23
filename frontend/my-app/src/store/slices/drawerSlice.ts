// store/slices/drawerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DrawerState {
  isOpen: boolean;
  title: string;
  contentType: string;
  contentProps?: Record<string, any>;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  isOverlayClose?: boolean;
}

const initialState: DrawerState = {
  isOpen: false,
  title: "",
  contentType: "",
  contentProps: {},
  size: "md",
  isOverlayClose: true,
};

export const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    openDrawer: (state, action: PayloadAction<Omit<DrawerState, "isOpen">>) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.contentType = action.payload.contentType;
      state.contentProps = action.payload.contentProps || {};
      state.size = action.payload.size || "md";
      state.isOverlayClose =
        action.payload.isOverlayClose !== undefined
          ? action.payload.isOverlayClose
          : true;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      state.contentType = "";
      state.contentProps = {};
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
