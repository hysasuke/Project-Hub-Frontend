let host = process.env.NEXT_PUBLIC_HOST;
import { _fetch as fetch } from "../utils/fetch";
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  // You now have access to `window`
  host = window.location.origin;
}
export async function getHeaderComponents() {
  const groups = await fetch(`${host}/headerComponent`);
  return groups;
}

export async function addHeaderComponent(
  type: string,
  order?: number,
  customInfo?: string,
  bondType?: string,
  bondInfo?: string
) {
  const data = await fetch(`${host}/headerComponent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ type, order, customInfo, bondType, bondInfo })
  });
  return data;
}

export async function removeHeaderComponent(id: number) {
  const data = await fetch(`${host}/headerComponent/${id}`, {
    method: "DELETE"
  });
  return data;
}

export async function reorderHeaderComponents(components: any[]) {
  const data = await fetch(`${host}/headerComponent/reorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ components })
  });
  return data;
}

export async function executeHeaderComponent(body: any) {
  const data = await fetch(`${host}/headerComponent/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return data;
}
