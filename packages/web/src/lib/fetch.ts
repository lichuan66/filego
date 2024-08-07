export function fetchGetApi(url: string) {
  return fetch(url).then(async (resp) => {
    if (!resp.ok) {
      const errMessage = await resp.json();
      throw new Error(errMessage);
    }
    return resp.json();
  });
}

export function fetchPostApi(url: string, data: any) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (resp) => {
    if (!resp.ok) {
      const errMessage = await resp.json();
      throw new Error(errMessage);
    }
    return resp.json();
  });
}
