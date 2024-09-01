import { getToken } from "@/api/auth";
import config from "@filego/config/client";

// 将对象转换为查询字符串
function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");
}

export function fetchGetApi(url: string, params: any) {
  const queryString = objectToQueryString(params);
  const newUrl = `${url}?${queryString}`;

  const token = getToken() || "";

  return fetch(newUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (resp) => {
    if (resp.status === 401) {
      // Token 失效
      window.location.pathname = "/login";
    }
    if (!resp.ok) {
      const errMessage = await resp.json();
      throw new Error(errMessage);
    }
    return resp.json();
  });
}

export function fetchPostApi(url: string, data: any) {
  const token = getToken() || "";

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (resp) => {
    if (resp.status === 401) {
      // Token 失效
      window.location.pathname = "/login";
    }
    if (!resp.ok) {
      const errMessage = await resp.json();
      throw new Error(errMessage);
    }
    return resp.json();
  });
}

export function fetchDeleteApi(url: string, data: any) {
  const token = getToken() || "";

  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (resp) => {
    if (resp.status === 401) {
      // Token 失效
      window.location.pathname = "/login";
    }
    if (!resp.ok) {
      const errMessage = await resp.json();
      throw new Error(errMessage);
    }
    return resp.json();
  });
}

export function uploadPostApi(url: string, data: any) {
  const token = getToken() || "";

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  }).then(async (resp) => {
    if (resp.status === 401) {
      // Token 失效
      window.location.pathname = "/login";
    }
    if (!resp.ok) {
      const errMessage = await resp.json();
      throw new Error(errMessage);
    }
    return resp.json();
  });
}
