import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, useEffect, useRef, createContext } from "react";
import { GlobalStoreContext } from "@/store/GlobalStore";

const lightTheme = createTheme({
  type: "light",
  theme: {}
});

const darkTheme = createTheme({
  type: "dark",
  theme: {}
});

export default function App({ Component, pageProps }: AppProps) {
  const [socketMessage, setSocketMessage]: any = useState(null);
  const [socket, setSocket] = useState<WebSocket | null>();
  const [serverAlive, setServerAlive] = useState<boolean>(true);
  const serverAliveCheckInterval = useRef<any>(null);

  const [globalStore, setGlobalStore] = useState<any>({
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
      }
    ]
  });

  const serverHealthCheck = async () => {
    try {
      let host =
        process.env.NODE_ENV === "production"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_HOST;
      let response = await fetch(host + "/serverHealthCheck");
      if (response.status === 200) {
        setServerAlive(true);
      } else {
        setServerAlive(false);
        clearInterval(serverAliveCheckInterval.current);
      }
    } catch (error) {
      console.log(error);
      setServerAlive(false);
      clearInterval(serverAliveCheckInterval.current);
    }
  };

  useEffect(() => {
    serverHealthCheck();
    // Set server health check interval
    serverAliveCheckInterval.current = setInterval(() => {
      serverHealthCheck();
    }, 5000);

    if (typeof window !== "undefined") {
      let wsHost = "ws://" + window.location.hostname + ":8080";
      if (wsHost) {
        let _socket = new WebSocket(wsHost);
        setSocket(_socket);
      }
    }

    return () => {
      clearInterval(serverAliveCheckInterval.current);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.addEventListener("open", (event) => {
        if (socket) {
          socket.addEventListener("message", (event) => {
            // If get server's ping, set server alive to true
            if (event.data === "ping") {
            } else {
              setSocketMessage(JSON.parse(event.data));
            }
          });
        }
      });
    }
  }, [socket]);

  const dispatch = (newStoreObject: any) => {
    setGlobalStore((prev: any) => ({
      ...prev,
      ...newStoreObject
    }));
  };

  return (
    <NextThemesProvider
      defaultTheme="dark"
      attribute="class"
      value={{ light: lightTheme.className, dark: darkTheme.className }}
    >
      <NextUIProvider>
        <GlobalStoreContext.Provider value={{ globalStore, dispatch }}>
          <Component
            {...pageProps}
            socketMessage={socketMessage}
            socket={socket ? socket : null}
            serverAlive={serverAlive}
          />
        </GlobalStoreContext.Provider>
      </NextUIProvider>
    </NextThemesProvider>
  );
}
