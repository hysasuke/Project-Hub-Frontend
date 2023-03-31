import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, useEffect, useRef } from "react";

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
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [serverAlive, setServerAlive] = useState<boolean>(true);
  const serverAliveCheckTimeout = useRef<any>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      let wsHost = "ws://" + window.location.hostname + ":8080";
      if (wsHost) {
        let _socket = new WebSocket(wsHost);
        setSocket(_socket);
      }
    }
  }, []);

  useEffect(() => {
    // Set up a timer to check if the server is alive
    serverAliveCheckTimeout.current = setTimeout(() => {
      setServerAlive(false);
    }, 6000);
    if (socket) {
      socket.addEventListener("open", (event) => {
        if (socket) {
          socket.addEventListener("message", (event) => {
            // If get server's ping, set server alive to true
            if (event.data === "ping") {
              setServerAlive(true);
              // Clear the timer
              clearTimeout(serverAliveCheckTimeout.current);
              // Set up a new timer
              serverAliveCheckTimeout.current = setTimeout(() => {
                setServerAlive(false);
              }, 6000);
            } else {
              setSocketMessage(JSON.parse(event.data));
            }
          });
        }
      });
    }
  }, [socket]);
  return (
    <NextThemesProvider
      defaultTheme="dark"
      attribute="class"
      value={{ light: lightTheme.className, dark: darkTheme.className }}
    >
      <NextUIProvider>
        <Component
          {...pageProps}
          socketMessage={socketMessage}
          socket={socket ? socket : null}
          serverAlive={serverAlive}
        />
      </NextUIProvider>
    </NextThemesProvider>
  );
}
