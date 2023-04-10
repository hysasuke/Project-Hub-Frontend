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
  const [socket, setSocket] = useState<WebSocket | null>();
  const [serverAlive, setServerAlive] = useState<boolean>(true);
  const serverAliveCheckInterval = useRef<any>(null);

  const serverHealthCheck = async () => {
    try {
      let host = window.location.origin;
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
