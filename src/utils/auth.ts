import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const getToken = () => {
    return localStorage.getItem("token");
};

export const setToken = (token: string) => {
    localStorage.setItem("token", token);
};

export const removeToken = () => {
    localStorage.removeItem("token");
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        if (Date.now() >= exp * 1000) {
            removeToken();
            return false;
        }
        return true;
    } catch (error) {
        removeToken();
        return false;
    }
};

export const useAuth = () => {
    const navigate = useNavigate();

    const checkAuth = () => {
        if (!isAuthenticated()) {
            navigate("/login");
        }
    };

    return { checkAuth };
};