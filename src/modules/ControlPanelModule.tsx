let host = process.env.NEXT_PUBLIC_HOST;
if (typeof window !== "undefined") {
  // You now have access to `window`
  host = process.env.NEXT_PUBLIC_HOST || window.location.origin;
}
export async function getGroups() {
  const res = await fetch(`${host}/group`);
  const groups = await res.json();
  return groups;
}

export async function addGroup(groupName: string) {
  const res = await fetch(`${host}/group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: groupName })
  });
  const data = await res.json();
  return data;
}

export async function getGroupItems(groupId: number) {
  const res = await fetch(`${host}/groupItem/${groupId}`);
  const items = await res.json();
  return items;
}

export async function createGroupItem({
  groupId,
  name,
  type,
  selectedFile,
  url,
  keybind
}: {
  groupId: number;
  name: string;
  type: string;
  selectedFile: any;
  url: string;
  keybind: string;
}) {
  const res = await fetch(`${host}/groupItem/${groupId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, type, selectedFile, url, keybind })
  });
  const data = await res.json();
  return data;
}

export async function requestFileSelection() {
  const res = await fetch(`${host}/requestFileSelection`);
  const data = await res.json();
  return data;
}

export async function executeGroupItem(id: number) {
  const res = await fetch(`${host}/groupItem/execute/${id}`);
  const data = await res.json();
  return data;
}

export async function deleteGroupItem(id: number) {
  const res = await fetch(`${host}/groupItem/${id}`, {
    method: "DELETE"
  });
  const data = await res.json();
  return data;
}

export async function renameGroup(id: number, name: string) {
  const res = await fetch(`${host}/group/rename/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  });
  const data = await res.json();
  return data;
}

export async function deleteGroup(id: number) {
  const res = await fetch(`${host}/group/${id}`, {
    method: "DELETE"
  });
  const data = await res.json();
  return data;
}

export async function renameGroupItem(id: number, name: string) {
  const res = await fetch(`${host}/groupItem/rename/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  });
  const data = await res.json();
  return data;
}

export async function reorderGroupItems(groupItems: any[]) {
  const res = await fetch(`${host}/groupItem/reorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ groupItems })
  });
  const data = await res.json();
  return data;
}
