let host = process.env.NEXT_PUBLIC_HOST;
import { _fetch as fetch } from "../utils/fetch";
if (typeof window !== "undefined") {
  // You now have access to `window`
  host = process.env.NEXT_PUBLIC_HOST || window.location.origin;
}
export async function getGroups() {
  const groups = await fetch(`${host}/group`);
  return groups;
}

export async function addGroup(groupName: string, type: string) {
  const data = await fetch(`${host}/group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: groupName, type: type })
  });
  return data;
}

export async function getGroupItems(groupId: number) {
  const items = await fetch(`${host}/groupItem/${groupId}`);
  return items;
}

export async function createGroupItem({
  groupId,
  name,
  type,
  selectedFile,
  url,
  keybind,
  icon
}: {
  groupId: number;
  name: string;
  type: string;
  selectedFile: any;
  url: string;
  keybind: string;
  icon?: any;
}) {
  const data = await fetch(`${host}/groupItem/${groupId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, type, selectedFile, url, keybind, icon })
  });
  return data;
}

export async function requestFileSelection() {
  const data = await fetch(`${host}/requestFileSelection`);
  return data;
}

export async function executeGroupItem(id: number) {
  const data = await fetch(`${host}/groupItem/execute/${id}`);
  return data;
}

export async function deleteGroupItem(id: number) {
  const data = await fetch(`${host}/groupItem/${id}`, {
    method: "DELETE"
  });
  return data;
}

export async function renameGroup(id: number, name: string) {
  const data = await fetch(`${host}/group/rename/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  });
  return data;
}

export async function deleteGroup(id: number) {
  const data = await fetch(`${host}/group/${id}`, {
    method: "DELETE"
  });
  return data;
}

export async function renameGroupItem(id: number, name: string) {
  const data = await fetch(`${host}/groupItem/rename/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  });
  return data;
}

export async function reorderGroupItems(groupItems: any[]) {
  const data = await fetch(`${host}/groupItem/reorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ groupItems })
  });
  return data;
}

export async function uploadIcon(selectedIcon: any) {
  const formData = new FormData();
  formData.append("file", selectedIcon);
  const data = await fetch(`${host}/upload/icon`, {
    method: "POST",
    body: formData
  });
  return data;
}
