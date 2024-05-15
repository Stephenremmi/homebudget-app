import { useState } from "react"
import { getToken, getUser, setToken as saveToken, setUser as saveUser } from "../localStorage";

export default function useAuth() {
    const [user, setUser] = useState(() => getUser());
    const [token, setToken] = useState(() => getToken());

    const updateUser = (user) => {
        saveUser(user); // save to local storage
        setUser(user); // save to state
    }

    const updateToken = (token) => {
        saveToken(token); // save to local storage
        setToken(token); // save to state
    }

    const clearStorage = () => {
        localStorage.clear();
        setUser(null);
        setToken(null);
    }

    return {
        updateUser,
        updateToken,
        clearStorage,
        user, 
        token,
        isAuthenticated: Boolean(user) && Boolean(token),
    }
}