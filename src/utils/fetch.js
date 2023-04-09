export async function _fetch(url, options) {
  console.log("fetching: " + url);
  try {
    const response = await fetch(url, options);
    if (response) {
      const data = await response.json();
      return data;
    } else {
      return { error: 1, data: null, message: "No response from server" };
    }
  } catch (error) {
    return { error: 1, data: null, message: error.message };
  }
}
