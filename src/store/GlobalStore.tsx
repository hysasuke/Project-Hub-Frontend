import React from "react";

type GlobalStoreContextType = {
  globalStore: any;
  dispatch: (store: any) => void;
};

export const GlobalStoreContext = React.createContext<GlobalStoreContextType>({
  globalStore: {},
  dispatch: (store: any) => {}
});
