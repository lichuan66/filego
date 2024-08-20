const TOKEN = "token";

export function getToken() {
  return localStorage.getItem(TOKEN);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN, token);
}
