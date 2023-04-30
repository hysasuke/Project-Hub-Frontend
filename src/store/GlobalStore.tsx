import React from "react";

type GlobalStoreContextType = {
  globalStore: any;
  dispatch: (store: any) => void;
};

export const GlobalStoreContext = React.createContext<GlobalStoreContextType>({
  globalStore: {},
  dispatch: (store: any) => {}
});

export const initialGlobalStore = {
  groups: [],
  groupItems: [],
  editing: false,
  loading: false,
  currentGroupID: -1,
  currentGroup: null,
  touchBarComponents: [],
  currentDraggingComponent: null,
  touchBarWidth: 0,
  touchBarFull: false,
  touchBarSettingComponents: [
    {
      type: "clock",
      name: "Clock"
    },
    {
      type: "customText",
      text: "Project Hub",
      name: "Custom Text"
    },
    // {
    //   type: "screenSwitcher",
    //   name: "Screen Switcher"
    // },
    {
      type: "mediaControl",
      name: "Media Control"
    },
    {
      type: "volumeControl",
      name: "Volume Control"
    },
    {
      type: "timer",
      name: "Timer"
    },
    {
      type: "screenShotControl",
      name: "Screenshot Control"
    }
  ]
};
