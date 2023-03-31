let host = process.env.NEXT_PUBLIC_HOST;
if (typeof window !== "undefined") {
  // You now have access to `window`
  host = process.env.NEXT_PUBLIC_HOST || window.location.origin;
}
export async function shutdown() {
  const res = await fetch(`${host}/system/shutdown`, {
    method: "GET"
  });
  const data = await res.json();
  return data;
}

export async function restart() {
  const res = await fetch(`${host}/system/restart`, {
    method: "GET"
  });
  const data = await res.json();
  return data;
}

export async function setVolume(volume: number) {
  const res = await fetch(`${host}/system/volume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ volume, muted: false })
  });
  const data = await res.json();
  return data;
}

export async function mute() {
  const res = await fetch(`${host}/system/volume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ volume: 0, muted: true })
  });
  const data = await res.json();
  return data;
}

export async function getVolume() {
  const res = await fetch(`${host}/system/volume`, {
    method: "GET"
  });
  const data = await res.json();
  return data;
}
