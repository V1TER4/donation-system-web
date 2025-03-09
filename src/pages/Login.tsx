import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { setToken } from "../utils/auth";
import { useUser } from "../context/UserContext";

interface LoginProps {
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

function Login({ setIsAuthenticated }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const datas = await response.json();
                setIsAuthenticated(true);
                setToken(datas.token);
                const user = { name: datas.data.name, id: datas.data.id, email: datas.data.email };
                setUser(user);
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/dashboard", { state: { email } });
            } else {
                alert("Login failed. Please check your credentials and try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Senha</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
