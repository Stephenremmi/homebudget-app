
export function setUser(user) {
    if (!user) return;

    localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
    const user = localStorage.getItem("user");

    if (user) return JSON.parse(user);

    return null;
}

export function setToken(token) {
    localStorage.setItem("token", token);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getAuthHeaders() {
    return { "x-access-token": getToken() }
}
