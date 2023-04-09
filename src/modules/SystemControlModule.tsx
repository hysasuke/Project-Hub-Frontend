let host = process.env.NEXT_PUBLIC_HOST;
import { _fetch as fetch } from "../utils/fetch";
if (typeof window !== "undefined") {
  // You now have access to `window`
  host = process.env.NEXT_PUBLIC_HOST || window.location.origin;
}
export async function shutdown() {
  const data = await fetch(`${host}/system/shutdown`, {
    method: "GET"
  });
  return data;
}

export async function restart() {
  const data = await fetch(`${host}/system/restart`, {
    method: "GET"
  });
  return data;
}

export async function setVolume(volume: number) {
  const data = await fetch(`${host}/system/volume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ volume, muted: false })
  });
  return data;
}

export async function mute() {
  const data = await fetch(`${host}/system/volume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ volume: 0, muted: true })
  });
  return data;
}

export async function getVolume() {
  const data = await fetch(`${host}/system/volume`, {
    method: "GET"
  });
  return data;
}
